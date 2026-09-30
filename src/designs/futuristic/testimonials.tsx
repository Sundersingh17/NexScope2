import type { TestimonialsDesignProps } from "../types";

const FALLBACK_TESTIMONIALS = [
  { initials: "RK", name: "Rahul Kapoor", role: "Founder, TechVault", content: "NexScope transformed our digital presence completely. The team's strategic approach and design sensibilities are world-class.", rating: 5 },
  { initials: "SM", name: "Shreya Mehta", role: "CEO, UrbanKart", content: "Our e-commerce revenue grew 3x after NexScope rebuilt our store. The UX and performance improvements were incredible.", rating: 5 },
  { initials: "AJ", name: "Arjun Joshi", role: "CTO, GrowthLabs", content: "Their AI automation saved us 40+ hours per week. The team is responsive, professional, and genuinely cares about results.", rating: 5 },
];

export function FuturisticTestimonials({ items }: TestimonialsDesignProps) {
  const testimonials = items && items.length > 0 ? items : FALLBACK_TESTIMONIALS;

  return (
    <section className="bg-[var(--color-ink)] px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">Client Stories</p>
        <h2 className="mb-14 text-center font-display text-3xl font-bold text-[var(--color-cream)] sm:text-5xl">
          What clients say
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-yellow)] font-display text-xs font-bold text-[var(--color-ink)]">
                {t.initials}
              </div>
              <p className="text-sm font-light leading-relaxed text-[var(--color-cream)]/70">{t.content}</p>
              <p className="mt-4 text-xs font-bold text-[var(--color-cream)]">{t.name}</p>
              <p className="text-xs font-light text-[var(--color-cream)]/60">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
