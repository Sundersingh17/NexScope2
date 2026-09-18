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
    const packages = await prisma.package.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ packages: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, icon, color, signal, purpose, forWhom, outcome, items, order, published } = body;

    if (!title || !purpose) {
      return NextResponse.json(
        { message: "Title and purpose are required" },
        { status: 400 }
      );
    }

    const packageSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const pkg = await prisma.package.create({
      data: {
        title,
        slug: packageSlug,
        icon: icon || "Zap",
        color: color || "from-blue-500 to-cyan-500",
        signal: signal || "",
        purpose,
        forWhom: forWhom || "",
        outcome: outcome || "",
        items: items ? JSON.stringify(items) : null,
        order: typeof order === "number" ? order : 0,
        published: published || false,
      },
    });

    return NextResponse.json({ package: pkg, message: "Created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
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
    const { id, title, slug, icon, color, signal, purpose, forWhom, outcome, items, order, published } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        title,
        slug,
        icon,
        color,
        signal,
        purpose,
        forWhom,
        outcome,
        items: items ? JSON.stringify(items) : null,
        order: typeof order === "number" ? order : 0,
        published: published || false,
      },
    });

    return NextResponse.json({ package: pkg, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating package:", error);
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

    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
