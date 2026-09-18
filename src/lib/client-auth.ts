import jwt from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Client portal authentication — entirely separate from the staff/admin
 * auth system (which uses Firebase, see src/lib/admin-auth.ts). Clients
 * are created by staff through /admin (not self-registered) and log in
 * with email + password here.
 *
 * Session: a signed JWT stored in an httpOnly cookie named "client_session".
 * Fails closed if CLIENT_AUTH_SECRET isn't set — no hardcoded fallback.
 */

const SESSION_COOKIE = "client_session";
const SESSION_DAYS = 30;

function requireSecret(): string {
  const secret = process.env.CLIENT_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "CLIENT_AUTH_SECRET env var is not set. Refusing to sign/verify client sessions without it."
    );
  }
  return secret;
}

export interface ClientSessionPayload {
  clientId: string;
  email: string;
}

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, 10);
}

export function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return compare(plain, hashed);
}

export function generateClientSessionToken(payload: ClientSessionPayload): string {
  return jwt.sign(payload, requireSecret(), { expiresIn: `${SESSION_DAYS}d` });
}

export function verifyClientSessionToken(token: string): ClientSessionPayload | null {
  try {
    return jwt.verify(token, requireSecret()) as ClientSessionPayload;
  } catch {
    return null;
  }
}

export const CLIENT_SESSION_COOKIE = SESSION_COOKIE;
export const CLIENT_SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60; // seconds, for the cookie

/**
 * Reads and verifies the client session from a request's cookies.
 * Returns the logged-in client's { id, email, name } or null.
 * Use in API routes (portal/* endpoints) to authorize a request.
 */
export async function getClientFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyClientSessionToken(token);
  if (!payload) return null;

  // Re-check against the database on every request rather than trusting
  // the token payload alone — catches a client being deactivated
  // (status set to "inactive") after their token was already issued.
  const client = await prisma.client.findUnique({ where: { id: payload.clientId } });
  if (!client || client.status !== "active") return null;

  return client;
}

/** Generates a random, URL-safe token for password-reset links. */
export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export const RESET_TOKEN_VALID_MINUTES = 30;
