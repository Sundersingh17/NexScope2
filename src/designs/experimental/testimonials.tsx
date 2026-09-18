import type { TestimonialsDesignProps } from "../types";

const FALLBACK_TESTIMONIALS = [
  { initials: "RK", name: "Rahul Kapoor", role: "Founder, TechVault", content: "NexScope transformed our digital presence completely. World-class design sensibilities.", rating: 5 },
  { initials: "SM", name: "Shreya Mehta", role: "CEO, UrbanKart", content: "Our e-commerce revenue grew 3x after NexScope rebuilt our store.", rating: 5 },
  { initials: "AJ", name: "Arjun Joshi", role: "CTO, GrowthLabs", content: "Their AI automation saved us 40+ hours per week.", rating: 5 },
];

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1"];

export function ExperimentalTestimonials({ items }: TestimonialsDesignProps) {
  const testimonials = items && items.length > 0 ? items : FALLBACK_TESTIMONIALS;

  return (
    <section className="bg-[var(--color-cream)] px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 text-center font-display text-3xl font-black uppercase tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Client love
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className={`border border-[var(--color-ink)] bg-[var(--color-paper)] p-6 transition-transform hover:rotate-0 ${ROTATIONS[i % ROTATIONS.length]}`}>
              <p className="text-sm font-medium leading-relaxed text-[var(--color-ink)]/75">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-ink)] bg-[var(--color-yellow)] font-display text-xs font-black text-[var(--color-ink)]">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-display text-xs font-black uppercase">{t.name}</p>
                  <p className="text-[0.65rem] font-medium text-[var(--color-ink)]/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
