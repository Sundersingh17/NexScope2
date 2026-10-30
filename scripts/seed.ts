// Run on STAGING first:  npx tsx scripts/seed.ts
import { prisma } from "../src/lib/workforce/db";
import { hashPassword } from "../src/lib/workforce/password";

async function main() {
  const { WF_OFFICE_LAT, WF_OFFICE_LNG, WF_ADMIN_EMAIL, WF_ADMIN_PASSWORD } = process.env;
  if (!WF_OFFICE_LAT || !WF_OFFICE_LNG || !WF_ADMIN_EMAIL || !WF_ADMIN_PASSWORD) throw new Error("Set WF_OFFICE_LAT, WF_OFFICE_LNG, WF_ADMIN_EMAIL, WF_ADMIN_PASSWORD");
  if (!(await prisma.wfOffice.findFirst())) {
    await prisma.wfOffice.create({ data: { name: process.env.WF_OFFICE_NAME ?? "Office", lat: Number(WF_OFFICE_LAT), lng: Number(WF_OFFICE_LNG), radiusM: Number(process.env.WF_OFFICE_RADIUS_M ?? 150) } });
    console.log("Office created");
  }
  await prisma.wfEmployee.upsert({
    where: { email: WF_ADMIN_EMAIL.toLowerCase() },
    update: {},
    create: { email: WF_ADMIN_EMAIL.toLowerCase(), name: "Administrator", role: "ADMIN", passwordHash: await hashPassword(WF_ADMIN_PASSWORD) },
  });
  console.log("Admin ready:", WF_ADMIN_EMAIL);
}
main().finally(() => prisma.$disconnect());
