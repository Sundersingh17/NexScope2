import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { notifyProjectUpdate } from "@/lib/project-update-email";

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { projectId, title, description, videoUrl, marketContext, nextAction, clientPrompt } = body;
    if (!projectId || !title) {
      return NextResponse.json({ message: "Project and title are required" }, { status: 400 });
    }

    const update = await prisma.projectUpdate.create({
      data: {
        projectId,
        title,
        description: description || null,
        videoUrl: videoUrl || null,
        marketContext: marketContext || null,
        nextAction: nextAction || null,
        clientPrompt: clientPrompt || null,
      },
    });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true, client: { select: { name: true, email: true } } },
    });
    if (project) {
      try {
        await notifyProjectUpdate({
          clientName: project.client.name,
          clientEmail: project.client.email,
          projectName: project.name,
          title,
          description: description || null,
          videoUrl: videoUrl || null,
          marketContext: marketContext || null,
          nextAction: nextAction || null,
          clientPrompt: clientPrompt || null,
        });
      } catch (emailError) {
        console.error("Project update saved, but notification email failed:", emailError);
      }
    }
    return NextResponse.json({ update, message: "Update posted" }, { status: 201 });
  } catch (error) {
    console.error("Error posting project update:", error);
    return NextResponse.json({ message: "Failed to post update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
    await prisma.projectUpdate.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting project update:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
