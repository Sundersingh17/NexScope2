// Run: node --experimental-strip-types --test tests/workforce.test.mjs   (Node 22.6+)
import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { encrypt, decrypt, needsRotation } from "../src/lib/workforce/crypto.ts";
import { haversineM, evaluate } from "../src/lib/workforce/geo.ts";

const k = () => randomBytes(32).toString("base64");
process.env.WF_KEYS = JSON.stringify({ 1: k(), 2: k() });
process.env.WF_KEY_CURRENT = "1";

test("encrypt/decrypt round trip, unique ciphertext", () => {
  const a = encrypt("JBSWY3DPEHPK3PXP"), b = encrypt("JBSWY3DPEHPK3PXP");
  assert.notEqual(a, b);
  assert.equal(decrypt(a), "JBSWY3DPEHPK3PXP");
});
test("tampering is detected", () => {
  const p = encrypt("secret").split(".");
  p[3] = Buffer.from("xxxxxxxx").toString("base64url");
  assert.throws(() => decrypt(p.join(".")));
});
test("key rotation: old data stays readable, flagged for re-encryption", () => {
  const old = encrypt("hello");
  process.env.WF_KEY_CURRENT = "2";
  assert.equal(decrypt(old), "hello");
  assert.equal(needsRotation(old), true);
  assert.equal(needsRotation(encrypt("x")), false);
});
test("haversine: 0.0009 deg latitude is about 100 m", () => {
  const d = haversineM({ lat: 19.2, lng: 73.18 }, { lat: 19.2009, lng: 73.18 });
  assert.ok(d > 99 && d < 101, String(d));
});
const office = { lat: 19.2, lng: 73.18, radiusM: 150 };
test("inside, outside, low accuracy, invalid", () => {
  assert.equal(evaluate({ lat: 19.2005, lng: 73.18, accuracyM: 12 }, office).reason, "INSIDE");
  assert.equal(evaluate({ lat: 19.21, lng: 73.18, accuracyM: 12 }, office).reason, "OUTSIDE");
  assert.equal(evaluate({ lat: 19.2005, lng: 73.18, accuracyM: 900 }, office).reason, "LOW_ACCURACY");
  assert.equal(evaluate({ lat: NaN, lng: 73.18, accuracyM: 5 }, office).reason, "INVALID_FIX");
  assert.equal(evaluate({ lat: 95, lng: 73.18, accuracyM: 5 }, office).ok, false);
});
