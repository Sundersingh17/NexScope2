"use client";

import { useRotatingHeadline, AnimatedLine } from "@/components/shared/rotating-headline";

export function FuturisticHero() {
  const currentHeadline = useRotatingHeadline();

  return (
    <section className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden bg-[var(--color-ink)] px-4 pt-24 text-center">
      {/* Animated glow field — purely decorative, fixed, pointer-events
          none, respects prefers-reduced-motion via the animation-none
          fallback below. */}
      <div className="nx-futuristic-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="mb-6 inline-block rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">
          Next-Gen Digital Systems
        </p>
        <h1 className="font-display text-[clamp(2.1rem,7.5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-cream)]">
          <AnimatedLine text={currentHeadline.who} lines={2} />
          <AnimatedLine
            text={currentHeadline.what}
            lines={2}
            className="bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-yellow)] bg-clip-text text-transparent"
            delay={0.08}
          />
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-sm font-light leading-relaxed text-[var(--color-cream)]/60">
          Branding, websites, AI automation, and growth marketing — engineered like a product, not a project.
        </p>
        <a
          href="/get-quote"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-cream)]/15 bg-[var(--color-cream)]/5 px-6 py-3 text-sm font-bold text-[var(--color-cream)] backdrop-blur-xl hover:border-[var(--color-orange)]/50 hover:shadow-[0_0_30px_-8px_var(--color-orange)] transition-all"
        >
          Start a project <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
}
