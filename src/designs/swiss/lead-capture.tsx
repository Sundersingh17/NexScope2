"use client";

import { useState } from "react";

const fieldClass = "w-full border-b border-[var(--color-ink)]/25 bg-transparent py-2.5 text-sm font-light text-[var(--color-ink)] placeholder-[var(--color-ink)]/35 focus:outline-none focus:border-[var(--color-ink)] transition-colors";
const labelClass = "block text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[var(--color-ink)]/50 mb-1.5";

export function SwissLeadCapture() {
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
    <section className="bg-[var(--color-cream)] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          Start a project
        </h2>

        {submitted ? (
          <p className="text-center text-sm font-light text-[var(--color-ink)]/60">Thank you — we&apos;ll be in touch within 24 hours.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-sm text-red-600">{error}</p>}
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
              <textarea name="message" rows={3} className={`${fieldClass} resize-none`} placeholder="What are you building?" />
            </div>
            <button type="submit" disabled={loading} className="mx-auto block border border-[var(--color-ink)] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors disabled:opacity-50">
              {loading ? "Sending..." : "Send request"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
