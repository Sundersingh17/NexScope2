import { Star } from "lucide-react";
import { VideoTestimonialShowcase } from "@/components/sections/video-testimonial";
import type { TestimonialsPageProps } from "../types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={12} className="fill-[var(--color-orange)] text-[var(--color-orange)]" />
      ))}
    </div>
  );
}

export function FuturisticTestimonialsPage({ testimonials }: TestimonialsPageProps) {
  const videoStories = testimonials.map((t) => ({
    project: t.company,
    category: "Client story",
    quote: t.content,
    name: t.name,
    role: t.role ? `${t.role}, ${t.company}` : t.company,
    initials: t.name.split(" ").map((n) => n[0]).join("").slice(0, 2),
    videoUrl: t.videoUrl || undefined,
  }));

  return (
    <div className="bg-[var(--color-ink)] pt-24">
      <section className="relative overflow-hidden px-4 py-20 text-center">
        <div className="nx-futuristic-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">
            Testimonials
          </p>
          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight text-[var(--color-cream)]">
            What our clients say
          </h1>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-6 backdrop-blur-sm">
              <StarRating rating={t.rating} />
              <p className="mt-3 text-sm font-light leading-relaxed text-[var(--color-cream)]/70">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-yellow)] font-display text-xs font-bold text-[var(--color-ink)]">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-cream)]">{t.name}</p>
                  <p className="text-[0.65rem] font-light text-[var(--color-cream)]/60">{t.role ? `${t.role}, ` : ""}{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <VideoTestimonialShowcase items={videoStories.length > 0 ? videoStories : undefined} />

      <section className="px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-[var(--color-cream)] sm:text-3xl">Be our next success story.</h2>
        <a href="/get-quote" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-yellow)] px-6 py-3 text-sm font-bold text-[var(--color-ink)] shadow-[0_0_25px_-6px_var(--color-orange)] hover:shadow-[0_0_35px_-4px_var(--color-orange)] transition-shadow">
          Start your project <span aria-hidden="true">&rarr;</span>
        </a>
      </section>
    </div>
  );
}
