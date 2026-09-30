import type { TestimonialsDesignProps } from "../types";

const FALLBACK_TESTIMONIALS = [
  { initials: "RK", name: "Rahul Kapoor", role: "Founder, TechVault", content: "NexScope transformed our digital presence completely. The team's strategic approach and design sensibilities are world-class.", rating: 5 },
  { initials: "SM", name: "Shreya Mehta", role: "CEO, UrbanKart", content: "Our e-commerce revenue grew 3x after NexScope rebuilt our store. The UX and performance improvements were incredible.", rating: 5 },
  { initials: "AJ", name: "Arjun Joshi", role: "CTO, GrowthLabs", content: "Their AI automation saved us 40+ hours per week. The team is responsive, professional, and genuinely cares about results.", rating: 5 },
];

export function BrutalistTestimonials({ items }: TestimonialsDesignProps) {
  const testimonials = items && items.length > 0 ? items : FALLBACK_TESTIMONIALS;

  return (
    <section id="testimonials" className="border-b-4 border-[var(--color-ink)] bg-[var(--color-ink)] py-16 text-[var(--color-cream)] sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <h2 className="mb-10 font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          What clients say
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col border-2 border-[var(--color-cream)]/25 p-6">
              <span aria-hidden="true" className="font-display text-5xl font-black leading-none text-[var(--color-orange)]">&ldquo;</span>
              <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-[var(--color-cream)]/85">{t.content}</p>
              <div className="mt-5 border-t-2 border-[var(--color-cream)]/15 pt-4">
                <p className="font-display text-sm font-bold uppercase tracking-tight">{t.name}</p>
                <p className="text-xs text-[var(--color-cream)]/60">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
