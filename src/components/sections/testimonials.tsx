"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Star } from "lucide-react";

export interface TestimonialItem {
  initials: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  company?: string;
  videoUrl?: string;
  isSample?: boolean;
}

// Shown only if the database has no featured testimonials yet (e.g. right
// after first deploy, before anything's been added in /admin). Once real
// testimonials exist and are marked "featured", they replace this entirely.
const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  { initials: "RK", name: "Rahul Kapoor", role: "Founder, TechVault", content: "NexScope transformed our digital presence completely. The team's strategic approach and design sensibilities are world-class.", rating: 5 },
  { initials: "SM", name: "Shreya Mehta", role: "CEO, UrbanKart", content: "Our e-commerce revenue grew 3x after NexScope rebuilt our store. The UX and performance improvements were incredible.", rating: 5 },
  { initials: "AJ", name: "Arjun Joshi", role: "CTO, GrowthLabs", content: "Their AI automation saved us 40+ hours per week. The team is responsive, professional, and genuinely cares about results.", rating: 5 },
];

export function TestimonialsSection({ items }: { items?: TestimonialItem[] }) {
  const testimonials = items && items.length > 0 ? items : FALLBACK_TESTIMONIALS;

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-ink)]" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          dark
          label="Testimonials"
          title="What Clients Say"
          description="Feedback from founders and leaders we've partnered with."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border-2 border-[var(--color-cream)]/15 bg-[var(--color-cream)]/[0.04] backdrop-blur-sm p-7 transition-colors hover:border-[var(--color-orange)]/50"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-[var(--color-yellow)] text-[var(--color-yellow)]" />
                ))}
              </div>

              <blockquote className="text-sm text-[var(--color-cream)]/85 leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[var(--color-cream)]/20 bg-[var(--color-orange)] flex items-center justify-center text-xs font-bold text-[var(--color-cream)]">
                  {t.initials}
                </div>
                <div>
                  <strong className="text-sm font-semibold block text-[var(--color-cream)]">{t.name}</strong>
                  <span className="text-xs text-[var(--color-cream)]/60">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
