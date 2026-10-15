import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";

// Transparency: the same location events administrators can see about me.
export const GET = handle(async () => {
  const e = await requireEmployee();
  const events = await prisma.wfLocationEvent.findMany({ where: { employeeId: e.id }, orderBy: { at: "desc" }, take: 20, select: { id: true, at: true, kind: true, distM: true, accM: true, method: true, result: true } });
  return Response.json({ events });
});
