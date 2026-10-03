import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { audit } from "@/lib/workforce/audit";
import { ensureReports } from "@/lib/workforce/reports-db";

// Called hourly by a scheduler (see .github/workflows/wf-hourly.yml) with header x-cron-secret.
// 1) creates due hourly reports  2) auto-closes forgotten sessions older than WF_MAX_SESSION_HOURS (default 14).
export const POST = handle(async (req) => {
  const secret = process.env.WF_CRON_SECRET ?? "";
  const given = req.headers.get("x-cron-secret") ?? "";
  if (secret.length < 24 || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) throw new HttpError(401, "Unauthorized");
  const maxMs = Number(process.env.WF_MAX_SESSION_HOURS ?? 14) * 3600_000;
  const open = await prisma.wfSession.findMany({ where: { endedAt: null } });
  let closed = 0;
  for (const s of open) {
    if (Date.now() - s.startedAt.getTime() > maxMs) {
      const end = new Date(s.startedAt.getTime() + maxMs);
      await prisma.wfSession.update({ where: { id: s.id }, data: { endedAt: end } });
      await audit(s.employeeId, "SESSION_AUTO_CLOSED", s.id);
      await ensureReports({ ...s, endedAt: end });
      closed++;
    } else await ensureReports(s);
  }
  return Response.json({ openSessions: open.length, autoClosed: closed });
});
