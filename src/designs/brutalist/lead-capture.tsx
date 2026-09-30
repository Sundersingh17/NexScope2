"use client";

import { useState } from "react";

// Deliberately a single, no-frills step (Brutalist's interaction language is
// "hard, direct, no hand-holding") — but it posts to the exact same
// /api/quote endpoint with the exact same fields as Signature's
// LeadCaptureSection, so the actual lead-capture functionality (what
// happens after submit, what the admin sees in Leads) is identical.
const fieldClass = "w-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] placeholder-[var(--color-ink)]/40 focus:outline-none focus:bg-[var(--color-yellow)]/20 transition-colors";
const labelClass = "block font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] mb-1.5";

export function BrutalistLeadCapture() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          phone: formData.get("phone"),
          service: formData.get("service"),
          budget: formData.get("budget"),
          message: formData.get("message"),
        }),
      });
      if (!response.ok) throw new Error("Failed to send quote request");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta" className="bg-[var(--color-cream)] py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-8">
        <h2 className="mb-3 font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          Let&apos;s talk
        </h2>
        <p className="mb-8 text-sm font-medium text-[var(--color-ink)]/70">
          Tell us about your project. We&apos;ll get back to you within 24 hours.
        </p>

        {submitted ? (
          <div className="border-2 border-[var(--color-ink)] bg-[var(--color-yellow)] p-10 text-center">
            <p className="font-display text-2xl font-black uppercase">Got it.</p>
            <p className="mt-2 text-sm font-medium">We&apos;ll reach out within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border-2 border-[var(--color-ink)] p-6 sm:p-8 space-y-4">
            {error && <p className="text-sm font-bold text-red-600">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Name *</label>
                <input type="text" name="name" required className={fieldClass} placeholder="Your full name" />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" name="email" required className={fieldClass} placeholder="you@company.com" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Company</label>
                <input type="text" name="company" className={fieldClass} placeholder="Company name" />
              </div>
              <div>
                <label className={labelClass}>Service</label>
                <select name="service" className={`${fieldClass} appearance-none`}>
                  <option value="">Select a service</option>
                  <option value="AI & Automation">AI & Automation</option>
                  <option value="Web & App Development">Web & App Development</option>
                  <option value="Branding & Design">Branding & Design</option>
                  <option value="Marketing & Growth">Marketing & Growth</option>
                  <option value="Full Suite">Full Suite</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Budget Range</label>
                <select name="budget" className={`${fieldClass} appearance-none`}>
                  <option value="">Select budget</option>
                  <option value="Under ₹1,00,000">Under ₹1,00,000</option>
                  <option value="₹1,00,000 – ₹5,00,000">₹1,00,000 – ₹5,00,000</option>
                  <option value="₹5,00,000 – ₹15,00,000">₹5,00,000 – ₹15,00,000</option>
                  <option value="₹15,00,000+">₹15,00,000+</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Project Details</label>
              <textarea name="message" rows={4} className={`${fieldClass} resize-none`} placeholder="What are you building?" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-ink)] py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-cream)] hover:bg-[var(--color-orange)] transition-colors disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send request"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
