
import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { evaluateHoldAction } from "@/lib/workforce/hold";
import { audit } from "@/lib/workforce/audit";
import { lockWorkforceSession } from "@/lib/workforce/session-lock";

const body = z.object({
  decision: z.enum(["APPROVE", "REJECT"]),
  decisionNote: z.string().trim().max(1000).optional(),
});

// Only administrators may review a submitted explanation.
export const PATCH = handle(
  async (req, ctx: { params: Promise<{ id: string }> }) => {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const input = body.parse(await req.json());

    const hold = await prisma.wfLocationHold.findUnique({
      where: { id },
    });

    if (!hold) {
      throw new HttpError(404, "Location hold not found.");
    }

    const decision = evaluateHoldAction(
      {
        status: hold.status as "PENDING" | "APPROVED" | "REJECTED",
        explanationSubmitted: Boolean(
          hold.submittedAt && hold.explanation?.trim(),
        ),
      },
      input.decision,
    );

    if (!decision.allowed) {
      throw new HttpError(409, decision.reason);
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Read the candidate hold to identify its associated session.
      const candidate = await tx.wfLocationHold.findUnique({
        where: { id },
      });

      if (!candidate) {
        throw new HttpError(404, "Location hold not found.");
      }

      // All operations that can end or change this session's hold
      // must acquire the same session lock before changing state.
      const session = await lockWorkforceSession(
        tx,
        candidate.sessionId,
      );

      if (!session) {
        throw new HttpError(409, "The associated work session was not found.");
      }

      // Re-read the hold after acquiring the session lock.
      const current = await tx.wfLocationHold.findUnique({
        where: { id },
      });

      if (
        !current ||
        current.sessionId !== session.id ||
        current.status !== "PENDING" ||
        !current.submittedAt ||
        !current.explanation?.trim()
      ) {
        throw new HttpError(
          409,
          "This hold has already been reviewed or its explanation is not ready.",
        );
      }

      const now = new Date();
      const approved = input.decision === "APPROVE";
      const sessionClosed = session.endedAt !== null;

      // An open session must have an active hold interval.
      // A closed session may have an already-ended interval from checkout.
      if (!sessionClosed && current.endedAt !== null) {
        throw new HttpError(
          409,
          "The hold interval has ended. Refresh and verify the session state.",
        );
      }

      const nextEndedAt = sessionClosed
        ? current.endedAt ?? session.endedAt
        : approved
          ? now
          : null;

      // Compare-and-set: only one concurrent review can change PENDING.
      const result = await tx.wfLocationHold.updateMany({
        where: {
          id: current.id,
          sessionId: session.id,
          status: "PENDING",
          endedAt: current.endedAt,
          submittedAt: current.submittedAt,
          explanation: current.explanation,
        },
        data: {
          status: approved ? "APPROVED" : "REJECTED",
          decisionById: admin.id,
          decidedAt: now,
          decisionNote: input.decisionNote?.trim() || null,
          endedAt: nextEndedAt,
        },
      });

      if (result.count !== 1) {
        throw new HttpError(
          409,
          "This hold changed during review. Refresh and try again.",
        );
      }

      return tx.wfLocationHold.findUniqueOrThrow({
        where: { id: current.id },
        select: {
          id: true,
          status: true,
          startedAt: true,
          endedAt: true,
          decidedAt: true,
          decisionNote: true,
        },
      });
    });

    await audit(admin.id, "LOCATION_HOLD_REVIEWED", hold.id, {
      decision: input.decision,
    });

    return Response.json({
      ok: true,
      hold: updated,
      message:
        input.decision === "APPROVE"
          ? updated.endedAt
            ? "Explanation approved. The session remains closed if checkout has occurred."
            : "Explanation approved. Tracking may resume for the still-open session."
          : updated.endedAt
            ? "Explanation rejected. The session is closed; tracking will not resume."
            : "Explanation rejected. The hold remains active until explicitly resolved.",
    });
  },
);
