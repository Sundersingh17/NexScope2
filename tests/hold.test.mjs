import test from "node:test";
import assert from "node:assert/strict";
import { evaluateHoldAction } from "../src/lib/workforce/hold.ts";

test("employee can submit an explanation for a pending hold", () => {
  assert.deepEqual(
    evaluateHoldAction(
      { status: "PENDING", explanationSubmitted: false },
      "SUBMIT_EXPLANATION",
    ),
    { allowed: true, nextStatus: "PENDING" },
  );
});

test("admin cannot approve a hold before an explanation is submitted", () => {
  const result = evaluateHoldAction(
    { status: "PENDING", explanationSubmitted: false },
    "APPROVE",
  );

  assert.equal(result.allowed, false);
});

test("admin can approve a pending hold after an explanation is submitted", () => {
  assert.deepEqual(
    evaluateHoldAction(
      { status: "PENDING", explanationSubmitted: true },
      "APPROVE",
    ),
    { allowed: true, nextStatus: "APPROVED" },
  );
});

test("admin can reject a pending hold after an explanation is submitted", () => {
  assert.deepEqual(
    evaluateHoldAction(
      { status: "PENDING", explanationSubmitted: true },
      "REJECT",
    ),
    { allowed: true, nextStatus: "REJECTED" },
  );
});

test("rejected holds cannot resume tracking", () => {
  const result = evaluateHoldAction(
    { status: "REJECTED", explanationSubmitted: true },
    "RESUME",
  );

  assert.equal(result.allowed, false);
});

test("returning to the office cannot bypass approval", () => {
  const result = evaluateHoldAction(
    { status: "PENDING", explanationSubmitted: true },
    "RESUME",
  );

  assert.equal(result.allowed, false);
});

test("already approved holds cannot be approved again", () => {
  const result = evaluateHoldAction(
    { status: "APPROVED", explanationSubmitted: true },
    "APPROVE",
  );

  assert.equal(result.allowed, false);
});
