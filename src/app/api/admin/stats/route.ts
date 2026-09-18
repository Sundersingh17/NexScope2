import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [testimonials, portfolio, blogs, services, packages, faq, team, leads] = await Promise.all([
      prisma.testimonial.count(),
      prisma.portfolio.count(),
      prisma.blog.count(),
      prisma.service.count(),
      prisma.package.count(),
      prisma.fAQ.count(),
      prisma.teamMember.count(),
      prisma.lead.count(),
    ]);

    return NextResponse.json({ testimonials, portfolio, blogs, services, packages, faq, team, leads });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ testimonials: 0, portfolio: 0, blogs: 0, services: 0, packages: 0, faq: 0, team: 0, leads: 0 });
  }
}