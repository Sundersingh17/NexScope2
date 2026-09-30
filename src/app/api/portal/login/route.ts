import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  generateClientSessionToken,
  CLIENT_SESSION_COOKIE,
  CLIENT_SESSION_MAX_AGE,
} from "@/lib/client-auth";
import { isRateLimited } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`portal-login:${ip}`, 8, 15 * 60 * 1000)) {
      return NextResponse.json(
        { message: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { email: email.toLowerCase() } });

    // Same "invalid credentials" message whether the email doesn't exist
    // or the password is wrong — don't reveal which one it was.
    if (!client || client.status !== "active") {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(password, client.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const token = generateClientSessionToken({ clientId: client.id, email: client.email });

    const response = NextResponse.json({
      message: "Logged in",
      client: { id: client.id, name: client.name, email: client.email, company: client.company },
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
    console.error("Client login error:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
