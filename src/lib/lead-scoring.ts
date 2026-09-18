/**
 * Lead scoring & routing automation.
 *
 * Scores an inbound lead 0-100 based on budget and service fit, then
 * classifies it hot/warm/cold. Every lead triggers an instant Slack alert
 * so lower-budget requests are not silently dropped.
 */

export type Temperature = "hot" | "warm" | "cold";

const HIGH_VALUE_BUDGETS = ["15,00,000+", "15l+", "5,00,000 – 15,00,000", "5l-15l"];
const MID_VALUE_BUDGETS = ["1,00,000 – 5,00,000", "1l-5l"];

const HIGH_INTENT_SERVICES = ["full suite", "done-for-you", "ai automation", "custom product"];

export interface ScoreInput {
  budget?: string | null;
  service?: string | null;
  message?: string | null;
  phone?: string | null;
  company?: string | null;
}

export interface ScoreResult {
  score: number; // 0-100
  temperature: Temperature;
}

function normalize(value?: string | null): string {
  return (value || "").toLowerCase().trim();
}

export function scoreLead(input: ScoreInput): ScoreResult {
  let score = 20; // base score for any complete, real-looking submission

  const budget = normalize(input.budget);
  const service = normalize(input.service);

  if (HIGH_VALUE_BUDGETS.some((b) => budget.includes(b))) {
    score += 35;
  } else if (MID_VALUE_BUDGETS.some((b) => budget.includes(b))) {
    score += 20;
  } else if (budget) {
    score += 8;
  }

  if (HIGH_INTENT_SERVICES.some((s) => service.includes(s))) {
    score += 20;
  } else if (service) {
    score += 10;
  }

  if (input.company) score += 10;
  if (input.phone) score += 10;
  if (input.message && input.message.trim().length > 60) score += 5; // a real, detailed brief

  score = Math.max(0, Math.min(100, score));

  const temperature: Temperature = score >= 65 ? "hot" : score >= 40 ? "warm" : "cold";

  return { score, temperature };
}

/**
 * Fire-and-forget Slack alert for hot leads. Safe to call even if
 * SLACK_WEBHOOK_URL isn't configured — it just no-ops.
 * Set up a Slack "Incoming Webhook" and put the URL in this env var.
 */
export async function notifyLead(params: {
  name: string;
  email: string;
  company?: string | null;
  budget?: string | null;
  service?: string | null;
  score: number;
  temperature: Temperature;
  source: string;
}): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text:
          `📩 *New lead* (${params.temperature} · score ${params.score}/100) via ${params.source}\n` +
          `*${params.name}*${params.company ? ` — ${params.company}` : ""}\n` +
          `${params.email}\n` +
          `Service: ${params.service || "N/A"} · Budget: ${params.budget || "N/A"}`,
      }),
    });
  } catch (error) {
    console.error("Slack lead notification failed:", error);
  }
}
