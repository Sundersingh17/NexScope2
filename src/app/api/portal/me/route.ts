import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getClientFromRequest } from "@/lib/client-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const client = await getClientFromRequest(request);
  if (!client) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
    include: {
      updates: { orderBy: { createdAt: "desc" }, take: 5 },
      files: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json({
    client: { id: client.id, name: client.name, email: client.email, company: client.company },
    projects,
  });
}
