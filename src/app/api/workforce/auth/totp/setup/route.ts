import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { readToken } from "@/lib/workforce/auth";
import { encrypt } from "@/lib/workforce/crypto";
import { newSecret, provisioning } from "@/lib/workforce/totp";

export const POST = handle(async (req) => {
  const { token } = z.object({ token: z.string() }).parse(await req.json());
  const id = await readToken(token, "pre");
  const e = await prisma.wfEmployee.findUnique({ where: { id } });
  if (!e) throw new HttpError(401, "Invalid session");
  if (e.totpEnabled) throw new HttpError(409, "2FA is already set up. Ask an administrator to reset it.");
  const secret = newSecret();
  await prisma.wfEmployee.update({ where: { id }, data: { totpSecretEnc: encrypt(secret) } });
  return Response.json(await provisioning(e.email, secret)); // { otpauth, qr }
});
