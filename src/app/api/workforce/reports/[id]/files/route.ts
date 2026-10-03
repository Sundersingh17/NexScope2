import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError, limit } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { MAX_BYTES, encryptBuf, extOf, safeName, sniff } from "@/lib/workforce/files";
import { put } from "@/lib/workforce/storage";
import { audit } from "@/lib/workforce/audit";

// Employee uploads proof of work to a DRAFT report (multipart form field "file").
export const POST = handle(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const e = await requireEmployee();
  const { id } = await ctx.params;
  limit("upload:" + e.id, 30, 10 * 60_000);
  const r = await prisma.wfHourlyReport.findUnique({ where: { id } });
  if (!r || r.employeeId !== e.id) throw new HttpError(404, "Report not found");
  if (r.status !== "DRAFT") throw new HttpError(409, "This report is already submitted");
  if ((await prisma.wfReportFile.count({ where: { reportId: id } })) >= 10) throw new HttpError(400, "Maximum 10 files per report");
  const f = (await req.formData()).get("file");
  if (!(f instanceof File)) throw new HttpError(400, "No file received");
  if (f.size > MAX_BYTES) throw new HttpError(413, "File is larger than 10 MB");
  const name = safeName(f.name);
  const buf = Buffer.from(await f.arrayBuffer());
  if (!sniff(name, buf)) throw new HttpError(415, "Unsupported file, or its content does not match its type");
  const key = `${id}/${randomUUID()}.bin`;
  await put(key, encryptBuf(buf));
  const row = await prisma.wfReportFile.create({ data: { reportId: id, employeeId: e.id, name, sizeB: buf.length, kind: extOf(name), storageKey: key } });
  await audit(e.id, "FILE_UPLOADED", row.id, { kind: row.kind, sizeB: row.sizeB });
  return Response.json({ id: row.id, name, sizeB: buf.length });
});
