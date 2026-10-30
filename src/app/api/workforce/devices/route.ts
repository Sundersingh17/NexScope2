import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";

// Employee: own devices. Admin: add ?all=1 to see everyone's.
export const GET = handle(async (req) => {
  const e = await requireEmployee();
  const all = e.role === "ADMIN" && new URL(req.url).searchParams.get("all") === "1";
  const devices = await prisma.wfDevice.findMany({
    where: all ? {} : { employeeId: e.id },
    select: { id: true, employeeId: true, name: true, createdAt: true, lastSeenAt: true, revokedAt: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ devices });
});
