import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";

export const PATCH = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const admin = await requireAdmin();
  const { id } = await ctx.params;
  const a = await prisma.wfAlert.findUnique({ where: { id } });
  if (!a) throw new HttpError(404, "Alert not found");
  await prisma.wfAlert.update({ where: { id }, data: { resolvedAt: new Date(), resolvedById: admin.id } });
  await audit(admin.id, "ALERT_RESOLVED", a.employeeId, { alertId: id });
  return Response.json({ ok: true });
});
