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
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ blogs: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, published, featured } = body;

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    const blogSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    // Find or create a default admin user
    let author = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!author) {
      author = await prisma.user.create({
        data: {
          email: "admin@nexscope.in",
          name: "Admin",
          role: "ADMIN",
        },
      });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug: blogSlug,
        excerpt: excerpt || null,
        content,
        published: published || false,
        featured: featured || false,
        authorId: author.id,
      },
    });

    return NextResponse.json({ blog, message: "Created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
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
    const { id, title, slug, excerpt, content, published, featured } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        published: published || false,
        featured: featured || false,
      },
    });

    return NextResponse.json({ blog, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating blog:", error);
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

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}