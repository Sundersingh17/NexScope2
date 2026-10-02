import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { minutesFor } from "@/lib/workforce/stats";

export const GET = handle(async () => {
  await requireAdmin();
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const [emps, open, ended, devs, pending] = await Promise.all([
    prisma.wfEmployee.findMany({ where: { active: true }, select: { id: true, name: true, team: true, role: true }, orderBy: { name: "asc" } }),
    prisma.wfSession.findMany({ where: { endedAt: null } }),
    prisma.wfSession.findMany({ where: { endedAt: { gte: startOfDay } }, select: { employeeId: true } }),
    prisma.wfDevice.findMany({ where: { revokedAt: null }, select: { employeeId: true, lastSeenAt: true } }),
    prisma.wfRemoteRequest.count({ where: { status: "PENDING" } }),
  ]);
  const mins = await minutesFor(open.map((s) => s.id));
  const seen = new Map<string, number>();
  devs.forEach((d) => { if (d.lastSeenAt) seen.set(d.employeeId, Math.max(seen.get(d.employeeId) ?? 0, d.lastSeenAt.getTime())); });
  const now = Date.now();
  const rows = emps.map((e) => {
    const s = open.find((x) => x.employeeId === e.id);
    const agentOnline = now - (seen.get(e.id) ?? 0) < 3 * 60_000;
    const m = s ? mins.get(s.id) : undefined;
    return {
      ...e,
      status: s ? "working" : ended.some((x) => x.employeeId === e.id) ? "out" : "offline",
      zone: s?.zone ?? null, startedAt: s?.startedAt ?? null,
      activeMin: m?.active ?? 0, idleMin: m?.idle ?? 0, agentOnline,
      alert: s && !agentOnline ? "Agent offline during session" : null,
    };
  });
  const count = (k: string) => rows.filter((r) => r.status === k).length;
  return Response.json({ rows, counts: { working: count("working"), out: count("out"), offline: count("offline"), pendingRequests: pending } });
});
