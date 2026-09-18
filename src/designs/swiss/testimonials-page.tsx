import { VideoTestimonialShowcase } from "@/components/sections/video-testimonial";
import type { TestimonialsPageProps } from "../types";

export function SwissTestimonialsPage({ testimonials }: TestimonialsPageProps) {
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
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b border-[var(--color-ink)]/15 px-6 py-24 text-center sm:px-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-ink)]/40">Testimonials</p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          What our clients say
        </h1>
      </section>

      <section className="border-b border-[var(--color-ink)]/15 px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-12 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="border-t border-[var(--color-ink)] pt-4">
              <p className="text-sm font-light leading-relaxed text-[var(--color-ink)]/65">&ldquo;{t.content}&rdquo;</p>
              <p className="mt-4 text-xs font-bold text-[var(--color-ink)]">{t.name}</p>
              <p className="text-xs font-light text-[var(--color-ink)]/40">{t.role ? `${t.role}, ` : ""}{t.company}</p>
            </div>
          ))}
        </div>
      </section>

      <VideoTestimonialShowcase items={videoStories.length > 0 ? videoStories : undefined} />

      <section className="border-t border-[var(--color-ink)]/15 px-6 py-20 text-center sm:px-10">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">Be our next success story</h2>
        <a href="/get-quote" className="mt-8 inline-block border border-[var(--color-ink)] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">
          Start your project
        </a>
      </section>
    </div>
  );
}
