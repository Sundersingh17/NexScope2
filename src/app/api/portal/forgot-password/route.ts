import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { generateResetToken, RESET_TOKEN_VALID_MINUTES } from "@/lib/client-auth";
import { isRateLimited, absoluteUrl } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`portal-forgot:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { message: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { email: email.toLowerCase() } });

    // Always return the same success response whether or not the email
    // exists — don't let this endpoint reveal which emails are registered.
    const genericResponse = NextResponse.json({
      message: "If that email is registered, a reset link has been sent.",
    });

    if (!client || client.status !== "active") {
      return genericResponse;
    }

    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_VALID_MINUTES * 60 * 1000);

    await prisma.client.update({
      where: { id: client.id },
      data: { resetToken, resetTokenExpiry },
    });

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const resetUrl = absoluteUrl(`/portal/reset-password?token=${resetToken}`);
        await resend.emails.send({
          from: "NexScope <onboarding@resend.dev>",
          to: [client.email],
          subject: "Reset your NexScope portal password",
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
                <p>Hi ${client.name},</p>
                <p>We received a request to reset your NexScope client portal password. This link expires in ${RESET_TOKEN_VALID_MINUTES} minutes.</p>
                <p><a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a></p>
                <p>If you didn't request this, you can safely ignore this email — your password won't be changed.</p>
                <p>— The NexScope Team</p>
              </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error("Password reset email error:", emailError);
        // Don't fail the request just because email sending had an issue —
        // still return the generic success response either way.
      }
    }

    return genericResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
