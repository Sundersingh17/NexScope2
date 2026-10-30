import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Admin list. Filters: employeeId, team, status, from, to (ISO dates). Notes are NOT included here.
export const GET = handle(async (req) => {
  await requireAdmin();
  const q = new URL(req.url).searchParams;
  const emps = await prisma.wfEmployee.findMany({ where: q.get("team") ? { team: q.get("team")! } : {}, select: { id: true, name: true, team: true } });
  const ids = q.get("employeeId") ? [q.get("employeeId")!] : emps.map((e) => e.id);
  const from = q.get("from") ? new Date(q.get("from")!) : undefined, to = q.get("to") ? new Date(q.get("to")!) : undefined;
  const rows = await prisma.wfHourlyReport.findMany({
    where: { employeeId: { in: ids }, ...(q.get("status") ? { status: q.get("status")! } : {}), ...(from || to ? { periodStart: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}) },
    orderBy: { periodStart: "desc" }, take: 200,
  });
  const files = await prisma.wfReportFile.groupBy({ by: ["reportId"], where: { reportId: { in: rows.map((r) => r.id) } }, _count: { _all: true } });
  const who = new Map(emps.map((e) => [e.id, e]));
  return Response.json({ reports: rows.map((r) => ({ id: r.id, employee: who.get(r.employeeId)?.name ?? "?", team: who.get(r.employeeId)?.team ?? "", periodStart: r.periodStart, periodEnd: r.periodEnd, activeMin: r.activeMin, idleMin: r.idleMin, topApps: r.topApps, project: r.project, status: r.status, partial: r.partial, files: files.find((f) => f.reportId === r.id)?._count._all ?? 0 })) });
});
