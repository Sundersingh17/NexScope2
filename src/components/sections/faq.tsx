"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

export interface FAQItem {
  q: string;
  a: string;
}

// Shown only if the database has no published FAQs yet.
const FALLBACK_FAQS: FAQItem[] = [
  { q: "What services does NexScope offer?", a: "We offer AI & Automation, Web & App Development, Branding & Design, and Marketing & Growth services. Each solution is tailored to your business needs." },
  { q: "How long does a typical project take?", a: "Timelines vary based on scope. A typical website takes 4-6 weeks, while larger projects like AI automation systems can take 8-12 weeks. We provide clear timelines during our discovery call." },
  { q: "Do you work with startups or only established businesses?", a: "We work with businesses of all sizes — from early-stage startups to established enterprises. Our solutions are scalable and adapt to your budget and growth stage." },
  { q: "What is your pricing model?", a: "We offer project-based pricing with transparent quotes. After understanding your requirements, we provide a detailed proposal with fixed costs and clear deliverables." },
  { q: "Do you provide post-launch support?", a: "Yes, we offer ongoing maintenance, support, and growth services. Our 24/7 support ensures your digital assets remain secure, updated, and performing optimally." },
];

export function FAQSection({ items }: { items?: FAQItem[] }) {
  const faqs = items && items.length > 0 ? items : FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-cream)]" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="FAQ"
          title="Frequently Asked Questions"
          description="Got questions? We have answers."
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] overflow-hidden shadow-neo-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-display text-sm font-bold text-[var(--color-ink)] hover:text-[var(--color-orange)] transition-colors"
              >
                {faq.q}
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 transition-transform duration-300 text-[var(--color-ink)]",
                    openIndex === i && "rotate-180 text-[var(--color-orange)]"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-sm leading-relaxed text-[var(--color-gray)] border-t-2 border-[var(--color-ink)]/10 pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
