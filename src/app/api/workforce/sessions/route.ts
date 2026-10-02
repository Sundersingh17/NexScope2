import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { minutesFor } from "@/lib/workforce/stats";

// Employee's own attendance history.
export const GET = handle(async (req) => {
  const e = await requireEmployee();
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit")) || 14, 60);
  const rows = await prisma.wfSession.findMany({ where: { employeeId: e.id }, orderBy: { startedAt: "desc" }, take: limit });
  const mins = await minutesFor(rows.map((r) => r.id));
  return Response.json({ sessions: rows.map((r) => ({ id: r.id, startedAt: r.startedAt, endedAt: r.endedAt, zone: r.zone, ...mins.get(r.id) })) });
});
