import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { isAllowedAdminEmail } from "@/lib/admin-emails";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

// Google's public JWKS endpoint for verifying Firebase tokens
const GOOGLE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

// Cache for Google public keys
let cachedKeys: Record<string, string> | null = null;
let cacheExpiry = 0;

async function getPublicKeys(): Promise<Record<string, string>> {
  if (cachedKeys && Date.now() < cacheExpiry) {
    return cachedKeys;
  }
  
  try {
    const response = await fetch(GOOGLE_CERTS_URL);
    const keys = await response.json();
    cachedKeys = keys;
    // Cache for 6 hours (Google's keys are long-lived)
    cacheExpiry = Date.now() + 6 * 60 * 60 * 1000;
    return keys;
  } catch (error) {
    console.error("Failed to fetch Google public keys:", error);
    if (cachedKeys) return cachedKeys;
    throw error;
  }
}

function decodeFirebaseToken(token: string): { email?: string; uid?: string } | null {
  try {
    // Decode without verification first to get the header
    const decoded = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return decoded;
  } catch {
    return null;
  }
}

export async function adminAuth(request: NextRequest): Promise<{ uid: string; email: string } | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.slice(7);
    if (!token) return null;

    // First decode to check email without full verification
    const payload = decodeFirebaseToken(token);
    if (!payload) return null;

    const userEmail = payload.email || "";
    
    // Check email restriction
    if (!isAllowedAdminEmail(userEmail)) {
      console.error(`Access denied for email: ${userEmail}`);
      return null;
    }

    // Verify the JWT signature using Google's public keys. This is the ONLY
    // path that grants access — there is no fallback. A JWT payload can be
    // freely edited before signature verification, so trusting an unverified
    // email match (as the old code did) is a full auth bypass.
    try {
      const keys = await getPublicKeys();
      const header = JSON.parse(Buffer.from(token.split(".")[0], "base64").toString());
      const kid = header.kid;

      if (!kid || !keys[kid]) {
        console.error("No matching signing key found for token; rejecting.");
        return null;
      }

      const publicKey = keys[kid];
      const verified = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
        issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
        audience: FIREBASE_PROJECT_ID,
      }) as any;

      if (!isAllowedAdminEmail(verified.email)) {
        console.error(`Verified token email does not match allowed admin list: ${verified.email}`);
        return null;
      }

      return {
        uid: verified.user_id || verified.sub,
        email: verified.email,
      };
    } catch (verifyError) {
      console.error("Token verification failed; rejecting request:", verifyError);
      return null;
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return null;
  }
}