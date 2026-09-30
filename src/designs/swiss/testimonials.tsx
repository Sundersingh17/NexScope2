import type { TestimonialsDesignProps } from "../types";

const FALLBACK_TESTIMONIALS = [
  { initials: "RK", name: "Rahul Kapoor", role: "Founder, TechVault", content: "NexScope transformed our digital presence completely. The team's strategic approach and design sensibilities are world-class.", rating: 5 },
  { initials: "SM", name: "Shreya Mehta", role: "CEO, UrbanKart", content: "Our e-commerce revenue grew 3x after NexScope rebuilt our store. The UX and performance improvements were incredible.", rating: 5 },
  { initials: "AJ", name: "Arjun Joshi", role: "CTO, GrowthLabs", content: "Their AI automation saved us 40+ hours per week. The team is responsive, professional, and genuinely cares about results.", rating: 5 },
];

export function SwissTestimonials({ items }: TestimonialsDesignProps) {
  const testimonials = items && items.length > 0 ? items : FALLBACK_TESTIMONIALS;

  return (
    <section className="border-b border-[var(--color-ink)]/15 bg-[var(--color-cream)] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          What clients say
        </h2>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="border-t border-[var(--color-ink)] pt-4">
              <p className="text-sm font-light leading-relaxed text-[var(--color-ink)]/70">&ldquo;{t.content}&rdquo;</p>
              <p className="mt-4 text-xs font-bold text-[var(--color-ink)]">{t.name}</p>
              <p className="text-xs font-light text-[var(--color-ink)]/60">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
