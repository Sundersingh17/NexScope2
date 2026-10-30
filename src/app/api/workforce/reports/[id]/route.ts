import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { encrypt } from "@/lib/workforce/crypto";
import { audit } from "@/lib/workforce/audit";

const body = z.object({ project: z.string().max(60).optional(), note: z.string().max(2000).optional(), submit: z.boolean().optional() });

// Employee edits own DRAFT report, or submits (locks) it.
export const PATCH = handle(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const e = await requireEmployee();
  const { id } = await ctx.params;
  const b = body.parse(await req.json());
  const r = await prisma.wfHourlyReport.findUnique({ where: { id } });
  if (!r || r.employeeId !== e.id) throw new HttpError(404, "Report not found");
  if (r.status !== "DRAFT") throw new HttpError(409, "This report is already submitted");
  await prisma.wfHourlyReport.update({
    where: { id },
    data: {
      ...(b.project !== undefined ? { project: b.project || null } : {}),
      ...(b.note !== undefined ? { noteEnc: b.note ? encrypt(b.note) : null } : {}),
      ...(b.submit ? { status: "SUBMITTED", submittedAt: new Date() } : {}),
    },
  });
  if (b.submit) await audit(e.id, "REPORT_SUBMITTED", id);
  return Response.json({ ok: true });
});
