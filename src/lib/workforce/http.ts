import { ZodError } from "zod";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

// In-memory limiter: fine for one server/VM. On serverless, move this to the database.
const hits = new Map<string, number[]>();

export function limit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (t) => now - t < windowMs
  );

  if (recent.length >= max) {
    throw new HttpError(429, "Too many attempts. Try again later.");
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

  // Preserve the original configured-origin behavior.
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

        if (origin && !isAllowedOrigin(origin)) {
          throw new HttpError(403, "Bad origin");
        }
      }

      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) {
        return Response.json(
          { error: e.message },
          { status: e.status }
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