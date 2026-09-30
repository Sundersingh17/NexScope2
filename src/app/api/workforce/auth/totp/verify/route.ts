import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError, limit } from "@/lib/workforce/http";
import { readToken, setSessionCookie } from "@/lib/workforce/auth";
import { checkCode } from "@/lib/workforce/totp";
import { audit } from "@/lib/workforce/audit";

export const POST = handle(async (req) => {
  const { token, code } = z.object({ token: z.string(), code: z.string().regex(/^\d{6}$/) }).parse(await req.json());
  const id = await readToken(token, "pre");
  limit("totp:" + id, 5, 5 * 60_000);
  const e = await prisma.wfEmployee.findUnique({ where: { id } });
  if (!e || !e.active || !e.totpSecretEnc) throw new HttpError(401, "Invalid session");
  const step = checkCode(code, e.totpSecretEnc);
  if (step === null || (e.totpLastStep !== null && step <= e.totpLastStep)) {
    await audit(id, "TOTP_FAILED");
    throw new HttpError(401, "Invalid or already-used code");
  }
  await prisma.wfEmployee.update({ where: { id }, data: { totpEnabled: true, totpLastStep: step } });
  await setSessionCookie(id);
  await audit(id, e.totpEnabled ? "LOGIN_OK" : "TOTP_ENABLED");
  return Response.json({ ok: true, role: e.role, name: e.name });
});
