"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, MessageCircle, CheckCircle2 } from "lucide-react";

const fieldClass = "w-full border-b border-[var(--color-ink)]/20 bg-transparent py-2.5 text-sm font-light text-[var(--color-ink)] placeholder-[var(--color-ink)]/35 focus:outline-none focus:border-[var(--color-yellow)] transition-colors";
const labelClass = "block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[var(--color-ink)]/60 mb-1.5";

export function LuxuryContactPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          budget: formData.get("budget"),
          message: formData.get("message"),
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-[var(--color-cream)]">
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-ink)]/60">Contact</p>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-4xl font-medium text-[var(--color-ink)] sm:text-6xl">
            Let&apos;s talk.
          </h1>
          <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-4 max-w-md text-sm font-light text-[var(--color-ink)]/60">
            Fill out the form and we&apos;ll get back to you within 24 hours.
          </p>

          <div className="mt-14 grid gap-14 sm:grid-cols-[3fr_2fr]">
            {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
            {submitted ? (
              <div className="sm:col-span-2">
                <CheckCircle2 size={32} className="mb-4 text-[var(--color-yellow)]" />
                <p style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-2xl italic text-[var(--color-ink)]">Message sent — we&apos;ll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input type="text" name="name" required className={fieldClass} placeholder="Your name" />
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
                    <label className={labelClass}>Budget Range</label>
                    <select name="budget" className={`${fieldClass} appearance-none`}>
                      <option value="">Select a range</option>
                      <option value="Under ₹1,00,000">Under ₹1,00,000</option>
                      <option value="₹1,00,000 – ₹5,00,000">₹1,00,000 – ₹5,00,000</option>
                      <option value="₹5,00,000 – ₹15,00,000">₹5,00,000 – ₹15,00,000</option>
                      <option value="₹15,00,000+">₹15,00,000+</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Project Details *</label>
                  <textarea name="message" required rows={4} className={`${fieldClass} resize-none`} placeholder="Tell us about your project" />
                </div>
                <button type="submit" disabled={loading} className="flex items-center gap-2 border-b border-[var(--color-ink)] pb-1 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-ink)] hover:text-[var(--color-yellow)] hover:border-[var(--color-yellow)] transition-colors disabled:opacity-50">
                  {loading ? (<><Loader2 size={14} className="animate-spin" />Sending...</>) : "Send message"}
                </button>
              </form>
            )}

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-1 shrink-0 text-[var(--color-yellow)]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-ink)]/60">Email</p>
                  <a href="mailto:hello@nexscope.in" className="text-sm font-light text-[var(--color-ink)] hover:text-[var(--color-yellow)] transition-colors">hello@nexscope.in</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-1 shrink-0 text-[var(--color-yellow)]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-ink)]/60">Phone</p>
                  <a href="tel:+919876543210" className="text-sm font-light text-[var(--color-ink)] hover:text-[var(--color-yellow)] transition-colors">+91 98765 43210</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle size={16} className="mt-1 shrink-0 text-[var(--color-yellow)]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-ink)]/60">WhatsApp</p>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-sm font-light text-[var(--color-ink)] hover:text-[var(--color-yellow)] transition-colors">Chat now</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-[var(--color-yellow)]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-ink)]/60">Location</p>
                  <p className="text-sm font-light text-[var(--color-ink)]">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
