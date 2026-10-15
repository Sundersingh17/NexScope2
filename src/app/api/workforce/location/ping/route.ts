
import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError, limit, clientIp } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { evaluate } from "@/lib/workforce/geo";
import { transition, zoneFor } from "@/lib/workforce/zones";
import { audit } from "@/lib/workforce/audit";
import { lockWorkforceSession } from "@/lib/workforce/session-lock";

const body = z.object({
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  accuracy: z.number().finite().nonnegative(),
});

// Only report location while an employee has an open work session.
// Leaving an office-based session creates a hold; returning never clears it.
// Remote sessions are not subject to office-zone exit holds.
export const POST = handle(async (req) => {
  const employee = await requireEmployee();
  limit("ping:" + employee.id, 12, 60 * 60_000);

  const fix = body.parse(await req.json());

  // This lookup identifies a candidate session only. Its state is rechecked
  // after acquiring the shared lock inside the transaction.
  const candidate = await prisma.wfSession.findFirst({
    where: {
      employeeId: employee.id,
      endedAt: null,
    },
    select: { id: true },
  });

  if (!candidate) {
    throw new HttpError(
      409,
      "No open work session - location is not shared outside a session.",
    );
  }

  const office = await prisma.wfOffice.findFirst();

  if (!office) {
    throw new HttpError(500, "Office location is not configured.");
  }

  const geo = evaluate(
    {
      lat: fix.lat,
      lng: fix.lng,
      accuracyM: fix.accuracy,
    },
    office,
    { maxAccuracyM: 200 },
  );

  const ip = clientIp(req);
  const netMatch = office.allowedIps.length
    ? ip !== "unknown" && office.allowedIps.includes(ip)
    : null;

  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const locked = await lockWorkforceSession(tx, candidate.id);

    if (
      !locked ||
      locked.employeeId !== employee.id ||
      locked.endedAt !== null
    ) {
      throw new HttpError(
        409,
        "No open work session - location is not shared outside a session.",
      );
    }

    // Read session and position state only after the lock is held.
    const session = await tx.wfSession.findUnique({
      where: { id: locked.id },
    });

    if (!session || session.endedAt !== null) {
      throw new HttpError(
        409,
        "No open work session - location is not shared outside a session.",
      );
    }

    const existing = await tx.wfLivePosition.findUnique({
      where: { sessionId: session.id },
    });

    const previousKnown = existing?.lastKnown ?? session.zone;
    const zone = zoneFor(geo, session.zone, netMatch);
    const move = transition(previousKnown, zone);

    const positionData = {
      employeeId: employee.id,
      zone,
      netMatch,
      ...(zone === "UNKNOWN"
        ? {}
        : {
            lat: fix.lat,
            lng: fix.lng,
            accM: Math.round(fix.accuracy),
            lastKnown: zone,
            updatedAt: now,
          }),
    };

    if (existing) {
      await tx.wfLivePosition.update({
        where: { sessionId: session.id },
        data: positionData,
      });
    } else if (zone !== "UNKNOWN") {
      await tx.wfLivePosition.create({
        data: {
          sessionId: session.id,
          lat: fix.lat,
          lng: fix.lng,
          accM: Math.round(fix.accuracy),
          lastKnown: zone,
          ...positionData,
        },
      });
    }

    let holdCreated = false;

    if (move === "EXIT") {
      if (session.zone === "OFFICE") {
        // Check for an active hold inside the same transaction.
        const activeHold = await tx.wfLocationHold.findFirst({
          where: {
            sessionId: session.id,
            endedAt: null,
          },
          select: { id: true },
        });

        await tx.wfLocationEvent.create({
          data: {
            employeeId: employee.id,
            sessionId: session.id,
            kind: "ZONE_EXIT",
            distM: geo.distM,
            accM: Math.round(fix.accuracy),
            result: "FLAGGED",
          },
        });

        if (!activeHold) {
          await tx.wfLocationHold.create({
            data: {
              employeeId: employee.id,
              sessionId: session.id,
              startedAt: now,
              status: "PENDING",
            },
          });

          await tx.wfAlert.create({
            data: {
              employeeId: employee.id,
              sessionId: session.id,
              kind: "ZONE_EXIT",
              message:
                "Left the office zone. Work tracking is on hold pending administrator review.",
            },
          });

          holdCreated = true;
        }
      } else {
        // Remote sessions record exits but do not create office-zone holds.
        await tx.wfLocationEvent.create({
          data: {
            employeeId: employee.id,
            sessionId: session.id,
            kind: "ZONE_EXIT",
            distM: geo.distM,
            accM: Math.round(fix.accuracy),
            result: "RECORDED",
          },
        });
      }
    } else if (move === "ENTER") {
      await tx.wfLocationEvent.create({
        data: {
          employeeId: employee.id,
          sessionId: session.id,
          kind: "ZONE_ENTER",
          distM: geo.distM,
          accM: Math.round(fix.accuracy),
          result: "RECORDED",
        },
      });

      // Returning to the office never clears an existing hold.
    }

    return {
      sessionId: session.id,
      zone,
      move,
      officeSession: session.zone === "OFFICE",
      holdCreated,
    };
  });

  if (result.move === "EXIT" && result.officeSession) {
    await audit(employee.id, "ZONE_EXIT", result.sessionId, {
      holdCreated: result.holdCreated,
    });
  }

  return Response.json({
    zone: result.zone,
    holdRequired: result.officeSession && result.move === "EXIT",
    nextPingSec: 300,
  });
});
