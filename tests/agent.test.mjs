// node --experimental-strip-types --no-warnings --test tests/agent.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { hashSecret, newPairingCode, newDeviceToken, normalizeBatch } from "../src/lib/workforce/agent.ts";

test("pairing code: 8 chars, unambiguous alphabet, varies", () => {
  const a = newPairingCode();
  assert.match(a, /^[A-HJ-NP-Z2-9]{8}$/);
  assert.notEqual(a, newPairingCode());
});
test("device token prefix, uniqueness and hashing", () => {
  const t = newDeviceToken();
  assert.ok(t.startsWith("wfd_") && t.length > 40);
  assert.notEqual(t, newDeviceToken());
  assert.equal(hashSecret("x"), hashSecret("x"));
  assert.notEqual(hashSecret("x"), hashSecret("y"));
});
const start = new Date("2026-09-30T09:00:20Z"), now = new Date("2026-09-30T10:00:00Z");
test("normalizeBatch keeps valid, dedupes minutes, rejects bad input", () => {
  const { records, rejected } = normalizeBatch([
    { minute: "2026-09-30T09:00:45Z", app: "VS Code", idle: false }, // start minute allowed
    { minute: "2026-09-30T09:00:10Z", app: "Chrome", idle: false }, // same minute -> deduped
    { minute: "2026-09-30T08:59:00Z", app: "Chrome", idle: false }, // before session
    { minute: "2026-09-30T12:00:00Z", app: "Chrome", idle: false }, // future
    { minute: "garbage", app: "x", idle: false },
    { minute: "2026-09-30T09:05:00Z", app: "", idle: false }, // no app, not idle
    { minute: "2026-09-30T09:06:00Z", idle: true },
    null,
  ], start, now);
  assert.equal(records.length, 2);
  assert.equal(rejected, 5);
  assert.equal(records.find((r) => r.idle).appName, "");
});
test("normalizeBatch strips control chars, trims length, caps batch size", () => {
  const r = normalizeBatch([{ minute: "2026-09-30T09:10:00Z", app: "A\u0000B\n" + "x".repeat(200), idle: false }], start, now);
  assert.ok(r.records[0].appName.length <= 80 && !/[\u0000-\u001f]/.test(r.records[0].appName));
  const many = Array.from({ length: 300 }, (_, i) => ({ minute: new Date(start.getTime() + i * 60000).toISOString(), app: "a", idle: false }));
  assert.ok(normalizeBatch(many, start, new Date("2026-09-30T20:00:00Z")).records.length <= 120);
  assert.deepEqual(normalizeBatch("nope", start, now), { records: [], rejected: 0 });
});
