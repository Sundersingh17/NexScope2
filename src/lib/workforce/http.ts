import { ZodError } from "zod";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

// In-memory limiter: fine for one server/VM. On serverless, move this to the database.
const hits = new Map<string, number[]>();
export function limit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) throw new HttpError(429, "Too many attempts. Try again later.");
  recent.push(now);
  hits.set(key, recent);
}

// Wrap every route: feature flag, same-origin check for writes, uniform errors.
export function handle(fn: (req: Request, ctx: any) => Promise<Response>) {
  return async (req: Request, ctx: any) => {
    try {
      if (process.env.WF_ENABLED !== "true") throw new HttpError(404, "Not found");
      if (req.method !== "GET") {
        const origin = req.headers.get("origin");
        if (origin && origin !== process.env.WF_APP_ORIGIN) throw new HttpError(403, "Bad origin");
      }
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) return Response.json({ error: e.message }, { status: e.status });
      if (e instanceof ZodError) return Response.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
      console.error("[workforce]", e);
      return Response.json({ error: "Server error" }, { status: 500 });
    }
  };
}
