import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { escapeHtml, isRateLimited } from "@/lib/utils";
import { scoreLead, notifyLead } from "@/lib/lead-scoring";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`quote:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, company, phone, service, budget, message, website } = body;

    // Honeypot field — bots fill every input, real users never see this one.
    if (website) {
      return NextResponse.json({ message: "Quote request sent successfully" }, { status: 200 });
    }

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const { score, temperature } = scoreLead({ budget, service, message, phone, company });

    // Save lead to database. The quote form previously wasn't saved to the
    // DB at all (only emailed) — fixed here so it shows up in /admin leads
    // and the dashboard stats alongside contact-form leads.
    try {
      await prisma.lead.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          service: service || null,
          budget: budget || null,
          message: message || null,
          source: "quote_form",
          score,
          temperature,
        },
      });
    } catch (dbError) {
      console.error("Database error saving quote lead:", dbError);
      // Continue even if DB save fails — email notification below still matters.
    }

    void notifyLead({ name, email, company, budget, service, score, temperature, source: "quote form" });

    // Send email notification to the NexScope team, if configured.
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const from = process.env.RESEND_FROM_EMAIL || "NexScope <onboarding@resend.dev>";

        await resend.emails.send({
          from,
          to: [process.env.CONTACT_EMAIL || "hello@nexscope.in"],
          replyTo: email,
          subject: `New Quote Request from ${name}${temperature === "hot" ? " 🔥" : ""}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                  .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
                  .field { margin-bottom: 15px; }
                  .label { font-weight: bold; color: #1e293b; }
                  .value { color: #475569; margin-top: 5px; }
                  .message-box { background: white; padding: 15px; border-left: 4px solid #2563eb; margin-top: 10px; }
                  .score-badge { display: inline-block; background: #1e293b; color: white; padding: 4px 10px; border-radius: 999px; font-size: 12px; margin-top: 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">New Quote Request</h1>
                    <span class="score-badge">Score: ${score}/100 · ${temperature.toUpperCase()}</span>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">Name:</div>
                      <div class="value">${escapeHtml(name)}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email:</div>
                      <div class="value">${escapeHtml(email)}</div>
                    </div>
                    <div class="field">
                      <div class="label">Company:</div>
                      <div class="value">${escapeHtml(company || "N/A")}</div>
                    </div>
                    <div class="field">
                      <div class="label">Phone:</div>
                      <div class="value">${escapeHtml(phone || "N/A")}</div>
                    </div>
                    <div class="field">
                      <div class="label">Service Required:</div>
                      <div class="value">${escapeHtml(service || "N/A")}</div>
                    </div>
                    <div class="field">
                      <div class="label">Budget Range:</div>
                      <div class="value">${escapeHtml(budget || "N/A")}</div>
                    </div>
                    <div class="field">
                      <div class="label">Message:</div>
                      <div class="message-box">${escapeHtml(message || "No message provided")}</div>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

      } catch (emailError) {
        console.error("Team notification email error:", emailError);
      }

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.RESEND_FROM_EMAIL || "NexScope <onboarding@resend.dev>";
        await resend.emails.send({
          from,
          to: [email],
          subject: "Your quote request is in — NexScope",
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
                <p>Hi ${escapeHtml(name)},</p>
                <p>Thanks for requesting a quote from NexScope. We've received the details and someone from our team will follow up within 24 hours with next steps.</p>
                <p>— The NexScope Team</p>
              </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error("Customer auto-reply email error:", emailError);
        // Lead is already saved to the DB above, so don't fail the request
        // just because the email provider had an issue.
      }
    } else {
      console.warn("RESEND_API_KEY not configured — quote lead saved to DB but no email sent.");
    }

    return NextResponse.json(
      { message: "Quote request sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending quote request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to send quote request", error: errorMessage },
      { status: 500 }
    );
  }
}
