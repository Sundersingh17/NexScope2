import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireEmployee, requireAdmin } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";

// Employee: ask for remote-work permission.
export const POST = handle(async (req) => {
  const e = await requireEmployee();
  const { reason } = z.object({ reason: z.string().min(3).max(300) }).parse(await req.json());
  const r = await prisma.wfRemoteRequest.create({ data: { employeeId: e.id, reason } });
  await audit(e.id, "REMOTE_REQUESTED", r.id);
  return Response.json({ id: r.id, status: r.status });
});

// Admin: list requests (pending first).
export const GET = handle(async () => {
  await requireAdmin();
  const rows = await prisma.wfRemoteRequest.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 100, include: { employee: { select: { name: true, team: true } } } });
  return Response.json({ requests: rows });
});
