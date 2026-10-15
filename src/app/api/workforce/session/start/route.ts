
import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { evaluate } from "@/lib/workforce/geo";
import { audit } from "@/lib/workforce/audit";

const body = z.object({
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  accuracy: z.number().finite().nonnegative(),
});

export const POST = handle(async (req) => {
  const e = await requireEmployee();
  const fix = body.parse(await req.json());

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
  );

  let zone: "OFFICE" | "REMOTE" | null =
    geo.ok && geo.inside ? "OFFICE" : null;

  let remoteRequestId: string | undefined;

  if (!zone && geo.reason !== "INVALID_FIX") {
    const now = new Date();

    const approvedRequest = await prisma.wfRemoteRequest.findFirst({
      where: {
        employeeId: e.id,
        status: "APPROVED",
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
    });

    if (approvedRequest) {
      zone = "REMOTE";
      remoteRequestId = approvedRequest.id;
    }
  }

  await prisma.wfLocationEvent.create({
    data: {
      employeeId: e.id,
      kind: "CHECK_IN",
      distM: geo.distM,
      accM: Math.round(fix.accuracy),
      result: zone ? `ALLOWED_${zone}` : "BLOCKED",
    },
  });

  if (!zone) {
    await audit(e.id, "CHECK_IN_BLOCKED", e.id, {
      reason: geo.reason,
      distM: geo.distM,
    });

    throw new HttpError(
      403,
      geo.reason === "LOW_ACCURACY"
        ? "GPS accuracy is too low. Move near a window or enable Wi-Fi location, then try again."
        : "You are outside the office zone. Ask an administrator to approve remote work.",
    );
  }

  // The advisory lock is scoped to this transaction and employee.
  // Every session-start path must use the same lock key convention.
  const session = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`
      SELECT pg_advisory_xact_lock(
        hashtext('workforce-session-start'),
        hashtext(${e.id})
      )
    `;

    const open = await tx.wfSession.findFirst({
      where: {
        employeeId: e.id,
        endedAt: null,
      },
      select: { id: true },
    });

    if (open) {
      throw new HttpError(
        409,
        "You already have an open work session.",
      );
    }

    return tx.wfSession.create({
      data: {
        employeeId: e.id,
        zone,
        remoteRequestId,
        startDistM: geo.distM,
      },
    });
  });

  await audit(e.id, "SESSION_START", session.id, { zone });

  return Response.json({
    sessionId: session.id,
    zone,
    distM: geo.distM,
    startedAt: session.startedAt,
  });
});
