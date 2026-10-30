import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";

export const GET = handle(async () => {
  await requireAdmin();

  const holds = await prisma.wfLocationHold.findMany({
    where: {
      endedAt: null,
    },
    orderBy: {
      startedAt: "desc",
    },
    take: 100,
    select: {
      id: true,
      employeeId: true,
      sessionId: true,
      startedAt: true,
      status: true,
      explanation: true,
      submittedAt: true,
      decisionById: true,
      decidedAt: true,
      decisionNote: true,
    },
  });

  const employeeIds = [...new Set(holds.map((hold) => hold.employeeId))];

  const employees = await prisma.wfEmployee.findMany({
    where: {
      id: { in: employeeIds },
    },
    select: {
      id: true,
      name: true,
      email: true,
      team: true,
    },
  });

  const employeeById = new Map(
    employees.map((employee) => [employee.id, employee]),
  );

  return Response.json({
    holds: holds.map((hold) => ({
      ...hold,
      employee: employeeById.get(hold.employeeId) ?? null,
    })),
  });
});