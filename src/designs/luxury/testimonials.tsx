"use client";

import { useState } from "react";
import type { TestimonialsDesignProps } from "../types";

const FALLBACK_TESTIMONIALS = [
  { initials: "RK", name: "Rahul Kapoor", role: "Founder, TechVault", content: "NexScope transformed our digital presence completely. The team's strategic approach and design sensibilities are world-class.", rating: 5 },
  { initials: "SM", name: "Shreya Mehta", role: "CEO, UrbanKart", content: "Our e-commerce revenue grew 3x after NexScope rebuilt our store. The UX and performance improvements were incredible.", rating: 5 },
  { initials: "AJ", name: "Arjun Joshi", role: "CTO, GrowthLabs", content: "Their AI automation saved us 40+ hours per week. The team is responsive, professional, and genuinely cares about results.", rating: 5 },
];

export function LuxuryTestimonials({ items }: TestimonialsDesignProps) {
  const testimonials = items && items.length > 0 ? items : FALLBACK_TESTIMONIALS;
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="bg-[var(--color-ink)] px-6 py-24 text-center text-[var(--color-cream)] sm:px-10 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <span aria-hidden="true" style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-6xl italic text-[var(--color-yellow)]/50">&ldquo;</span>
        <p style={{ fontFamily: "var(--font-fraunces), serif" }} className="mt-2 text-2xl font-medium leading-snug sm:text-3xl">
          {t.content}
        </p>
        <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-yellow)]/80">
          {t.name} — {t.role}
        </p>
        {testimonials.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${i === active ? "bg-[var(--color-yellow)]" : "bg-[var(--color-cream)]/25"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
