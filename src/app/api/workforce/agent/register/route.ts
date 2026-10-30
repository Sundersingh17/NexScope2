import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError, limit, clientIp } from "@/lib/workforce/http";
import { hashSecret, newDeviceToken } from "@/lib/workforce/agent";
import { audit } from "@/lib/workforce/audit";

const body = z.object({ code: z.string().min(6).max(12), deviceName: z.string().min(1).max(60) });

// Agent (no login): exchanges a pairing code for its own device token. The token is shown ONCE.
export const POST = handle(async (req) => {
  const { code, deviceName } = body.parse(await req.json());
  limit("reg:" + clientIp(req), 10, 10 * 60_000);
  const bad = new HttpError(400, "Invalid or expired pairing code");
  const pc = await prisma.wfPairingCode.findUnique({ where: { codeHash: hashSecret(code.toUpperCase().replace(/[^A-Z0-9]/g, "")) } });
  if (!pc || pc.usedAt || pc.expiresAt < new Date()) throw bad;
  const claimed = await prisma.wfPairingCode.updateMany({ where: { id: pc.id, usedAt: null }, data: { usedAt: new Date() } });
  if (claimed.count !== 1) throw bad; // someone else used it a moment ago
  const token = newDeviceToken();
  const d = await prisma.wfDevice.create({ data: { employeeId: pc.employeeId, name: deviceName, tokenHash: hashSecret(token) } });
  const emp = await prisma.wfEmployee.findUnique({ where: { id: pc.employeeId }, select: { name: true } });
  await audit(pc.employeeId, "DEVICE_REGISTERED", d.id);
  return Response.json({ deviceId: d.id, deviceToken: token, employeeName: emp?.name });
});
