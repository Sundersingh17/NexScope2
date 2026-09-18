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

export function FuturisticFAQ({ items }: FAQDesignProps) {
  const faqs = items && items.length > 0 ? items : FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-ink)] px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">FAQ</p>
        <h2 className="mb-14 text-center font-display text-3xl font-bold text-[var(--color-cream)] sm:text-5xl">
          Questions, answered
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className={`rounded-2xl border backdrop-blur-sm transition-colors ${isOpen ? "border-[var(--color-orange)]/40 bg-[var(--color-cream)]/[0.05]" : "border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03]"}`}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-display text-sm font-bold text-[var(--color-cream)]">{faq.q}</span>
                  <span aria-hidden="true" className={`shrink-0 text-lg font-light transition-colors ${isOpen ? "text-[var(--color-orange)]" : "text-[var(--color-cream)]/40"}`}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm font-light leading-relaxed text-[var(--color-cream)]/55">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
