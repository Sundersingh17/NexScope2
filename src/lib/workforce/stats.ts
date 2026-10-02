import { prisma } from "./db";

// Each WfAgentMinute row = one minute. Returns active/idle minutes per session.
export async function minutesFor(ids: string[]) {
  const m = new Map<string, { active: number; idle: number }>();
  ids.forEach((i) => m.set(i, { active: 0, idle: 0 }));
  if (!ids.length) return m;
  const rows = await prisma.wfAgentMinute.groupBy({ by: ["sessionId", "idle"], where: { sessionId: { in: ids } }, _count: { _all: true } });
  for (const r of rows) {
    const x = m.get(r.sessionId)!;
    if (r.idle) x.idle = r._count._all; else x.active = r._count._all;
  }
  return m;
}
