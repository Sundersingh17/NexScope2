
import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { minutesFor } from "@/lib/workforce/stats";
import { aggregate } from "@/lib/workforce/analytics";

// Team-level analytics. Never per-person rankings; small teams are hidden.
export const GET = handle(async (req) => {
  await requireAdmin();

  const requestedDays = Number(
    new URL(req.url).searchParams.get("days"),
  );
  const days = Math.min(
    Math.max(Number.isFinite(requestedDays) && requestedDays ? requestedDays : 7, 1),
    30,
  );

  // Use calendar-day boundaries consistently for the attendance chart.
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const [sess, emps, rep] = await Promise.all([
    prisma.wfSession.findMany({
      where: { startedAt: { gte: start, lte: end } },
    }),
    prisma.wfEmployee.findMany({
      where: { active: true },
      select: { id: true, team: true },
    }),
    prisma.wfHourlyReport.groupBy({
      by: ["status"],
      where: { periodStart: { gte: start, lte: end } },
      _count: { _all: true },
    }),
  ]);

  const team = new Map(emps.map((e) => [e.id, e.team]));
  const sizes: Record<string, number> = {};

  emps.forEach((e) => {
    sizes[e.team] = (sizes[e.team] ?? 0) + 1;
  });

  const mins = await minutesFor(sess.map((s) => s.id));

  const rows = sess.map((s) => ({
    employeeId: s.employeeId,
    team: team.get(s.employeeId) ?? "Former staff",
    startedAt: s.startedAt,
    endedAt: s.endedAt,
    zone: s.zone,
    active: mins.get(s.id)?.active ?? 0,
    idle: mins.get(s.id)?.idle ?? 0,
  }));

  const count = (status: string) =>
    rep.find((r) => r.status === status)?._count._all ?? 0;

  const submitted = count("SUBMITTED");
  const total = submitted + count("DRAFT");
  const minTeam = Math.max(
    3,
    Math.floor(Number(process.env.WF_MIN_TEAM ?? 3)) || 3,
  );

  return Response.json({
    ...aggregate(rows, sizes, minTeam, new Date(), { start, end }),
    reportsSubmittedPct: total
      ? Math.round((100 * submitted) / total)
      : null,
    minTeam,
  });
});
