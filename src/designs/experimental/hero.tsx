"use client";

import { useRotatingHeadline, AnimatedLine } from "@/components/shared/rotating-headline";

export function ExperimentalHero() {
  const currentHeadline = useRotatingHeadline();

  return (
    <section className="relative flex min-h-[95svh] flex-col items-center justify-center overflow-hidden bg-[var(--color-cream)] px-6 pt-28 text-center">
      <span aria-hidden="true" className="pointer-events-none absolute -left-10 top-1/3 hidden -rotate-90 font-display text-[10vw] font-black uppercase tracking-tighter text-[var(--color-ink)]/[0.04] sm:block">
        NexScope
      </span>
      <p className="mb-6 -rotate-2 inline-block border border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
        Studio Mode: On
      </p>
      <h1 className="relative max-w-3xl font-display text-[clamp(2.2rem,9vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]">
        <AnimatedLine text={currentHeadline.who} lines={2} />
        <AnimatedLine text={currentHeadline.what} lines={2} className="text-[var(--color-orange)]" delay={0.08} />
      </h1>
      <p className="mx-auto mt-8 max-w-md text-sm font-medium leading-relaxed text-[var(--color-ink)]/60">
        Branding, websites, AI automation, and growth marketing — made by people who still think the web should be fun.
      </p>
      <a
        href="/get-quote"
        className="mt-10 rotate-1 border border-[var(--color-ink)] bg-[var(--color-ink)] px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-cream)] transition-transform hover:rotate-0 hover:scale-105"
      >
        Start a project &rarr;
      </a>
    </section>
  );
}
