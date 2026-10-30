import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { decrypt } from "@/lib/workforce/crypto";
import { audit } from "@/lib/workforce/audit";

// Admin opens one report (note + file list). This is logged against the employee.
export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const admin = await requireAdmin();
  const { id } = await ctx.params;
  const r = await prisma.wfHourlyReport.findUnique({ where: { id } });
  if (!r) throw new HttpError(404, "Report not found");
  await audit(admin.id, "REPORT_VIEWED", r.employeeId, { reportId: id });
  const files = await prisma.wfReportFile.findMany({ where: { reportId: id }, select: { id: true, name: true, sizeB: true } });
  return Response.json({ report: { ...r, noteEnc: undefined, note: r.noteEnc ? decrypt(r.noteEnc) : "" }, files });
});
