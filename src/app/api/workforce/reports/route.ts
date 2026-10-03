import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { decrypt } from "@/lib/workforce/crypto";
import { ensureReports } from "@/lib/workforce/reports-db";

// Employee: own hourly reports (newest first). Creates any that are due.
export const GET = handle(async () => {
  const e = await requireEmployee();
  for (const s of await prisma.wfSession.findMany({ where: { employeeId: e.id }, orderBy: { startedAt: "desc" }, take: 3 })) await ensureReports(s);
  const rows = await prisma.wfHourlyReport.findMany({ where: { employeeId: e.id }, orderBy: { periodStart: "desc" }, take: 48 });
  const files = await prisma.wfReportFile.findMany({ where: { reportId: { in: rows.map((r) => r.id) } }, select: { id: true, reportId: true, name: true, sizeB: true } });
  return Response.json({ reports: rows.map((r) => ({ id: r.id, periodStart: r.periodStart, periodEnd: r.periodEnd, activeMin: r.activeMin, idleMin: r.idleMin, topApps: r.topApps, partial: r.partial, project: r.project ?? "", note: r.noteEnc ? decrypt(r.noteEnc) : "", status: r.status, submittedAt: r.submittedAt, files: files.filter((f) => f.reportId === r.id) })) });
});
