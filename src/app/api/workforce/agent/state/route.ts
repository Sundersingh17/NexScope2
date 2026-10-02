import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireDevice } from "@/lib/workforce/agent-auth";

// Cheap poll for the agent: should I be collecting right now?
export const GET = handle(async (req) => {
  const { employee } = await requireDevice(req);
  const s = await prisma.wfSession.findFirst({ where: { employeeId: employee.id, endedAt: null } });
  return Response.json({ state: s ? "session_open" : "session_closed", startedAt: s?.startedAt ?? null });
});
