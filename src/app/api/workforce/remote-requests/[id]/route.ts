import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";

// Admin: approve (validity window, default 8 hours) or deny.
const body = z.object({ decision: z.enum(["APPROVED", "DENIED"]), hours: z.number().min(1).max(72).default(8) });

export const PATCH = handle(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const admin = await requireAdmin();
  const { id } = await ctx.params;
  const { decision, hours } = body.parse(await req.json());
  const r = await prisma.wfRemoteRequest.findUnique({ where: { id } });
  if (!r) throw new HttpError(404, "Request not found");
  if (r.status !== "PENDING") throw new HttpError(409, "Already decided");
  const now = new Date();
  await prisma.wfRemoteRequest.update({
    where: { id },
    data: { status: decision, decidedById: admin.id, decidedAt: now, ...(decision === "APPROVED" ? { validFrom: now, validUntil: new Date(now.getTime() + hours * 3600_000) } : {}) },
  });
  await audit(admin.id, decision === "APPROVED" ? "REMOTE_APPROVED" : "REMOTE_DENIED", r.employeeId, { requestId: id });
  return Response.json({ ok: true });
});
