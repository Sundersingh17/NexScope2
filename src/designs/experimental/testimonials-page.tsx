import { VideoTestimonialShowcase } from "@/components/sections/video-testimonial";
import type { TestimonialsPageProps } from "../types";

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1"];

export function ExperimentalTestimonialsPage({ testimonials }: TestimonialsPageProps) {
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
    <div className="bg-[var(--color-cream)] pt-28">
      <section className="px-6 py-16 text-center">
        <p className="-rotate-2 mx-auto mb-4 inline-block border border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
          Testimonials
        </p>
        <h1 className="font-display text-[clamp(2.2rem,8vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]">
          Client love<span className="text-[var(--color-orange)]">.</span>
        </h1>
      </section>

      <section className="border-t border-[var(--color-ink)]/15 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className={`border border-[var(--color-ink)] bg-[var(--color-paper)] p-6 transition-transform hover:rotate-0 ${ROTATIONS[i % ROTATIONS.length]}`}>
              <p className="text-sm font-medium leading-relaxed text-[var(--color-ink)]/75">&ldquo;{t.content}&rdquo;</p>
              <p className="mt-4 font-display text-xs font-black uppercase">{t.name}</p>
              <p className="text-[0.65rem] font-medium text-[var(--color-ink)]/60">{t.role ? `${t.role}, ` : ""}{t.company}</p>
            </div>
          ))}
        </div>
      </section>

      <VideoTestimonialShowcase items={videoStories.length > 0 ? videoStories : undefined} />

      <section className="border-t border-[var(--color-ink)]/15 bg-[var(--color-ink)] py-16 text-center text-[var(--color-cream)]">
        <h2 className="font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">Be our next story.</h2>
        <a href="/get-quote" className="mt-8 inline-block rotate-1 border border-[var(--color-orange)] bg-[var(--color-orange)] px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] transition-transform hover:rotate-0 hover:scale-105">
          Start your project
        </a>
      </section>
    </div>
  );
}
