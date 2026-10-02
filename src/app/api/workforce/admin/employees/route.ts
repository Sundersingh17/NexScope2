import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { hashPassword } from "@/lib/workforce/password";
import { audit } from "@/lib/workforce/audit";

const body = z.object({
  email: z.string().email().max(200), name: z.string().min(1).max(100), team: z.string().max(60).default("General"),
  role: z.enum(["EMPLOYEE", "ADMIN"]).default("EMPLOYEE"), password: z.string().min(10).max(200),
});

// Admin creates an account with a temporary password. The employee sets up 2FA at first login.
export const POST = handle(async (req) => {
  const admin = await requireAdmin();
  const b = body.parse(await req.json());
  try {
    const e = await prisma.wfEmployee.create({ data: { email: b.email.toLowerCase(), name: b.name, team: b.team, role: b.role, passwordHash: await hashPassword(b.password) } });
    await audit(admin.id, "EMPLOYEE_CREATED", e.id, { role: b.role });
    return Response.json({ id: e.id });
  } catch (err: any) {
    if (err?.code === "P2002") throw new HttpError(409, "That email already exists");
    throw err;
  }
});
