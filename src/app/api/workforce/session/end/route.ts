import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";
import { evaluate } from "@/lib/workforce/geo";

// Check-out is allowed from anywhere. Location is recorded if the device provides it.
const body = z.object({ lat: z.number(), lng: z.number(), accuracy: z.number() }).partial();

export const POST = handle(async (req) => {
  const e = await requireEmployee();
  const fix = body.parse(await req.json().catch(() => ({})));
  const open = await prisma.wfSession.findFirst({ where: { employeeId: e.id, endedAt: null } });
  if (!open) throw new HttpError(409, "No open work session.");
  const ended = await prisma.wfSession.update({ where: { id: open.id }, data: { endedAt: new Date() } });
  const office = await prisma.wfOffice.findFirst();
  if (office && fix.lat !== undefined && fix.lng !== undefined && fix.accuracy !== undefined) {
    const g = evaluate({ lat: fix.lat, lng: fix.lng, accuracyM: fix.accuracy }, office);
    await prisma.wfLocationEvent.create({ data: { employeeId: e.id, sessionId: open.id, kind: "CHECK_OUT", distM: g.distM, accM: Math.round(fix.accuracy), result: "RECORDED" } });
  }
  await audit(e.id, "SESSION_END", open.id);
  const minutes = Math.round((ended.endedAt!.getTime() - ended.startedAt.getTime()) / 60000);
  return Response.json({ ok: true, minutes });
});
