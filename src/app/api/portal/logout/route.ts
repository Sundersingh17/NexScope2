import { NextResponse } from "next/server";
import { CLIENT_SESSION_COOKIE } from "@/lib/client-auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(CLIENT_SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return response;
}
