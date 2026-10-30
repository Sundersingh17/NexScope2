import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { decryptBuf } from "@/lib/workforce/files";
import { get, del } from "@/lib/workforce/storage";
import { audit } from "@/lib/workforce/audit";

// Download. Owner or admin. Admin downloads are logged against the employee (they see it in their access log).
export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const e = await requireEmployee();
  const { id } = await ctx.params;
  const f = await prisma.wfReportFile.findUnique({ where: { id } });
  const own = f?.employeeId === e.id;
  if (!f || (!own && e.role !== "ADMIN")) throw new HttpError(404, "File not found");
  if (!own) await audit(e.id, "FILE_VIEWED", f.employeeId, { fileId: id });
  const data = decryptBuf(await get(f.storageKey));
  return new Response(new Uint8Array(data), { headers: {
    "content-type": "application/octet-stream",
    "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`,
    "x-content-type-options": "nosniff", "cache-control": "private, no-store",
  } });
});

// Owner removes a file while the report is still a draft.
export const DELETE = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const e = await requireEmployee();
  const { id } = await ctx.params;
  const f = await prisma.wfReportFile.findUnique({ where: { id } });
  if (!f || f.employeeId !== e.id) throw new HttpError(404, "File not found");
  const r = await prisma.wfHourlyReport.findUnique({ where: { id: f.reportId } });
  if (r?.status !== "DRAFT") throw new HttpError(409, "Report already submitted");
  await prisma.wfReportFile.delete({ where: { id } });
  await del(f.storageKey);
  await audit(e.id, "FILE_DELETED", id);
  return Response.json({ ok: true });
});
