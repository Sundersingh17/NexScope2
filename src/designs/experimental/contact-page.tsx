"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, MessageCircle, CheckCircle2 } from "lucide-react";

const fieldClass = "w-full border border-[var(--color-ink)] bg-[var(--color-cream)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] placeholder-[var(--color-ink)]/40 focus:outline-none focus:bg-[var(--color-yellow)]/20 transition-colors";
const labelClass = "block font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] mb-1.5";

export function ExperimentalContactPage() {
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
    <div className="bg-[var(--color-cream)] pt-28">
      <section className="px-6 py-16 text-center">
        <p className="-rotate-2 mx-auto mb-4 inline-block border border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
          Contact
        </p>
        <h1 className="font-display text-[clamp(2.2rem,8vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]">
          Let&apos;s talk<span className="text-[var(--color-orange)]">.</span>
        </h1>
      </section>

      <section className="border-t border-[var(--color-ink)]/15 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[3fr_2fr]">
          <div className="rotate-1 border border-[var(--color-ink)] bg-[var(--color-paper)] p-6 sm:p-8">
            {error && <p className="mb-4 text-sm font-bold text-red-600">{error}</p>}
            {submitted ? (
              <div className="py-16 text-center">
                <CheckCircle2 size={36} className="mx-auto mb-4 text-[var(--color-orange)]" />
                <h3 className="font-display text-xl font-black uppercase">Message sent!</h3>
                <p className="mt-2 text-sm text-[var(--color-ink)]/60">We&apos;ll get back to you within 24 hours.</p>
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
                    <input type="text" name="company" className={fieldClass} placeholder="Company name" />
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
                <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-8 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-cream)] transition-transform hover:scale-105 disabled:opacity-60">
                  {loading ? (<><Loader2 size={16} className="animate-spin" />Sending...</>) : "Send message"}
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
            ].map((item, i) => (
              <div key={item.label} className={`flex items-start gap-3 border border-[var(--color-ink)] bg-[var(--color-paper)] p-4 transition-transform hover:rotate-0 ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}>
                <item.icon size={18} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                <div>
                  <p className="font-display text-xs font-black uppercase">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-[var(--color-ink)]/70 hover:text-[var(--color-orange)] transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-sm text-[var(--color-ink)]/70">{item.value}</p>
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
