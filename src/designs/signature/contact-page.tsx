"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Loader2, MessageCircle, Calendar, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-xl px-4 py-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-gray)] focus:outline-none focus:border-[var(--color-orange)] transition-colors";
const labelClass = "block font-display text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/70 mb-1.5";

export function SignatureContactPage() {
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
    <div className="pt-28 bg-[var(--color-cream)]">
      <section className="py-16 md:py-20 border-b-2 border-[var(--color-ink)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4">Contact</Badge>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
            Let&apos;s Talk
          </h1>
          <p className="text-[var(--color-gray)] text-lg max-w-2xl mb-12">
            Have a project in mind? Fill out the form and we&apos;ll get back to you within 24 hours.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <div className="rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-neo-lg p-8">
                {error && <p className="text-red-600 text-sm font-medium mb-4">{error}</p>}
                {submitted ? (
                  <div className="text-center py-16">
                    <CheckCircle2 size={40} className="text-[var(--color-orange)] mx-auto mb-4" />
                    <h3 className="font-display text-xl font-black mb-2 text-[var(--color-ink)]">Message Sent!</h3>
                    <p className="text-[var(--color-gray)] text-sm">We&apos;ll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 font-display text-xs font-bold text-[var(--color-orange)] underline underline-offset-4">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Name *</label>
                        <input type="text" name="name" required placeholder="Your name" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input type="email" name="email" required placeholder="you@company.com" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Company</label>
                      <input type="text" name="company" placeholder="Your company name" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Budget Range</label>
                      <select name="budget" className={`${inputClass} appearance-none`}>
                        <option value="">Select a range</option>
                        <option value="Under ₹1,00,000">Under ₹1,00,000</option>
                        <option value="₹1,00,000 – ₹5,00,000">₹1,00,000 – ₹5,00,000</option>
                        <option value="₹5,00,000 – ₹15,00,000">₹5,00,000 – ₹15,00,000</option>
                        <option value="₹15,00,000+">₹15,00,000+</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Project Details *</label>
                      <textarea name="message" required rows={5} placeholder="Tell us about your project, goals, and timeline…" className={`${inputClass} resize-none`} />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="neo-button flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)] shadow-neo-orange font-display text-sm font-bold px-8 py-3.5 disabled:opacity-60"
                    >
                      {loading ? (<><Loader2 size={16} className="animate-spin" />Sending...</>) : (<>Send Message &rarr;</>)}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]/50 mb-2">Contact Info</p>
              <div className="flex items-start gap-4 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-5 shadow-neo-sm">
                <div className="w-11 h-11 shrink-0 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-yellow)] flex items-center justify-center">
                  <Mail size={18} className="text-[var(--color-ink)]" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-[var(--color-ink)]">Email</p>
                  <a href="mailto:hello@nexscope.in" className="text-sm text-[var(--color-gray)] hover:text-[var(--color-orange)] transition-colors">hello@nexscope.in</a>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-5 shadow-neo-sm">
                <div className="w-11 h-11 shrink-0 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-orange)] flex items-center justify-center">
                  <Phone size={18} className="text-[var(--color-cream)]" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-[var(--color-ink)]">Phone</p>
                  <a href="tel:+919876543210" className="text-sm text-[var(--color-gray)] hover:text-[var(--color-orange)] transition-colors">+91 98765 43210</a>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-5 shadow-neo-sm">
                <div className="w-11 h-11 shrink-0 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-ink)] flex items-center justify-center">
                  <MessageCircle size={18} className="text-[var(--color-cream)]" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-[var(--color-ink)]">WhatsApp</p>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-gray)] hover:text-[var(--color-orange)] transition-colors">Chat on WhatsApp</a>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-5 shadow-neo-sm">
                <div className="w-11 h-11 shrink-0 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-yellow)] flex items-center justify-center">
                  <MapPin size={18} className="text-[var(--color-ink)]" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-[var(--color-ink)]">Location</p>
                  <p className="text-sm text-[var(--color-gray)]">India</p>
                </div>
              </div>
              <div className="rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-ink)] p-6 mt-8">
                <div className="w-11 h-11 rounded-lg border-2 border-[var(--color-cream)]/20 bg-[var(--color-cream)]/10 flex items-center justify-center mb-3">
                  <Calendar size={18} className="text-[var(--color-cream)]" />
                </div>
                <p className="font-display text-sm font-bold text-[var(--color-cream)] mb-1">Book a Discovery Call</p>
                <p className="text-xs text-[var(--color-cream)]/60 mb-4">Prefer a quick chat? Book a free 15-minute call to discuss your project.</p>
                <Button href="/get-quote" dark className="w-full justify-center">Schedule Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
