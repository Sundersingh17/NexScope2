
import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireDevice } from "@/lib/workforce/agent-auth";
import { normalizeBatch } from "@/lib/workforce/agent";
import { lockWorkforceSession } from "@/lib/workforce/session-lock";

const body = z.object({
  samples: z.array(z.unknown()),
});

// Agent samples are accepted only during an open session with no active hold.
// Samples recorded during a hold are excluded even if uploaded after approval.
export const POST = handle(async (req) => {
  const { device, employee } = await requireDevice(req);
  const { samples } = body.parse(await req.json());

  // Identify a candidate session; recheck its state under the shared lock.
  const candidate = await prisma.wfSession.findFirst({
    where: {
      employeeId: employee.id,
      endedAt: null,
    },
    select: { id: true },
  });

  if (!candidate) {
    return Response.json({
      state: "session_closed",
      accepted: 0,
      rejected: samples.length,
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    const locked = await lockWorkforceSession(tx, candidate.id);

    if (
      !locked ||
      locked.employeeId !== employee.id ||
      locked.endedAt !== null
    ) {
      return {
        state: "session_closed" as const,
        accepted: 0,
        rejected: samples.length,
      };
    }

    const session = await tx.wfSession.findUnique({
      where: { id: locked.id },
    });

    if (!session || session.endedAt !== null) {
      return {
        state: "session_closed" as const,
        accepted: 0,
        rejected: samples.length,
      };
    }

    const activeHold = await tx.wfLocationHold.findFirst({
      where: {
        employeeId: employee.id,
        sessionId: session.id,
        endedAt: null,
      },
      select: {
        status: true,
      },
    });

    if (activeHold) {
      return {
        state: "session_held" as const,
        holdStatus: activeHold.status,
        accepted: 0,
        rejected: samples.length,
      };
    }

    const { records, rejected } = normalizeBatch(
      samples,
      session.startedAt,
    );

    if (records.length === 0) {
      return {
        state: "session_open" as const,
        sessionId: session.id,
        accepted: 0,
        rejected,
      };
    }

    const holds = await tx.wfLocationHold.findMany({
      where: {
        sessionId: session.id,
        startedAt: { lte: new Date() },
      },
      select: {
        startedAt: true,
        endedAt: true,
      },
    });

    const now = Date.now();

    const filteredRecords = records.filter((record) => {
      const minute = record.minute.getTime();

      return !holds.some((hold) => {
        const start = hold.startedAt.getTime();
        const end = hold.endedAt?.getTime() ?? now;

        return minute >= start && minute < end;
      });
    });

    const rejectedForHold = records.length - filteredRecords.length;

    const inserted = await tx.wfAgentMinute.createMany({
      data: filteredRecords.map((record) => ({
        sessionId: session.id,
        deviceId: device.id,
        minute: record.minute,
        appName: record.appName,
        idle: record.idle,
      })),
      skipDuplicates: true,
    });

    return {
      state: "session_open" as const,
      sessionId: session.id,
      accepted: inserted.count,
      rejected: rejected + rejectedForHold,
    };
  });

  return Response.json(result);
});
