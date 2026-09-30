import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";
import { RevealCard } from "@/components/ui/reveal-card";
import { VideoTestimonialShowcase } from "@/components/sections/video-testimonial";
import type { TestimonialsPageProps } from "../types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={14} className="fill-[var(--color-yellow)] text-[var(--color-yellow)]" />
      ))}
    </div>
  );
}

export function SignatureTestimonialsPage({ testimonials }: TestimonialsPageProps) {
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
    <div className="pt-28">
      <section className="py-16 md:py-24 border-b-2 border-[var(--color-ink)] text-center bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4">Testimonials</Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02] mb-4 text-[var(--color-ink)]">
            What Our Clients Say
          </h1>
          <p className="text-[var(--color-gray)] text-lg max-w-3xl mx-auto leading-relaxed">
            Real feedback from real businesses. We let our results — and our clients — do the talking.
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-20 bg-[var(--color-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((t, i) => (
                <RevealCard key={t.name} delay={i * 0.1} className="relative rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-8 shadow-neo-sm transition-shadow hover:shadow-neo-md">
                  <Quote size={24} className="text-[var(--color-ink)]/[0.08] absolute top-6 right-6" />
                  <StarRating rating={t.rating} />
                  <p className="text-sm text-[var(--color-ink)]/80 leading-relaxed mt-4 mb-6">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-orange)] flex items-center justify-center text-sm font-bold text-[var(--color-cream)]">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-ink)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-gray)]">{t.role ? `${t.role}, ` : ""}{t.company}</p>
                    </div>
                  </div>
                </RevealCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="py-20 bg-[var(--color-ink)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-black uppercase tracking-tight mb-12 text-center text-[var(--color-cream)]">
              More Client Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map((t, i) => (
                <RevealCard key={t.name} delay={i * 0.08} className="rounded-xl border-2 border-[var(--color-cream)]/15 bg-[var(--color-cream)]/[0.04] p-6 transition-colors hover:border-[var(--color-orange)]/50">
                  <StarRating rating={t.rating} />
                  <p className="text-sm text-[var(--color-cream)]/80 leading-relaxed mt-3 mb-4">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-[var(--color-cream)]/20 bg-[var(--color-orange)] flex items-center justify-center text-xs font-bold text-[var(--color-cream)]">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-cream)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-cream)]/60">{t.role ? `${t.role}, ` : ""}{t.company}</p>
                    </div>
                  </div>
                </RevealCard>
              ))}
            </div>
          </div>
        </section>
      )}

      <VideoTestimonialShowcase items={videoStories.length > 0 ? videoStories : undefined} />

      <section className="py-20 text-center border-t-2 border-[var(--color-ink)] bg-[var(--color-cream)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
            Ready to Become Our Next Success Story?
          </h2>
          <p className="text-[var(--color-gray)] mb-8">Join 50+ businesses that trust NexScope for their digital growth.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/get-quote" size="lg" pop>Start Your Project</Button>
            <Button href="/portfolio" variant="secondary" size="lg">View Our Work</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
