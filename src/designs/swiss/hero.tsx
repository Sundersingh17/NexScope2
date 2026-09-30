"use client";

import { useRotatingHeadline, AnimatedLine } from "@/components/shared/rotating-headline";

export function SwissHero() {
  const currentHeadline = useRotatingHeadline();

  return (
    <section className="flex min-h-[85svh] flex-col items-center justify-center border-b border-[var(--color-ink)]/15 bg-[var(--color-cream)] px-6 pt-16 text-center sm:px-10">
      <p className="mb-8 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-ink)]/60">
        NexScope — Digital Systems Studio
      </p>
      <h1 className="max-w-3xl font-display text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[var(--color-ink)]">
        <AnimatedLine text={currentHeadline.who} lines={2} />
        <AnimatedLine text={currentHeadline.what} lines={2} />
      </h1>
      <p className="mx-auto mt-8 max-w-md text-sm font-light leading-relaxed text-[var(--color-ink)]/60">
        Branding, websites, AI automation, and growth marketing — built with precision and restraint.
      </p>
      <a href="/get-quote" className="mt-10 border border-[var(--color-ink)] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">
        Start a project
      </a>
    </section>
  );
}
