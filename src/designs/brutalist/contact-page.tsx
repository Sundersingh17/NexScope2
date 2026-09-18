"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, MessageCircle, CheckCircle2 } from "lucide-react";

const fieldClass = "w-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] placeholder-[var(--color-ink)]/40 focus:outline-none focus:bg-[var(--color-yellow)]/20 transition-colors";
const labelClass = "block font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] mb-1.5";

export function BrutalistContactPage() {
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
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b-4 border-[var(--color-ink)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <p className="mb-4 inline-block border-2 border-[var(--color-ink)] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em]">Contact</p>
          <h1 className="font-display text-[clamp(2.2rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter text-[var(--color-ink)]">
            Let&apos;s talk.
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium text-[var(--color-ink)]/70">Fill out the form and we&apos;ll get back to you within 24 hours.</p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[3fr_2fr]">
            <div className="border-2 border-[var(--color-ink)] p-6 sm:p-8">
              {error && <p className="mb-4 text-sm font-bold text-red-600">{error}</p>}
              {submitted ? (
                <div className="py-16 text-center">
                  <CheckCircle2 size={36} className="mx-auto mb-4 text-[var(--color-orange)]" />
                  <h3 className="font-display text-xl font-black uppercase">Message sent.</h3>
                  <p className="mt-2 text-sm text-[var(--color-ink)]/60">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 font-display text-xs font-bold uppercase text-[var(--color-orange)] underline underline-offset-4">
                    Send another message
                  </button>
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
                    <textarea name="message" required rows={5} className={`${fieldClass} resize-none`} placeholder="Tell us about your project, goals, and timeline…" />
                  </div>
                  <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 border-2 border-[var(--color-ink)] bg-[var(--color-ink)] px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-cream)] hover:bg-[var(--color-orange)] transition-colors disabled:opacity-60">
                    {loading ? (<><Loader2 size={16} className="animate-spin" />Sending...</>) : (<>Send message &rarr;</>)}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 border-2 border-[var(--color-ink)] p-4">
                <Mail size={18} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                <div>
                  <p className="font-display text-xs font-black uppercase">Email</p>
                  <a href="mailto:hello@nexscope.in" className="text-sm text-[var(--color-ink)]/70 hover:text-[var(--color-orange)] transition-colors">hello@nexscope.in</a>
                </div>
              </div>
              <div className="flex items-start gap-3 border-2 border-[var(--color-ink)] p-4">
                <Phone size={18} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                <div>
                  <p className="font-display text-xs font-black uppercase">Phone</p>
                  <a href="tel:+919876543210" className="text-sm text-[var(--color-ink)]/70 hover:text-[var(--color-orange)] transition-colors">+91 98765 43210</a>
                </div>
              </div>
              <div className="flex items-start gap-3 border-2 border-[var(--color-ink)] p-4">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                <div>
                  <p className="font-display text-xs font-black uppercase">WhatsApp</p>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-ink)]/70 hover:text-[var(--color-orange)] transition-colors">Chat on WhatsApp</a>
                </div>
              </div>
              <div className="flex items-start gap-3 border-2 border-[var(--color-ink)] p-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                <div>
                  <p className="font-display text-xs font-black uppercase">Location</p>
                  <p className="text-sm text-[var(--color-ink)]/70">India</p>
                </div>
              </div>
              <a href="/get-quote" className="block border-2 border-[var(--color-orange)] bg-[var(--color-orange)] p-4 text-center font-display text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] hover:opacity-90 transition-opacity">
                Book a discovery call
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
