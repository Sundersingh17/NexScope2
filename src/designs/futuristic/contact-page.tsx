"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, MessageCircle, CheckCircle2 } from "lucide-react";

const fieldClass = "w-full rounded-xl border border-[var(--color-cream)]/15 bg-[var(--color-cream)]/[0.03] px-4 py-3 text-sm text-[var(--color-cream)] placeholder-[var(--color-cream)]/30 backdrop-blur-sm focus:outline-none focus:border-[var(--color-orange)]/50 transition-colors";
const labelClass = "block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-cream)]/50 mb-1.5";

export function FuturisticContactPage() {
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
    <div className="bg-[var(--color-ink)] pt-24">
      <section className="relative overflow-hidden px-4 py-20 text-center">
        <div className="nx-futuristic-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-xl">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">Contact</p>
          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold text-[var(--color-cream)]">Let&apos;s talk.</h1>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-[3fr_2fr]">
          <div className="rounded-3xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-8 backdrop-blur-sm">
            {error && <p className="mb-4 text-sm font-bold text-red-400">{error}</p>}
            {submitted ? (
              <div className="rounded-xl border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 p-6 text-center">
                <CheckCircle2 size={28} className="mx-auto mb-2 text-[var(--color-orange)]" />
                <p className="font-display text-lg font-bold text-[var(--color-cream)]">Message sent.</p>
                <p className="mt-1 text-sm text-[var(--color-cream)]/60">We&apos;ll reach out within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input type="text" name="name" required className={fieldClass} placeholder="Your name" />
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
                    <label className={labelClass}>Budget Range</label>
                    <select name="budget" className={`${fieldClass} appearance-none`}>
                      <option value="" className="bg-[var(--color-ink)]">Select a range</option>
                      <option value="Under ₹1,00,000" className="bg-[var(--color-ink)]">Under ₹1,00,000</option>
                      <option value="₹1,00,000 – ₹5,00,000" className="bg-[var(--color-ink)]">₹1,00,000 – ₹5,00,000</option>
                      <option value="₹5,00,000 – ₹15,00,000" className="bg-[var(--color-ink)]">₹5,00,000 – ₹15,00,000</option>
                      <option value="₹15,00,000+" className="bg-[var(--color-ink)]">₹15,00,000+</option>
                      <option value="Not sure yet" className="bg-[var(--color-ink)]">Not sure yet</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Project Details *</label>
                  <textarea name="message" required rows={4} className={`${fieldClass} resize-none`} placeholder="Tell us about your project" />
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-yellow)] py-3.5 text-sm font-bold text-[var(--color-ink)] shadow-[0_0_25px_-6px_var(--color-orange)] hover:shadow-[0_0_35px_-4px_var(--color-orange)] transition-shadow disabled:opacity-60">
                  {loading ? (<span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Sending...</span>) : "Send message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-3">
            {[
              { icon: Mail, label: "Email", value: "hello@nexscope.in", href: "mailto:hello@nexscope.in" },
              { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
              { icon: MessageCircle, label: "WhatsApp", value: "Chat now", href: "https://wa.me/919876543210" },
              { icon: MapPin, label: "Location", value: "India", href: undefined },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-4 backdrop-blur-sm">
                <item.icon size={16} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-cream)]/40">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-[var(--color-cream)] hover:text-[var(--color-orange)] transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-sm text-[var(--color-cream)]">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
