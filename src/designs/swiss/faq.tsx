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

export function SwissFAQ({ items }: FAQDesignProps) {
  const faqs = items && items.length > 0 ? items : FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-[var(--color-ink)]/15 bg-[var(--color-cream)] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          Questions
        </h2>
        <div>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className="border-t border-[var(--color-ink)]/20 last:border-b">
                <button onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className="text-sm font-bold text-[var(--color-ink)]">{faq.q}</span>
                  <span aria-hidden="true" className="shrink-0 text-lg font-light text-[var(--color-ink)]/60">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p className="pb-5 text-sm font-light leading-relaxed text-[var(--color-ink)]/60">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
