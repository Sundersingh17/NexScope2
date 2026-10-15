
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { audit } from "@/lib/workforce/audit";
import { ensureReports } from "@/lib/workforce/reports-db";
import { lockWorkforceSession } from "@/lib/workforce/session-lock";

// Called hourly by a scheduler (see .github/workflows/wf-hourly.yml) with header x-cron-secret.
// 1) creates due hourly reports  2) auto-closes forgotten sessions older than WF_MAX_SESSION_HOURS (default 14).
export const POST = handle(async (req) => {
  const secret = process.env.WF_CRON_SECRET ?? "";
  const given = req.headers.get("x-cron-secret") ?? "";

  if (
    secret.length < 24 ||
    given.length !== secret.length ||
    !timingSafeEqual(Buffer.from(given), Buffer.from(secret))
  ) {
    throw new HttpError(401, "Unauthorized");
  }

  const maxHours = Number(process.env.WF_MAX_SESSION_HOURS ?? 14);
  if (!Number.isFinite(maxHours) || maxHours <= 0) {
    throw new HttpError(500, "Invalid WF_MAX_SESSION_HOURS configuration");
  }

  const maxMs = maxHours * 3600_000;
  const open = await prisma.wfSession.findMany({
    where: { endedAt: null },
  });

  let closed = 0;

  for (const candidate of open) {
    if (Date.now() - candidate.startedAt.getTime() > maxMs) {
      const result = await prisma.$transaction(async (tx) => {
        const session = await lockWorkforceSession(tx, candidate.id);

        if (
          !session ||
          session.endedAt !== null ||
          session.employeeId !== candidate.employeeId
        ) {
          return null;
        }

        if (Date.now() - session.startedAt.getTime() <= maxMs) {
          return null;
        }

        const end = new Date(session.startedAt.getTime() + maxMs);

        const updated = await tx.wfSession.updateMany({
          where: { id: session.id, endedAt: null },
          data: { endedAt: end },
        });

        if (updated.count !== 1) return null;

        await tx.wfLivePosition.deleteMany({
          where: { sessionId: session.id },
        });

        await tx.wfLocationHold.updateMany({
          where: { sessionId: session.id, endedAt: null },
          data: { endedAt: end },
        });


        return { ...session, endedAt: end };

      });

      if (result) {
        await audit(result.employeeId, "SESSION_AUTO_CLOSED", result.id);
        await ensureReports(result);
        closed++;
      }
    } else {
      await ensureReports(candidate);
    }
  }

  return Response.json({ openSessions: open.length, autoClosed: closed });
});
