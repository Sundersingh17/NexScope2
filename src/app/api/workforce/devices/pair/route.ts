import { prisma } from "@/lib/workforce/db";
import { handle, limit } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { hashSecret, newPairingCode } from "@/lib/workforce/agent";
import { audit } from "@/lib/workforce/audit";

// Signed-in employee asks for a single-use code (10 min) to pair a PC with the desktop agent.
export const POST = handle(async () => {
  const e = await requireEmployee();
  limit("pair:" + e.id, 5, 10 * 60_000);
  await prisma.wfPairingCode.deleteMany({ where: { employeeId: e.id, usedAt: null } });
  const code = newPairingCode();
  const expiresAt = new Date(Date.now() + 10 * 60_000);
  await prisma.wfPairingCode.create({ data: { employeeId: e.id, codeHash: hashSecret(code), expiresAt } });
  await audit(e.id, "DEVICE_PAIR_CODE");
  return Response.json({ code, expiresAt });
});
