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

export function BrutalistTestimonialsPage({ testimonials }: TestimonialsPageProps) {
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
    <div className="pt-16">
      <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)] py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <p className="mb-4 inline-block border-2 border-[var(--color-ink)] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em]">Testimonials</p>
          <h1 className="font-display text-[clamp(2.2rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter text-[var(--color-ink)]">
            Client stories.<br /><span className="text-[var(--color-orange)]">No filter.</span>
          </h1>
        </div>
      </section>

      <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="grid gap-0 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`border-t-2 border-[var(--color-ink)] py-6 pr-6 ${i % 2 === 0 ? "sm:border-r-2" : ""}`}>
                <StarRating rating={t.rating} />
                <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--color-ink)]/80">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-orange)] font-display text-xs font-black text-[var(--color-cream)]">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-display text-xs font-black uppercase">{t.name}</p>
                    <p className="text-[0.65rem] font-bold text-[var(--color-ink)]/50">{t.role ? `${t.role}, ` : ""}{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VideoTestimonialShowcase items={videoStories.length > 0 ? videoStories : undefined} />

      <section className="bg-[var(--color-ink)] py-20 text-center text-[var(--color-cream)]">
        <div className="mx-auto max-w-2xl px-4 sm:px-8">
          <h2 className="font-display text-3xl font-black uppercase tracking-tighter sm:text-5xl">Be our next story.</h2>
          <p className="mt-4 text-sm font-medium text-[var(--color-cream)]/60">Join 50+ businesses that trust NexScope for their digital growth.</p>
          <a href="/get-quote" className="mt-8 inline-block border-2 border-[var(--color-orange)] bg-[var(--color-orange)] px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] hover:bg-transparent hover:text-[var(--color-orange)] transition-colors">
            Start your project
          </a>
        </div>
      </section>
    </div>
  );
}
