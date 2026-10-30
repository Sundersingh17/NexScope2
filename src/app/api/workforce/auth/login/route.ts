import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError, limit, clientIp } from "@/lib/workforce/http";
import { verifyPassword } from "@/lib/workforce/password";
import { signToken } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";

const body = z.object({ email: z.string().email().max(200), password: z.string().min(1).max(200) });

export const POST = handle(async (req) => {
  const { email, password } = body.parse(await req.json());
  limit("login:" + clientIp(req), 10, 10 * 60_000);
  const bad = new HttpError(401, "Invalid email or password");
  const e = await prisma.wfEmployee.findUnique({ where: { email: email.toLowerCase() } });
  if (!e || !e.active) throw bad;
  if (e.lockedUntil && e.lockedUntil > new Date()) throw new HttpError(423, "Account temporarily locked. Try again in 15 minutes.");
  if (!(await verifyPassword(e.passwordHash, password))) {
    const n = e.failedLogins + 1;
    await prisma.wfEmployee.update({ where: { id: e.id }, data: { failedLogins: n, lockedUntil: n >= 5 ? new Date(Date.now() + 15 * 60_000) : null } });
    await audit(e.id, "LOGIN_FAILED");
    throw bad;
  }
  await prisma.wfEmployee.update({ where: { id: e.id }, data: { failedLogins: 0, lockedUntil: null } });
  // Password alone never signs anyone in: this token only unlocks the 2FA step (5 minutes).
  return Response.json({ step: e.totpEnabled ? "totp" : "setup", token: await signToken(e.id, "pre", "5m") });
});
