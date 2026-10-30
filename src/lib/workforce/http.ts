
import { isIP } from "node:net";
import { ZodError } from "zod";

export class HttpError extends Error {
  status: number;
  retryAfterSeconds?: number;

  constructor(
    status: number,
    message: string,
    retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export const clientIp = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for")?.trim();

  // Fail closed if the client IP is absent or ambiguous.
  if (!forwarded || forwarded.includes(",")) {
    return "unknown";
  }

  // Accept only a valid IPv4 or IPv6 address.
  return isIP(forwarded) ? forwarded : "unknown";
};

// In-memory limiter: fine for one server/VM.
// On serverless, move this to the database.
const hits = new Map<string, number[]>();

export function limit(key: string, max: number, windowMs: number) {
  const now = Date.now();

  const recent = (hits.get(key) ?? []).filter(
    (timestamp) => now - timestamp < windowMs
  );

  // Store the pruned list even when the request is rejected.
  hits.set(key, recent);

  if (recent.length >= max) {
    // The oldest request expires first in this rolling window.
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((recent[0] + windowMs - now) / 1000)
    );

    throw new HttpError(
      429,
      "Too many attempts. Try again later.",
      retryAfterSeconds
    );
  }

  recent.push(now);
  hits.set(key, recent);
}

/**
 * Returns the allowed browser origin for the current deployment.
 *
 * Local / non-Vercel:
 *   Uses WF_APP_ORIGIN exactly as before.
 *
 * Vercel Preview:
 *   Also allows Vercel's Git branch URL so a new deployment on the same
 *   branch does not require WF_APP_ORIGIN to be changed every time.
 *
 * Vercel Production:
 *   Uses WF_APP_ORIGIN only. Preview URLs are never automatically trusted.
 */
function isAllowedOrigin(origin: string) {
  const configuredOrigin = process.env.WF_APP_ORIGIN?.trim();

  // Preserve the configured-origin behavior.
  if (configuredOrigin && origin === configuredOrigin) {
    return true;
  }

  // Only add Vercel's branch URL during Preview deployments.
  if (
    process.env.VERCEL === "1" &&
    process.env.VERCEL_ENV === "preview"
  ) {
    const branchUrl = process.env.VERCEL_BRANCH_URL?.trim();

    if (branchUrl) {
      const vercelBranchOrigin = branchUrl.startsWith("http")
        ? branchUrl
        : `https://${branchUrl}`;

      if (origin === vercelBranchOrigin) {
        return true;
      }
    }
  }

  return false;
}

// Wrap every route: feature flag, same-origin check for writes, uniform errors.
export function handle(
  fn: (req: Request, ctx: any) => Promise<Response>
) {
  return async (req: Request, ctx: any) => {
    try {
      if (process.env.WF_ENABLED !== "true") {
        throw new HttpError(404, "Not found");
      }

      if (req.method !== "GET") {
        const origin = req.headers.get("origin");

        if (!origin || !isAllowedOrigin(origin)) {
          throw new HttpError(403, "Bad origin");
        }
      }

      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) {
        const headers = new Headers();

        if (e.retryAfterSeconds !== undefined) {
          headers.set("Retry-After", String(e.retryAfterSeconds));
        }

        return Response.json(
          { error: e.message },
          {
            status: e.status,
            headers,
          }
        );
      }

      if (e instanceof ZodError) {
        return Response.json(
          { error: "Invalid input", issues: e.issues },
          { status: 400 }
        );
      }

      console.error("[workforce]", e);

      return Response.json(
        { error: "Server error" },
        { status: 500 }
      );
    }
  };
}
