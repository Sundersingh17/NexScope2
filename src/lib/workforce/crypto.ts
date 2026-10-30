import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Envelope format: v<keyVersion>.<iv>.<tag>.<ciphertext>  (AES-256-GCM, built-in Node crypto)
// Keys live in env (WF_KEYS), never in the database. Rotate: add key "2", set WF_KEY_CURRENT=2,
// old rows stay readable until re-encrypted (see needsRotation).
function ring() {
  const keys: Record<string, string> = JSON.parse(process.env.WF_KEYS ?? "{}");
  const cur = process.env.WF_KEY_CURRENT ?? "";
  if (!keys[cur]) throw new Error("WF_KEY_CURRENT is not present in WF_KEYS");
  return { keys, cur };
}
function keyBuf(b64: string) {
  const k = Buffer.from(b64, "base64");
  if (k.length !== 32) throw new Error("Encryption key must be 32 bytes (base64)");
  return k;
}
export function encrypt(plain: string): string {
  const { keys, cur } = ring();
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", keyBuf(keys[cur]), iv);
  const ct = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return ["v" + cur, iv.toString("base64url"), c.getAuthTag().toString("base64url"), ct.toString("base64url")].join(".");
}
export function decrypt(payload: string): string {
  const [v, iv, tag, ct] = payload.split(".");
  if (!v || !v.startsWith("v") || !iv || !tag || !ct) throw new Error("Malformed ciphertext");
  const { keys } = ring();
  const k = keys[v.slice(1)];
  if (!k) throw new Error("Unknown key version " + v);
  const d = createDecipheriv("aes-256-gcm", keyBuf(k), Buffer.from(iv, "base64url"));
  d.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([d.update(Buffer.from(ct, "base64url")), d.final()]).toString("utf8");
}
export function needsRotation(payload: string): boolean {
  return !payload.startsWith("v" + ring().cur + ".");
}
