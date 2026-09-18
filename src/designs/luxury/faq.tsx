"use client";

import { useState } from "react";
import type { FAQDesignProps } from "../types";

const FALLBACK_FAQS = [
  { q: "What services does NexScope offer?", a: "We offer AI & Automation, Web & App Development, Branding & Design, and Marketing & Growth services. Each solution is tailored to your business needs." },
  { q: "How long does a typical project take?", a: "Timelines vary based on scope. A typical website takes 4-6 weeks, while larger projects like AI automation systems can take 8-12 weeks. We provide clear timelines during our discovery call." },
  { q: "Do you work with startups or only established businesses?", a: "We work with businesses of all sizes — from early-stage startups to established enterprises. Our solutions are scalable and adapt to your budget and growth stage." },
  { q: "What is your pricing model?", a: "We offer project-based pricing with transparent quotes. After understanding your requirements, we provide a detailed proposal with fixed costs and clear deliverables." },
  { q: "Do you provide post-launch support?", a: "Yes, we offer ongoing maintenance, support, and growth services. Our 24/7 support ensures your digital assets remain secure, updated, and performing optimally." },
];

export function LuxuryFAQ({ items }: FAQDesignProps) {
  const faqs = items && items.length > 0 ? items : FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[var(--color-cream)] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-ink)]/40">Questions</p>
        <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-16 text-center text-4xl font-medium text-[var(--color-ink)] sm:text-5xl">
          Good to know
        </h2>
        <div>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className="border-b border-[var(--color-ink)]/15">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-lg font-medium text-[var(--color-ink)]">{faq.q}</span>
                  <span aria-hidden="true" className="shrink-0 text-lg font-light text-[var(--color-yellow)]">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="pb-6 text-sm font-light leading-relaxed text-[var(--color-ink)]/60">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
