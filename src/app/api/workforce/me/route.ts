import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { minutesFor } from "@/lib/workforce/stats";

export const GET = handle(async () => {
  const e = await requireEmployee();
  const open = await prisma.wfSession.findFirst({ where: { employeeId: e.id, endedAt: null } });
  const mins = await minutesFor(open ? [open.id] : []);
  const devices = await prisma.wfDevice.findMany({ where: { employeeId: e.id, revokedAt: null }, select: { id: true, name: true, lastSeenAt: true, createdAt: true } });
  return Response.json({
    employee: { name: e.name, role: e.role, team: e.team },
    openSession: open ? { id: open.id, startedAt: open.startedAt, zone: open.zone, ...mins.get(open.id) } : null,
    devices,
  });
});
