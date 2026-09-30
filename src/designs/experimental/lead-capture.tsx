"use client";

import { useState } from "react";

const fieldClass = "w-full border border-[var(--color-ink)] bg-[var(--color-cream)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] placeholder-[var(--color-ink)]/40 focus:outline-none focus:bg-[var(--color-yellow)]/20 transition-colors";
const labelClass = "block font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] mb-1.5";

export function ExperimentalLeadCapture() {
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
    <section className="bg-[var(--color-cream)] px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-2 text-center font-display text-3xl font-black uppercase tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Let&apos;s make something
        </h2>
        <p className="mb-10 text-center text-sm font-medium text-[var(--color-ink)]/60">Tell us what you&apos;re building.</p>

        {submitted ? (
          <div className="-rotate-1 border border-[var(--color-ink)] bg-[var(--color-yellow)] p-10 text-center">
            <p className="font-display text-2xl font-black uppercase">Got it!</p>
            <p className="mt-2 text-sm font-medium">We&apos;ll reach out within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className={labelClass}>Project Details</label>
              <textarea name="message" rows={4} className={`${fieldClass} resize-none`} placeholder="What are you building?" />
            </div>
            <button type="submit" disabled={loading} className="rotate-1 border border-[var(--color-ink)] bg-[var(--color-ink)] px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-cream)] transition-transform hover:rotate-0 hover:scale-105 disabled:opacity-60">
              {loading ? "Sending..." : "Send request"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
