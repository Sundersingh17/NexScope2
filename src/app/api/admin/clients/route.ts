import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/client-auth";

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: { projects: { select: { id: true, name: true, status: true } } },
    });
    // Never send passwordHash to the client, even to the admin UI.
    const safe = clients.map(({ passwordHash, resetToken, ...rest }) => rest);
    return NextResponse.json({ clients: safe });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ clients: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, company, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and a temporary password are required" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.client.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ message: "A client with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const client = await prisma.client.create({
      data: {
        name,
        email: email.toLowerCase(),
        company: company || null,
        phone: phone || null,
        passwordHash,
      },
    });

    const { passwordHash: _omit, ...safeClient } = client;
    return NextResponse.json({ client: safeClient, message: "Client created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ message: "Failed to create client" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, company, phone, status, newPassword } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const data: Record<string, unknown> = { name, company, phone, status };
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
      }
      data.passwordHash = await hashPassword(newPassword);
    }

    const client = await prisma.client.update({ where: { id }, data });
    const { passwordHash: _omit, ...safeClient } = client;
    return NextResponse.json({ client: safeClient, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating client:", error);
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
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
