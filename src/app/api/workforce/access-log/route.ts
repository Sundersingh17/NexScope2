import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";

// Transparency: who (other than me) opened my reports or files.
export const GET = handle(async () => {
  const e = await requireEmployee();
  const rows = await prisma.wfAuditLog.findMany({ where: { targetId: e.id, actorId: { not: e.id }, action: { in: ["REPORT_VIEWED", "FILE_VIEWED"] } }, orderBy: { at: "desc" }, take: 50 });
  const people = await prisma.wfEmployee.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.actorId))] } }, select: { id: true, name: true } });
  return Response.json({ entries: rows.map((r) => ({ at: r.at, action: r.action, by: people.find((p) => p.id === r.actorId)?.name ?? "Administrator" })) });
});
