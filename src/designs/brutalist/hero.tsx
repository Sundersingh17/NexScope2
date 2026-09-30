"use client";

import { useRotatingHeadline, AnimatedLine } from "@/components/shared/rotating-headline";

// Brutalist hero: oversized typography, hard borders, asymmetric grid —
// but the headline itself now rotates through the same shared
// HERO_HEADLINES as every other design, via the same shared
// useRotatingHeadline/AnimatedLine used by Signature. Only the type size/
// weight/layout around it is Brutalist-specific.
export function BrutalistHero() {
  const currentHeadline = useRotatingHeadline();

  return (
    <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)] pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 inline-block border-2 border-[var(--color-ink)] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em]">
              NexScope — Digital Systems Studio
            </p>
            <h1 className="font-display text-[clamp(2rem,8vw,5.25rem)] font-black uppercase leading-[0.92] tracking-tighter text-[var(--color-ink)]">
              <AnimatedLine text={currentHeadline.who} lines={2} />
              <AnimatedLine text={currentHeadline.what} className="text-[var(--color-orange)]" delay={0.08} lines={2} />
            </h1>
          </div>
          <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6">
            <p className="text-sm font-medium leading-relaxed text-[var(--color-ink)]/80">
              Branding, websites, AI automation, and growth marketing — built by one team that ships fast and doesn&apos;t disappear after launch.
            </p>
            <a
              href="/get-quote"
              className="mt-6 flex items-center justify-between border-2 border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-cream)] hover:bg-[var(--color-orange)] transition-colors"
            >
              Start a project
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
