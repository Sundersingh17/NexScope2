import { prisma } from "@/lib/workforce/db";
import { z } from "zod";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { draftNote } from "@/lib/workforce/reports";

// "Draft with AI" v1: a rule-based summary. Nothing is sent to a third party.
export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const e = await requireEmployee();
  const { id } = await ctx.params;
  const r = await prisma.wfHourlyReport.findUnique({ where: { id } });

  if (!r || r.employeeId !== e.id) {
    throw new HttpError(404, "Report not found");
  }

  const topAppsSchema = z.array(
    z.object({
      app: z.string(),
      min: z.number(),
    }),
  );

  const parsedTopApps = topAppsSchema.safeParse(r.topApps);

  if (!parsedTopApps.success) {
    throw new HttpError(500, "Invalid report activity data");
  }

  return Response.json({
    text: draftNote({
      activeMin: r.activeMin,
      topApps: parsedTopApps.data,
      project: r.project,
    }),
  });
});
