"use client";

import { useState } from "react";

const fieldClass = "w-full rounded-xl border border-[var(--color-cream)]/15 bg-[var(--color-cream)]/[0.03] px-4 py-3 text-sm text-[var(--color-cream)] placeholder-[var(--color-cream)]/30 backdrop-blur-sm focus:outline-none focus:border-[var(--color-orange)]/50 transition-colors";
const labelClass = "block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-cream)]/50 mb-1.5";

export function FuturisticLeadCapture() {
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
    <section className="bg-[var(--color-ink)] px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-8 backdrop-blur-sm sm:p-10">
          <p className="mb-2 text-center text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">Let&apos;s build</p>
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-[var(--color-cream)] sm:text-3xl">
            Start your project
          </h2>

          {submitted ? (
            <div className="rounded-xl border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 p-6 text-center">
              <p className="font-display text-lg font-bold text-[var(--color-cream)]">Request sent.</p>
              <p className="mt-1 text-sm text-[var(--color-cream)]/60">We&apos;ll reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm font-bold text-red-400">{error}</p>}
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
              <div className="grid gap-4 sm:grid-cols-2">
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
                <textarea name="message" rows={3} className={`${fieldClass} resize-none`} placeholder="What are you building?" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-yellow)] py-3.5 text-sm font-bold text-[var(--color-ink)] shadow-[0_0_25px_-6px_var(--color-orange)] hover:shadow-[0_0_35px_-4px_var(--color-orange)] transition-shadow disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
