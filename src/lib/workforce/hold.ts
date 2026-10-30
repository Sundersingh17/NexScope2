export type HoldStatus = "PENDING" | "APPROVED" | "REJECTED";

export type HoldState = {
  status: HoldStatus;
  explanationSubmitted: boolean;
};

export type HoldAction =
  | "SUBMIT_EXPLANATION"
  | "APPROVE"
  | "REJECT"
  | "RESUME";

export type HoldDecision =
  | { allowed: true; nextStatus: HoldStatus }
  | { allowed: false; reason: string };

/**
 * Pure policy helper for office-zone holds.
 * Returning to the office does not automatically resume tracking.
 */
export function evaluateHoldAction(
  state: HoldState,
  action: HoldAction,
): HoldDecision {
  switch (action) {
    case "SUBMIT_EXPLANATION":
      if (state.status !== "PENDING") {
        return {
          allowed: false,
          reason: "An explanation can only be submitted for a pending hold.",
        };
      }

      return { allowed: true, nextStatus: "PENDING" };

    case "APPROVE":
      if (state.status !== "PENDING") {
        return {
          allowed: false,
          reason: "Only a pending hold can be approved.",
        };
      }

      if (!state.explanationSubmitted) {
        return {
          allowed: false,
          reason: "The employee must submit an explanation before review.",
        };
      }

      return { allowed: true, nextStatus: "APPROVED" };

    case "REJECT":
      if (state.status !== "PENDING") {
        return {
          allowed: false,
          reason: "Only a pending hold can be rejected.",
        };
      }

      if (!state.explanationSubmitted) {
        return {
          allowed: false,
          reason: "The employee must submit an explanation before review.",
        };
      }

      return { allowed: true, nextStatus: "REJECTED" };

    case "RESUME":
      if (state.status !== "APPROVED") {
        return {
          allowed: false,
          reason: "Tracking can resume only after administrator approval.",
        };
      }

      return { allowed: true, nextStatus: "APPROVED" };
  }
}
