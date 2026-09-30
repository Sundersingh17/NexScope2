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
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ services: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, shortDesc, description, benefits, process, order, published } = body;

    if (!title || !shortDesc || !description) {
      return NextResponse.json(
        { message: "Title, short description, and description are required" },
        { status: 400 }
      );
    }

    const serviceSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const service = await prisma.service.create({
      data: {
        title,
        slug: serviceSlug,
        shortDesc,
        description,
        // benefits/process are stored as JSON strings — see src/lib/content.ts
        // for how they're parsed back into arrays for the public pages.
        benefits: benefits ? JSON.stringify(benefits) : null,
        process: process ? JSON.stringify(process) : null,
        order: typeof order === "number" ? order : 0,
        published: published || false,
      },
    });

    return NextResponse.json({ service, message: "Created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
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
    const { id, title, slug, shortDesc, description, benefits, process, order, published } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        slug,
        shortDesc,
        description,
        benefits: benefits ? JSON.stringify(benefits) : null,
        process: process ? JSON.stringify(process) : null,
        order: typeof order === "number" ? order : 0,
        published: published || false,
      },
    });

    return NextResponse.json({ service, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating service:", error);
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

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
