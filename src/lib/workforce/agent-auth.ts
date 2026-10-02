import { prisma } from "./db";
import { HttpError } from "./http";
import { hashSecret } from "./agent";

export async function requireDevice(req: Request) {
  const h = req.headers.get("authorization") ?? "";
  const t = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (!t.startsWith("wfd_")) throw new HttpError(401, "Missing device token");
  const device = await prisma.wfDevice.findUnique({ where: { tokenHash: hashSecret(t) } });
  if (!device || device.revokedAt) throw new HttpError(401, "Device not recognised or revoked");
  const employee = await prisma.wfEmployee.findUnique({ where: { id: device.employeeId } });
  if (!employee || !employee.active) throw new HttpError(401, "Employee inactive");
  await prisma.wfDevice.update({ where: { id: device.id }, data: { lastSeenAt: new Date() } });
  return { device, employee };
}
