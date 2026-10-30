import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { HttpError } from "./http";

const key = () => new TextEncoder().encode(process.env.WF_SESSION_SECRET ?? "");
type Purpose = "pre" | "session";

export async function signToken(sub: string, purpose: Purpose, ttl: string) {
  return new SignJWT({ purpose }).setSubject(sub).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(ttl).sign(key());
}
export async function readToken(token: string, purpose: Purpose): Promise<string> {
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (payload.purpose !== purpose || !payload.sub) throw new Error("wrong purpose");
    return payload.sub;
  } catch {
    throw new HttpError(401, "Session expired. Sign in again.");
  }
}

export async function setSessionCookie(employeeId: string) {
  (await cookies()).set("wf_session", await signToken(employeeId, "session", "12h"), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12,
  });
}

export async function currentEmployee() {
  const t = (await cookies()).get("wf_session")?.value;
  if (!t) return null;
  try {
    const id = await readToken(t, "session");
    const e = await prisma.wfEmployee.findUnique({ where: { id } });
    return e && e.active ? e : null;
  } catch {
    return null;
  }
}
export async function requireEmployee() {
  const e = await currentEmployee();
  if (!e) throw new HttpError(401, "Not signed in");
  return e;
}
export async function requireAdmin() {
  const e = await requireEmployee();
  if (e.role !== "ADMIN") throw new HttpError(403, "Administrators only");
  return e;
}
