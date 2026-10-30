import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";

export const PATCH = handle(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const admin = await requireAdmin();
  const { id } = await ctx.params;
  const { active } = z.object({ active: z.boolean() }).parse(await req.json());
  if (id === admin.id) throw new HttpError(400, "You cannot disable your own account");
  await prisma.wfEmployee.update({ where: { id }, data: { active } });
  await audit(admin.id, active ? "EMPLOYEE_ENABLED" : "EMPLOYEE_DISABLED", id);
  return Response.json({ ok: true });
});
