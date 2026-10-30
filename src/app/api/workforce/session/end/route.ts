
import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";
import { evaluate } from "@/lib/workforce/geo";
import { lockWorkforceSession } from "@/lib/workforce/session-lock";

// Check-out is allowed from anywhere. Location is recorded if available.
const body = z
  .object({
    lat: z.number(),
    lng: z.number(),
    accuracy: z.number(),
  })
  .partial();

export const POST = handle(async (req) => {
  const e = await requireEmployee();
  const fix = body.parse(await req.json().catch(() => ({})));

  // Find the candidate session. Its state must be rechecked under lock.
  const open = await prisma.wfSession.findFirst({
    where: {
      employeeId: e.id,
      endedAt: null,
    },
    select: { id: true },
  });

  if (!open) {
    throw new HttpError(409, "No open work session.");
  }

  const endedAt = new Date();

  // Lock and recheck the session before ending it. Session cleanup is atomic.
  const ended = await prisma.$transaction(async (tx) => {
    const locked = await lockWorkforceSession(tx, open.id);

    if (!locked || locked.employeeId !== e.id || locked.endedAt !== null) {
      throw new HttpError(409, "No open work session.");
    }

    const session = await tx.wfSession.update({
      where: { id: locked.id },
      data: { endedAt },
    });

    await tx.wfLivePosition.deleteMany({
      where: { sessionId: locked.id },
    });

    // Checkout ends the hold interval but does not approve or resume it.
    await tx.wfLocationHold.updateMany({
      where: {
        sessionId: locked.id,
        endedAt: null,
      },
      data: { endedAt },
    });

    return session;
  });

  const office = await prisma.wfOffice.findFirst();

  if (
    office &&
    fix.lat !== undefined &&
    fix.lng !== undefined &&
    fix.accuracy !== undefined
  ) {
    const g = evaluate(
      {
        lat: fix.lat,
        lng: fix.lng,
        accuracyM: fix.accuracy,
      },
      office,
    );

    await prisma.wfLocationEvent.create({
      data: {
        employeeId: e.id,
        sessionId: open.id,
        kind: "CHECK_OUT",
        distM: g.distM,
        accM: Math.round(fix.accuracy),
        result: "RECORDED",
      },
    });
  }

  await audit(e.id, "SESSION_END", open.id);

  const minutes = Math.round(
    (ended.endedAt!.getTime() - ended.startedAt.getTime()) / 60000,
  );

  return Response.json({ ok: true, minutes });
});
