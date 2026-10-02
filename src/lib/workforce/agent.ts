import { createHash, randomBytes, randomInt } from "node:crypto";

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
export const hashSecret = (s: string) => createHash("sha256").update(s).digest("hex");
export function newPairingCode(): string {
  let c = "";
  for (let i = 0; i < 8; i++) c += ALPHA[randomInt(ALPHA.length)];
  return c;
}
export const newDeviceToken = () => "wfd_" + randomBytes(32).toString("base64url");

export type Clean = { minute: Date; appName: string; idle: boolean };

// Never trust the agent: clamp, dedupe and bound everything it sends.
export function normalizeBatch(raw: unknown, sessionStart: Date, now = new Date()) {
  const out = new Map<number, Clean>();
  let rejected = 0;
  const list = Array.isArray(raw) ? raw : [];
  if (list.length > 120) rejected += list.length - 120;
  const lo = Math.floor(sessionStart.getTime() / 60000) * 60000;
  const hi = now.getTime() + 60000;
  for (const r of list.slice(0, 120)) {
    const s = (r ?? {}) as { minute?: unknown; app?: unknown; idle?: unknown };
    const t = typeof s.minute === "string" ? Date.parse(s.minute) : NaN;
    if (!Number.isFinite(t)) { rejected++; continue; }
    const m = Math.floor(t / 60000) * 60000;
    if (m < lo || m > hi) { rejected++; continue; }
    const idle = s.idle === true;
    const app = idle ? "" : String(s.app ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 80);
    if (!idle && !app) { rejected++; continue; }
    out.set(m, { minute: new Date(m), appName: app, idle });
  }
  return { records: [...out.values()], rejected };
}
