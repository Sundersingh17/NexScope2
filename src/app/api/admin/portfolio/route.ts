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
    const projects = await prisma.portfolio.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, description, category, client, url, images, videoUrl, testimonial, challenge, solution, results, process, published, featured } = body;

    if (!title || !description) {
      return NextResponse.json({ message: "Title and description are required" }, { status: 400 });
    }

    const projectSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const project = await prisma.portfolio.create({
      data: {
        title,
        slug: projectSlug,
        description,
        category: category || null,
        client: client || null,
        url: url || null,
        images: images || null,
        videoUrl: videoUrl || null,
        testimonial: testimonial || null,
        challenge: challenge || null,
        solution: solution || null,
        results: results || null,
        process: process || null,
        published: published ?? true,
        featured: featured ?? false,
      },
    });

    return NextResponse.json({ project, message: "Created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio:", error);
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
    const { id, title, slug, description, category, client, url, images, videoUrl, testimonial, challenge, solution, results, process, published, featured } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const project = await prisma.portfolio.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        category: category || null,
        client: client || null,
        url: url || null,
        images: images || null,
        videoUrl: videoUrl || null,
        testimonial: testimonial || null,
        challenge: challenge || null,
        solution: solution || null,
        results: results || null,
        process: process || null,
        published: published ?? false,
        featured: featured ?? false,
      },
    });

    return NextResponse.json({ project, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating portfolio:", error);
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

    await prisma.portfolio.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}