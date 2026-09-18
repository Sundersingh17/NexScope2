"use client";

import { useState } from "react";
import type { FAQDesignProps } from "../types";

const FALLBACK_FAQS = [
  { q: "What services does NexScope offer?", a: "We offer AI & Automation, Web & App Development, Branding & Design, and Marketing & Growth services." },
  { q: "How long does a typical project take?", a: "Timelines vary based on scope. A typical website takes 4-6 weeks; larger projects 8-12 weeks." },
  { q: "Do you work with startups or only established businesses?", a: "We work with businesses of all sizes — from early-stage startups to established enterprises." },
  { q: "What is your pricing model?", a: "Project-based pricing with transparent quotes and fixed costs." },
  { q: "Do you provide post-launch support?", a: "Yes — ongoing maintenance, support, and growth services with 24/7 support." },
];

export function ExperimentalFAQ({ items }: FAQDesignProps) {
  const faqs = items && items.length > 0 ? items : FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-cream)] px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-14 text-center font-display text-3xl font-black uppercase tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Questions?
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className={`border border-[var(--color-ink)] bg-[var(--color-paper)] transition-transform ${isOpen ? "rotate-0" : i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}>
                <button onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                  <span className="font-display text-sm font-black uppercase tracking-tight text-[var(--color-ink)]">{faq.q}</span>
                  <span aria-hidden="true" className="shrink-0 border border-[var(--color-ink)] bg-[var(--color-yellow)] px-2 py-0.5 font-display text-base font-black">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && <p className="px-5 pb-5 text-sm font-medium text-[var(--color-ink)]/60">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
