
import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireDevice } from "@/lib/workforce/agent-auth";

// Cheap poll for the agent: should I be collecting right now?
export const GET = handle(async (req) => {
  const { employee } = await requireDevice(req);

  const session = await prisma.wfSession.findFirst({
    where: {
      employeeId: employee.id,
      endedAt: null,
    },
    select: {
      id: true,
      startedAt: true,
    },
  });

  if (!session) {
    return Response.json({
      state: "session_closed",
      startedAt: null,
    });
  }

  const activeHold = await prisma.wfLocationHold.findFirst({
    where: {
      sessionId: session.id,
      endedAt: null,
    },
    select: {
      status: true,
    },
  });

  if (activeHold) {
    return Response.json({
      state: "session_held",
      holdStatus: activeHold.status,
      startedAt: session.startedAt,
    });
  }

  return Response.json({
    state: "session_open",
    startedAt: session.startedAt,
  });
});
