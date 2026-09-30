"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-xl px-4 py-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-gray)] focus:outline-none focus:border-[var(--color-orange)] transition-colors";
const labelClass = "block font-display text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/70 mb-1.5";

export function LeadCaptureSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const service = new URLSearchParams(window.location.search).get("service");
      const serviceMap: Record<string, string> = {
        launch: "Web & App Development",
        brand: "Branding & Design",
        growth: "Marketing & Growth",
        automate: "AI & Automation",
      };
      if (service && serviceMap[service]) setSelectedService(serviceMap[service]);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

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
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta" className="py-20 sm:py-28 bg-[var(--color-cream)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Get Started"
          title="Request a Quote"
          description="Tell us about your project and we'll get back to you within 24 hours."
        />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-neo-lg p-8 sm:p-10"
        >
          {error && <p className="text-red-600 text-sm font-medium mb-4">{error}</p>}

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle2 size={40} className="text-[var(--color-orange)] mx-auto mb-4" />
              <h3 className="font-display text-xl font-black mb-2">Thank You!</h3>
              <p className="text-[var(--color-gray)] text-sm">
                We&apos;ll reach out within 24 hours.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)]/10 pb-4">
                <div>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-orange)]">Step {step} of 2</p>
                  <p className="mt-1 text-xs text-[var(--color-gray)]">{step === 1 ? "Tell us who you are" : "Shape the project direction"}</p>
                </div>
                <div className="flex gap-2" aria-hidden="true">
                  <span className={`h-2 w-12 rounded-full ${step >= 1 ? "bg-[var(--color-orange)]" : "bg-[var(--color-ink)]/10"}`} />
                  <span className={`h-2 w-12 rounded-full ${step >= 2 ? "bg-[var(--color-orange)]" : "bg-[var(--color-ink)]/10"}`} />
                </div>
              </div>

              <div className={step === 1 ? "space-y-5" : "hidden"}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input type="text" name="name" required={step === 1} placeholder="Your full name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input type="text" name="company" placeholder="Company name" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" name="email" required={step === 1} placeholder="you@company.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" name="phone" placeholder="+91 98765 43210" className={inputClass} />
                </div>
              </div>
              <button type="button" onClick={(event) => { const form = event.currentTarget.closest("form"); if (form?.reportValidity()) setStep(2); }} className="neo-button flex w-full items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-ink)] py-4 font-display text-sm font-bold text-[var(--color-cream)] shadow-neo-orange">Continue to project details</button>
              </div>

              {step === 2 && <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Service Required</label>
                  <select name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} className={`${inputClass} appearance-none`}>
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
                  <select name="budget" className={`${inputClass} appearance-none`}>
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
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Describe your project, goals, timeline, and any specific requirements…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="w-full rounded-full border-2 border-[var(--color-ink)] px-4 py-4 font-display text-sm font-bold text-[var(--color-ink)] hover:bg-[var(--color-yellow)] sm:w-1/3">Back</button>
              <button
                type="submit"
                disabled={loading}
                className="neo-button w-full flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)] shadow-neo-orange font-display text-sm font-bold py-4 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Request
                    <Send size={16} />
                  </>
                )}
              </button>
              </div>
              </>}
            </div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
