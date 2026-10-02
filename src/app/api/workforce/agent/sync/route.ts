import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireDevice } from "@/lib/workforce/agent-auth";
import { normalizeBatch } from "@/lib/workforce/agent";

const body = z.object({ samples: z.array(z.unknown()) });

// Agent sends per-minute samples. Accepted ONLY while the employee has an open work session.
export const POST = handle(async (req) => {
  const { device, employee } = await requireDevice(req);
  const { samples } = body.parse(await req.json());
  const s = await prisma.wfSession.findFirst({ where: { employeeId: employee.id, endedAt: null } });
  if (!s) return Response.json({ state: "session_closed", accepted: 0 }); // agent must stop collecting
  const { records, rejected } = normalizeBatch(samples, s.startedAt);
  const r = await prisma.wfAgentMinute.createMany({
    data: records.map((x) => ({ sessionId: s.id, deviceId: device.id, minute: x.minute, appName: x.appName, idle: x.idle })),
    skipDuplicates: true,
  });
  return Response.json({ state: "session_open", sessionId: s.id, accepted: r.count, rejected });
});
