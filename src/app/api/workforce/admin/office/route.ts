
import { isIP } from "node:net";
import { z } from "zod";
import { prisma } from "@/lib/workforce/db";
import { handle } from "@/lib/workforce/http";
import { requireAdmin } from "@/lib/workforce/auth";
import { audit } from "@/lib/workforce/audit";

const body = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radiusM: z.number().int().min(20).max(2000),
  allowedIps: z
    .array(
      z.string().refine((value) => isIP(value) !== 0, {
        message: "Each entry must be a valid IPv4 or IPv6 address",
      }),
    )
    .max(20),
});

// Admin edits the office geofence and office network addresses.
export const PATCH = handle(async (req) => {
  const admin = await requireAdmin();
  const b = body.parse(await req.json());

  await prisma.$transaction(async (tx) => {
    const office = await tx.wfOffice.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (office) {
      await tx.wfOffice.update({
        where: { id: office.id },
        data: b,
      });
    } else {
      await tx.wfOffice.create({
        data: { name: "Office", ...b },
      });
    }
  });

  await audit(admin.id, "OFFICE_UPDATED", undefined, {
    radiusM: b.radiusM,
    ips: b.allowedIps.length,
  });

  return Response.json({ ok: true });
});