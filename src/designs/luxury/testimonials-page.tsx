import { Star } from "lucide-react";
import { VideoTestimonialShowcase } from "@/components/sections/video-testimonial";
import type { TestimonialsPageProps } from "../types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={12} className="fill-[var(--color-yellow)] text-[var(--color-yellow)]" />
      ))}
    </div>
  );
}

export function LuxuryTestimonialsPage({ testimonials }: TestimonialsPageProps) {
  const featured = testimonials.filter((t) => t.featured);
  const rest = testimonials.filter((t) => !t.featured);
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
    <div className="pt-20">
      <section className="bg-[var(--color-ink)] px-6 py-28 text-center sm:px-10">
        <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/80">Testimonials</p>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mx-auto max-w-3xl text-4xl font-medium leading-tight text-[var(--color-cream)] sm:text-6xl">
          What our clients <span className="italic text-[var(--color-yellow)]">say</span>
        </h1>
      </section>

      {featured.length > 0 && (
        <section className="bg-[var(--color-cream)] px-6 py-24 sm:px-10">
          <div className="mx-auto grid max-w-5xl gap-12 sm:grid-cols-3">
            {featured.map((t) => (
              <div key={t.name}>
                <StarRating rating={t.rating} />
                <p style={{ fontFamily: "var(--font-fraunces), serif" }} className="mt-3 text-lg font-medium italic leading-snug text-[var(--color-ink)]">
                  &ldquo;{t.content}&rdquo;
                </p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-ink)]/50">
                  {t.name} — {t.role ? `${t.role}, ` : ""}{t.company}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="bg-[var(--color-ink)] px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-12 text-center text-2xl font-medium text-[var(--color-cream)] sm:text-3xl">
              More client stories
            </h2>
            <div className="divide-y divide-[var(--color-cream)]/10">
              {rest.map((t) => (
                <div key={t.name} className="py-6">
                  <StarRating rating={t.rating} />
                  <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-3 text-sm font-light leading-relaxed text-[var(--color-cream)]/70">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-yellow)]/70">
                    {t.name} — {t.role ? `${t.role}, ` : ""}{t.company}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <VideoTestimonialShowcase items={videoStories.length > 0 ? videoStories : undefined} />

      <section className="bg-[var(--color-cream)] px-6 py-24 text-center sm:px-10">
        <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-3xl font-medium text-[var(--color-ink)] sm:text-4xl">
          Ready to become our next success story?
        </h2>
        <a href="/get-quote" className="mt-8 inline-block border-b border-[var(--color-ink)]/40 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)]/70 hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)] transition-colors">
          Start your project
        </a>
      </section>
    </div>
  );
}
