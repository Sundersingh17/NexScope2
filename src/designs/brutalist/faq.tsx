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

export function BrutalistFAQ({ items }: FAQDesignProps) {
  const faqs = items && items.length > 0 ? items : FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-paper)] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <h2 className="mb-10 font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          Questions
        </h2>
        <div className="border-t-2 border-[var(--color-ink)]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className="border-b-2 border-[var(--color-ink)]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-base font-bold uppercase tracking-tight sm:text-lg">{faq.q}</span>
                  <span aria-hidden="true" className="shrink-0 border-2 border-[var(--color-ink)] px-2.5 py-0.5 font-display text-lg font-black">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm font-medium leading-relaxed text-[var(--color-ink)]/70">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
