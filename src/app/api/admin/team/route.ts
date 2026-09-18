import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ members: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, bio, image, order, published } = body;

    if (!name || !role) {
      return NextResponse.json({ message: "Name and role are required" }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio: bio || null,
        image: image || null,
        order: typeof order === "number" ? order : 0,
        published: published || false,
      },
    });

    return NextResponse.json({ member, message: "Created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, role, bio, image, order, published } = body;
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        bio: bio || null,
        image: image || null,
        order: typeof order === "number" ? order : 0,
        published: published || false,
      },
    });

    return NextResponse.json({ member, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
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
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
