import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle, HttpError } from "@/lib/workforce/http";
import { requireEmployee } from "@/lib/workforce/auth";
import { evaluate } from "@/lib/workforce/geo";
import { audit } from "@/lib/workforce/audit";

const body = z.object({ lat: z.number(), lng: z.number(), accuracy: z.number() });

export const POST = handle(async (req) => {
  const e = await requireEmployee();
  const fix = body.parse(await req.json());
  if (await prisma.wfSession.findFirst({ where: { employeeId: e.id, endedAt: null } })) throw new HttpError(409, "You already have an open work session.");
  const office = await prisma.wfOffice.findFirst();
  if (!office) throw new HttpError(500, "Office location is not configured.");

  const geo = evaluate({ lat: fix.lat, lng: fix.lng, accuracyM: fix.accuracy }, office);
  let zone: "OFFICE" | "REMOTE" | null = geo.ok && geo.inside ? "OFFICE" : null;
  let remoteRequestId: string | undefined;
  if (!zone && geo.reason !== "INVALID_FIX") {
    const now = new Date();
    const ok = await prisma.wfRemoteRequest.findFirst({ where: { employeeId: e.id, status: "APPROVED", validFrom: { lte: now }, validUntil: { gte: now } } });
    if (ok) { zone = "REMOTE"; remoteRequestId = ok.id; }
  }
  await prisma.wfLocationEvent.create({ data: { employeeId: e.id, kind: "CHECK_IN", distM: geo.distM, accM: Math.round(fix.accuracy), result: zone ? `ALLOWED_${zone}` : "BLOCKED" } });
  if (!zone) {
    await audit(e.id, "CHECK_IN_BLOCKED", e.id, { reason: geo.reason, distM: geo.distM });
    throw new HttpError(403, geo.reason === "LOW_ACCURACY"
      ? "GPS accuracy is too low. Move near a window or enable Wi-Fi location, then try again."
      : "You are outside the office zone. Ask an administrator to approve remote work.");
  }
  const s = await prisma.wfSession.create({ data: { employeeId: e.id, zone, remoteRequestId, startDistM: geo.distM } });
  await audit(e.id, "SESSION_START", s.id, { zone });
  return Response.json({ sessionId: s.id, zone, distM: geo.distM, startedAt: s.startedAt });
});
