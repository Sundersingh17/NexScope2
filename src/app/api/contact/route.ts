import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { escapeHtml, isRateLimited } from "@/lib/utils";
import { scoreLead, notifyLead } from "@/lib/lead-scoring";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, company, budget, message, website } = body;

    // Honeypot: a hidden field named "website" that real users never fill in.
    // Bots that auto-fill every field trip this and get silently accepted
    // (so they don't learn the check exists) without sending an email or DB write.
    if (website) {
      return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const { score, temperature } = scoreLead({ budget, message, company });

    // Save lead to database
    try {
      await prisma.lead.create({
        data: {
          name,
          email,
          company: company || null,
          budget: budget || null,
          message,
          source: "contact_form",
          score,
          temperature,
        },
      });
    } catch (dbError) {
      console.error("Database error saving lead:", dbError);
      // Continue even if DB save fails
    }

    void notifyLead({ name, email, company, budget, score, temperature, source: "contact form" });

    // Send email notification if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "NexScope <onboarding@resend.dev>",
          to: [process.env.CONTACT_EMAIL || "hello@nexscope.in"],
          replyTo: email,
          subject: `New Lead: ${name}${company ? ` - ${company}` : ""}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                  .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
                  .field { margin-bottom: 15px; }
                  .label { font-weight: bold; color: #1e293b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
                  .value { color: #475569; margin-top: 2px; }
                  .message-box { background: white; padding: 15px; border-left: 4px solid #7C3AED; margin-top: 10px; border-radius: 4px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 20px;">New Lead Received</h1>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">Name</div>
                      <div class="value">${escapeHtml(name)}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email</div>
                      <div class="value">${escapeHtml(email)}</div>
                    </div>
                    <div class="field">
                      <div class="label">Company</div>
                      <div class="value">${escapeHtml(company || "N/A")}</div>
                    </div>
                    <div class="field">
                      <div class="label">Budget</div>
                      <div class="value">${escapeHtml(budget || "N/A")}</div>
                    </div>
                    <div class="field">
                      <div class="label">Project Details</div>
                      <div class="message-box">${escapeHtml(message || "No message provided")}</div>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error("Email error:", emailError);
      }

      // Auto-reply to the person who submitted the form. Best-effort — a
      // failure here shouldn't fail the request, since the internal
      // notification above already succeeded or was attempted.
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log("QUOTE AUTO-REPLY START");
        console.log("CUSTOMER EMAIL:", email);
        await resend.emails.send({
         from: "NexScope <hello@nexscope.in>",
          to: [email],
          subject: "We've received your message — NexScope",
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
                <p>Hi ${escapeHtml(name)},</p>
                <p>Thanks for reaching out to NexScope — we've received your message and someone from our team will get back to you within 24 hours.</p>
                <p>In the meantime, feel free to take a look at our <a href="https://www.nexscope.in/portfolio">recent work</a>.</p>
                <p>— The NexScope Team</p>
              </body>
            </html>
          `,
        });

        console.log("QUOTE AUTO-REPLY SENT TO:", email);
     } catch (autoReplyError) {
  console.error("QUOTE AUTO-REPLY ERROR:", autoReplyError);
}
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to send message", error: errorMessage },
      { status: 500 }
    );
  }
}