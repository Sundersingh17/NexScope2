import { prisma } from "./db";
import { hourWindows, summarize } from "./reports";

// Creates any missing hourly reports for a session. Safe to call repeatedly (unique per session+hour).
export async function ensureReports(s: { id: string; employeeId: string; startedAt: Date; endedAt: Date | null }) {
  // For open sessions wait 2 minutes after the hour so the agent's last samples have arrived.
  const wins = hourWindows(s.startedAt, new Date(Date.now() - (s.endedAt ? 0 : 120_000)), s.endedAt);
  if (!wins.length) return;
  const have = new Set((await prisma.wfHourlyReport.findMany({ where: { sessionId: s.id }, select: { periodStart: true } })).map((r) => r.periodStart.getTime()));
  for (const w of wins) {
    if (have.has(w.start.getTime())) continue;
    const rows = await prisma.wfAgentMinute.findMany({ where: { sessionId: s.id, minute: { gte: w.start, lt: w.end } }, select: { appName: true, idle: true } });
    const m = summarize(rows);
    await prisma.wfHourlyReport.createMany({
      data: [{ employeeId: s.employeeId, sessionId: s.id, periodStart: w.start, periodEnd: w.end, activeMin: m.active, idleMin: m.idle, topApps: m.topApps as any, partial: w.partial }],
      skipDuplicates: true,
    });
  }
}
