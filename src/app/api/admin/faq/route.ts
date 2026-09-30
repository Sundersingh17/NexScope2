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
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ faqs: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { question, answer, category, order, published } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { message: "Question and answer are required" },
        { status: 400 }
      );
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || null,
        order: typeof order === "number" ? order : 0,
        published: published ?? true,
      },
    });

    return NextResponse.json({ faq, message: "Created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
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
    const { id, question, answer, category, order, published } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        category: category || null,
        order: typeof order === "number" ? order : 0,
        published: published ?? true,
      },
    });

    return NextResponse.json({ faq, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating FAQ:", error);
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

    await prisma.fAQ.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
