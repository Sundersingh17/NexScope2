import { prisma } from "@/lib/workforce/db";
import { handle, clientIp } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { liveFlags } from "@/lib/workforce/zones";

// Live map data: ONLY open sessions, latest position only.
export const GET = handle(async (req) => {
  await requireAdmin();
  const [office, open] = await Promise.all([prisma.wfOffice.findFirst(), prisma.wfSession.findMany({ where: { endedAt: null } })]);
  const ids = open.map((s) => s.id);
  await prisma.wfLivePosition.deleteMany({ where: { sessionId: { notIn: ids } } }); // nothing is kept after a session ends
  const [pos, emps, devs, alerts] = await Promise.all([
    prisma.wfLivePosition.findMany({ where: { sessionId: { in: ids } } }),
    prisma.wfEmployee.findMany({ where: { id: { in: open.map((s) => s.employeeId) } }, select: { id: true, name: true, team: true } }),
    prisma.wfDevice.findMany({ where: { revokedAt: null }, select: { employeeId: true, lastSeenAt: true } }),
    prisma.wfAlert.findMany({ where: { resolvedAt: null }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const now = Date.now();
  const rows = open.map((s) => {
    const p = pos.find((x) => x.sessionId === s.id);
    const seen = Math.max(0, ...devs.filter((d) => d.employeeId === s.employeeId && d.lastSeenAt).map((d) => d.lastSeenAt!.getTime()));
    const e = emps.find((x) => x.id === s.employeeId);
    return {
      employeeId: s.employeeId, name: e?.name ?? "?", team: e?.team ?? "", startedAt: s.startedAt, sessionZone: s.zone,
      position: p ? { lat: p.lat, lng: p.lng, accM: p.accM, zone: p.zone, netMatch: p.netMatch, updatedAt: p.updatedAt } : null,
      flags: liveFlags({ now, startedAt: s.startedAt.getTime(), lastPingAt: p?.updatedAt.getTime() ?? null, agentSeenAt: seen || null }),
    };
  });
  const names = new Map((await prisma.wfEmployee.findMany({ where: { id: { in: alerts.map((a) => a.employeeId) } }, select: { id: true, name: true } })).map((x) => [x.id, x.name]));
  return Response.json({
    office: office ? { name: office.name, lat: office.lat, lng: office.lng, radiusM: office.radiusM, allowedIps: office.allowedIps } : null,
    yourIp: clientIp(req), rows,
    alerts: alerts.map((a) => ({ id: a.id, employee: names.get(a.employeeId) ?? "?", kind: a.kind, message: a.message, createdAt: a.createdAt })),
  });
});
