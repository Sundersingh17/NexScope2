"use client";

import { useState } from "react";

// Same /api/quote endpoint and field set as Signature and Brutalist — only
// the form's visual language (underline inputs, no boxes, serif labels)
// differs.
const fieldClass = "w-full border-b border-[var(--color-cream)]/25 bg-transparent py-2.5 text-sm font-light text-[var(--color-cream)] placeholder-[var(--color-cream)]/35 focus:outline-none focus:border-[var(--color-yellow)] transition-colors";
const labelClass = "block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[var(--color-cream)]/60 mb-1.5";

export function LuxuryLeadCapture() {
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
    <section className="bg-[var(--color-ink)] px-6 py-24 text-[var(--color-cream)] sm:px-10 sm:py-32">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/70">Get in touch</p>
        <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-12 text-4xl font-medium sm:text-5xl">
          Let&apos;s start something
        </h2>

        {submitted ? (
          <p style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-2xl italic text-[var(--color-yellow)]">
            Thank you — we&apos;ll be in touch within 24 hours.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Name *</label>
                <input type="text" name="name" required className={fieldClass} placeholder="Your full name" />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" name="email" required className={fieldClass} placeholder="you@company.com" />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Company</label>
                <input type="text" name="company" className={fieldClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Service</label>
                <select name="service" className={`${fieldClass} appearance-none`}>
                  <option value="" className="bg-[var(--color-ink)]">Select a service</option>
                  <option value="AI & Automation" className="bg-[var(--color-ink)]">AI & Automation</option>
                  <option value="Web & App Development" className="bg-[var(--color-ink)]">Web & App Development</option>
                  <option value="Branding & Design" className="bg-[var(--color-ink)]">Branding & Design</option>
                  <option value="Marketing & Growth" className="bg-[var(--color-ink)]">Marketing & Growth</option>
                  <option value="Full Suite" className="bg-[var(--color-ink)]">Full Suite</option>
                </select>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Budget Range</label>
                <select name="budget" className={`${fieldClass} appearance-none`}>
                  <option value="" className="bg-[var(--color-ink)]">Select budget</option>
                  <option value="Under ₹1,00,000" className="bg-[var(--color-ink)]">Under ₹1,00,000</option>
                  <option value="₹1,00,000 – ₹5,00,000" className="bg-[var(--color-ink)]">₹1,00,000 – ₹5,00,000</option>
                  <option value="₹5,00,000 – ₹15,00,000" className="bg-[var(--color-ink)]">₹5,00,000 – ₹15,00,000</option>
                  <option value="₹15,00,000+" className="bg-[var(--color-ink)]">₹15,00,000+</option>
                  <option value="Not sure yet" className="bg-[var(--color-ink)]">Not sure yet</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Project Details</label>
              <textarea name="message" rows={3} className={`${fieldClass} resize-none`} placeholder="Tell us what you're building" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-4 block border-b border-[var(--color-yellow)] pb-1 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-yellow)] hover:text-[var(--color-cream)] hover:border-[var(--color-cream)] transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send enquiry"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
