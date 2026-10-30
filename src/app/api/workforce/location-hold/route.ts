import { z } from "zod";
import { lockWorkforceSession } from "@/lib/workforce/session-lock";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { evaluateHoldAction } from "@/lib/workforce/hold";
import { audit } from "@/lib/workforce/audit";

const body = z.object({
  explanation: z.string().trim().min(3).max(1000),
});

// Employees may explain only their own active, pending hold.
// Submission never resumes tracking.
export const POST = handle(async (req) => {
  const employee = await requireEmployee();
  const input = body.parse(await req.json());

  const result = await prisma.$transaction(async (tx) => {

    const openSession = await tx.wfSession.findFirst({
      where: {
        employeeId: employee.id,
        endedAt: null,
      },
      select: { id: true },
    });

    if (!openSession) {
      throw new HttpError(
        409,
        "There is no open session to submit an explanation for.",
      );
    }

    const session = await lockWorkforceSession(tx, openSession.id);

    if (
      !session ||
      session.endedAt !== null ||
      session.employeeId !== employee.id
    ) {
      throw new HttpError(
        409,
        "The session changed while submitting your explanation. Refresh and try again.",
      );
    }


    const hold = await tx.wfLocationHold.findFirst({
      where: {
        employeeId: employee.id,
        sessionId: session.id,
        endedAt: null,
      },
      orderBy: { startedAt: "desc" },
    });

    if (!hold) {
      throw new HttpError(404, "No active location hold was found.");
    }

    const decision = evaluateHoldAction(
      {
        status: hold.status as "PENDING" | "APPROVED" | "REJECTED",
        explanationSubmitted: Boolean(
          hold.submittedAt && hold.explanation?.trim(),
        ),
      },
      "SUBMIT_EXPLANATION",
    );

    if (!decision.allowed) {
      throw new HttpError(409, decision.reason);
    }

    // Conditional update prevents a stale submission from overwriting
    // a hold that has already been reviewed or ended.
    const updatedCount = await tx.wfLocationHold.updateMany({
      where: {
        id: hold.id,
        employeeId: employee.id,
        sessionId: session.id,
        status: "PENDING",
        endedAt: null,
      },
      data: {
        explanation: input.explanation,
        submittedAt: new Date(),
      },
    });

    if (updatedCount.count !== 1) {
      throw new HttpError(
        409,
        "The hold changed while submitting your explanation. Refresh and try again.",
      );
    }

    return tx.wfLocationHold.findUniqueOrThrow({
      where: { id: hold.id },
      select: {
        id: true,
        status: true,
        submittedAt: true,
      },
    });
  });

  await audit(
    employee.id,
    "LOCATION_HOLD_EXPLANATION_SUBMITTED",
    result.id,
  );

  return Response.json({
    ok: true,
    hold: result,
    message:
      "Explanation submitted. Tracking remains on hold until an administrator reviews it.",
  });
});
