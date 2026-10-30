import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";

// Revoke a device. Owners can revoke their own; admins can revoke any. Takes effect on the next sync.
export const PATCH = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const e = await requireEmployee();
  const { id } = await ctx.params;
  const d = await prisma.wfDevice.findUnique({ where: { id } });
  if (!d || (d.employeeId !== e.id && e.role !== "ADMIN")) throw new HttpError(404, "Device not found");
  await prisma.wfDevice.update({ where: { id }, data: { revokedAt: d.revokedAt ?? new Date() } });
  await audit(e.id, "DEVICE_REVOKED", d.employeeId, { deviceId: id });
  return Response.json({ ok: true });
});
