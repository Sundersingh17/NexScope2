import { authenticator } from "otplib"; // install as otplib@12
import QRCode from "qrcode";
import { decrypt } from "./crypto";

authenticator.options = { window: 1 }; // accept +-30 s clock drift

export const newSecret = () => authenticator.generateSecret();
export async function provisioning(email: string, secret: string) {
  const otpauth = authenticator.keyuri(email, "NexScope Workforce", secret);
  return { otpauth, qr: await QRCode.toDataURL(otpauth) };
}
// Returns the 30-second step that matched, or null. Caller rejects step <= totpLastStep (replay).
export function checkCode(code: string, secretEnc: string): number | null {
  const delta = authenticator.checkDelta(code, decrypt(secretEnc));
  return delta === null ? null : Math.floor(Date.now() / 30000) + delta;
}
