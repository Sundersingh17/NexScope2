import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireCron } from "@/lib/workforce/cron";

// Daily housekeeping (secret header). Remove positions belonging to ended or missing sessions.
export const POST = handle(async (req) => {
  requireCron(req);

  const removed = await prisma.$executeRaw`
    DELETE FROM "wf_live_position" AS p
    WHERE NOT EXISTS (
      SELECT 1
      FROM "wf_session" AS s
      WHERE s."id" = p."sessionId"
        AND s."endedAt" IS NULL
    )
  `;

  return Response.json({ positionsRemoved: removed });
});