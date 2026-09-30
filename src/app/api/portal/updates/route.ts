import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getClientFromRequest } from "@/lib/client-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const client = await getClientFromRequest(request);
  if (!client) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { updateId, response } = await request.json();
    if (!updateId || !response?.trim()) {
      return NextResponse.json({ message: "Update and response are required" }, { status: 400 });
    }

    const update = await prisma.projectUpdate.findFirst({
      where: { id: updateId, project: { clientId: client.id } },
    });
    if (!update) return NextResponse.json({ message: "Update not found" }, { status: 404 });

    const saved = await prisma.projectUpdate.update({
      where: { id: updateId },
      data: { clientResponse: response.trim(), respondedAt: new Date() },
    });
    return NextResponse.json({ update: saved, message: "Response saved" });
  } catch (error) {
    console.error("Error saving client response:", error);
    return NextResponse.json({ message: "Failed to save response" }, { status: 500 });
  }
}