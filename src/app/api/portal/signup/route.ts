import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  generateClientSessionToken,
  CLIENT_SESSION_COOKIE,
  CLIENT_SESSION_MAX_AGE,
} from "@/lib/client-auth";
import { isRateLimited } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`portal-signup:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { message: "Too many signup attempts. Try again later." },
        { status: 429 }
      );
    }

    const { name, email, password, company, phone, website } = await request.json();

    // Honeypot — same pattern as the contact/quote forms.
    if (website) {
      return NextResponse.json({ message: "Account created" }, { status: 200 });
    }

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.client.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const client = await prisma.client.create({
      data: {
        name,
        email: email.toLowerCase(),
        company: company || null,
        phone: phone || null,
        passwordHash,
        source: "signup", // flags this for staff review in /admin/clients — see the "source" note on the Client model
      },
    });

    const token = generateClientSessionToken({ clientId: client.id, email: client.email });
    const response = NextResponse.json({
      message: "Account created",
      client: { id: client.id, name: client.name, email: client.email },
    });
    response.cookies.set(CLIENT_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: CLIENT_SESSION_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Client signup error:", error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
