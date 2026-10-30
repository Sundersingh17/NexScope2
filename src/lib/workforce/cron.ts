import { timingSafeEqual } from "node:crypto";
import { HttpError } from "./http";

export function requireCron(req: Request) {
  const secret = process.env.WF_CRON_SECRET ?? "";
  const given = req.headers.get("x-cron-secret") ?? "";
  if (secret.length < 24 || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) throw new HttpError(401, "Unauthorized");
}
