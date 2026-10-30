import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { draftNote } from "@/lib/workforce/reports";

// "Draft with AI" v1: a rule-based summary. Nothing is sent to a third party.
export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const e = await requireEmployee();
  const { id } = await ctx.params;
  const r = await prisma.wfHourlyReport.findUnique({ where: { id } });
  if (!r || r.employeeId !== e.id) throw new HttpError(404, "Report not found");
  return Response.json({ text: draftNote({ activeMin: r.activeMin, topApps: r.topApps as any, project: r.project }) });
});
