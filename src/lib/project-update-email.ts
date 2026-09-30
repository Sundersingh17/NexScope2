import { Resend } from "resend";

interface ProjectUpdateEmailInput {
  clientName: string;
  clientEmail: string;
  projectName: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  marketContext: string | null;
  nextAction: string | null;
  clientPrompt: string | null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function field(label: string, value: string | null) {
  if (!value) return "";
  return `<div style="margin:20px 0"><strong style="display:block;color:#141414;font-size:12px;text-transform:uppercase;letter-spacing:.12em">${label}</strong><p style="margin:6px 0;color:#4b4b45;line-height:1.6;white-space:pre-line">${escapeHtml(value)}</p></div>`;
}

export async function notifyProjectUpdate(input: ProjectUpdateEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured — project update saved but no email sent.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL || "NexScope <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const portalUrl = `${siteUrl.replace(/\/$/, "")}/portal/login`;

  await resend.emails.send({
    from,
    to: [input.clientEmail],
    subject: `New update for ${input.projectName}: ${input.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;background:#fbf7ee;font-family:Arial,sans-serif;color:#141414">
          <div style="max-width:620px;margin:0 auto;padding:32px 20px">
            <div style="background:#141414;color:#fbf7ee;padding:24px;border-bottom:6px solid #ff4d00">
              <p style="margin:0;color:#ffc72e;font-size:12px;font-weight:bold;letter-spacing:.16em;text-transform:uppercase">NexScope client workspace</p>
              <h1 style="margin:14px 0 0;font-size:28px;line-height:1.1">A new project update is ready</h1>
            </div>
            <div style="background:#f3ede2;padding:24px;border:2px solid #141414;border-top:0">
              <p style="margin-top:0">Hi ${escapeHtml(input.clientName)},</p>
              <p>Your team has posted a new update for <strong>${escapeHtml(input.projectName)}</strong>.</p>
              <h2 style="font-size:22px;margin:24px 0 0">${escapeHtml(input.title)}</h2>
              ${field("Update", input.description)}
              ${field("Market context", input.marketContext)}
              ${field("What's next", input.nextAction)}
              ${input.videoUrl ? `<p><a href="${escapeHtml(input.videoUrl)}" style="color:#ff4d00;font-weight:bold">Watch the working video</a></p>` : ""}
              ${input.clientPrompt ? `<div style="margin-top:24px;padding:16px;background:#ffc72e;border:2px solid #141414"><strong>Your input is needed</strong>${field("Decision", input.clientPrompt)}</div>` : ""}
              <p style="margin:28px 0 8px"><a href="${escapeHtml(portalUrl)}" style="display:inline-block;background:#141414;color:#fbf7ee;padding:13px 20px;text-decoration:none;font-weight:bold">Open your client portal</a></p>
              <p style="font-size:12px;color:#6b6b62">Reply to this email if you need help accessing your workspace.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}