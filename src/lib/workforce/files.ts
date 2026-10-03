import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export const MAX_BYTES = 10 * 1024 * 1024;
const KIND: Record<string, string> = { pdf: "pdf", pptx: "zip", docx: "zip", xlsx: "zip", zip: "zip", ppt: "ole", doc: "ole", xls: "ole", png: "png", jpg: "jpg", jpeg: "jpg" };

export const extOf = (n: string) => (n.lastIndexOf(".") < 0 ? "" : n.slice(n.lastIndexOf(".") + 1).toLowerCase());
export const safeName = (n: string) => ((n.split(/[\\/]/).pop() ?? "").replace(/[\u0000-\u001f\u007f<>:"|?*]/g, "").trim().slice(0, 120) || "file");

// The extension must be allowed AND the first bytes must match that kind of file.
export function sniff(name: string, b: Buffer): boolean {
  const k = KIND[extOf(name)];
  const h = (...x: number[]) => b.length >= x.length && x.every((v, i) => b[i] === v);
  if (k === "pdf") return h(0x25, 0x50, 0x44, 0x46);
  if (k === "zip") return h(0x50, 0x4b, 0x03, 0x04);
  if (k === "ole") return h(0xd0, 0xcf, 0x11, 0xe0);
  if (k === "png") return h(0x89, 0x50, 0x4e, 0x47);
  if (k === "jpg") return h(0xff, 0xd8, 0xff);
  return false;
}

// Binary envelope: [key version (1 byte)] [iv 12] [tag 16] [ciphertext]. Same key ring as crypto.ts (WF_KEYS).
function key(ver: string) {
  const k = Buffer.from(JSON.parse(process.env.WF_KEYS ?? "{}")[ver] ?? "", "base64");
  if (k.length !== 32) throw new Error("Missing or invalid encryption key " + ver);
  return k;
}
export function encryptBuf(p: Buffer): Buffer {
  const cur = process.env.WF_KEY_CURRENT ?? "";
  const v = Number(cur);
  if (!Number.isInteger(v) || v < 1 || v > 255) throw new Error("WF_KEY_CURRENT must be a number from 1 to 255");
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(cur), iv);
  const ct = Buffer.concat([c.update(p), c.final()]);
  return Buffer.concat([Buffer.from([v]), iv, c.getAuthTag(), ct]);
}
export function decryptBuf(b: Buffer): Buffer {
  const d = createDecipheriv("aes-256-gcm", key(String(b[0])), b.subarray(1, 13));
  d.setAuthTag(b.subarray(13, 29));
  return Buffer.concat([d.update(b.subarray(29)), d.final()]);
}
