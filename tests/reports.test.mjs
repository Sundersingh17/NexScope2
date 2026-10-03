// node --experimental-strip-types --no-warnings --test tests/reports.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { hourWindows, summarize, draftNote } from "../src/lib/workforce/reports.ts";
import { sniff, safeName, encryptBuf, decryptBuf } from "../src/lib/workforce/files.ts";

const t = (s) => new Date("2026-09-30T" + s + "Z");
test("hourWindows: open session gives complete hours only", () => {
  assert.equal(hourWindows(t("09:00:00"), t("11:30:00"), null).length, 2);
  assert.equal(hourWindows(t("09:00:00"), t("09:59:00"), null).length, 0);
});
test("hourWindows: ended session adds a partial final window", () => {
  const w = hourWindows(t("09:00:00"), t("20:00:00"), t("10:20:00"));
  assert.equal(w.length, 2);
  assert.equal(w[1].partial, true);
  assert.equal(w[1].end.toISOString(), t("10:20:00").toISOString());
  assert.equal(hourWindows(t("09:00:00"), t("20:00:00"), t("10:00:20")).length, 1); // <1 min left: no sliver
});
test("summarize: counts, top apps sorted, idle excluded from apps", () => {
  const s = summarize([{ appName: "VS Code", idle: false }, { appName: "VS Code", idle: false }, { appName: "Chrome", idle: false }, { appName: "", idle: true }]);
  assert.deepEqual([s.active, s.idle], [3, 1]);
  assert.deepEqual(s.topApps, [{ app: "VS Code", min: 2 }, { app: "Chrome", min: 1 }]);
});
test("draftNote", () => {
  assert.match(draftNote({ activeMin: 50, topApps: [{ app: "Figma", min: 30 }, { app: "Chrome", min: 20 }], project: "Client deck" }), /Figma \(30m\) and Chrome \(20m\).*on Client deck/);
  assert.match(draftNote({ activeMin: 0, topApps: [] }), /No tracked activity/);
});
test("sniff: type must match content", () => {
  assert.equal(sniff("a.pdf", Buffer.from("%PDF-1.7")), true);
  assert.equal(sniff("a.pdf", Buffer.from("MZ....")), false);
  assert.equal(sniff("deck.pptx", Buffer.from([0x50, 0x4b, 0x03, 0x04, 0])), true);
  assert.equal(sniff("old.ppt", Buffer.from([0xd0, 0xcf, 0x11, 0xe0])), true);
  assert.equal(sniff("run.exe", Buffer.from("MZ")), false);
  assert.equal(sniff("x.png", Buffer.from([])), false);
});
test("safeName strips paths and control characters", () => {
  assert.equal(safeName("..\\..\\evil/name\u0000.pdf"), "name.pdf");
  assert.equal(safeName(""), "file");
});
test("file encryption round trip and tamper detection", () => {
  process.env.WF_KEYS = JSON.stringify({ 1: randomBytes(32).toString("base64") });
  process.env.WF_KEY_CURRENT = "1";
  const data = randomBytes(5000);
  const enc = encryptBuf(data);
  assert.ok(!enc.includes(data.subarray(0, 32)));
  assert.deepEqual(decryptBuf(enc), data);
  enc[enc.length - 1] ^= 1;
  assert.throws(() => decryptBuf(enc));
});
