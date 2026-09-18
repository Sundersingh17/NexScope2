"use client";

import { useRotatingHeadline, AnimatedLine } from "@/components/shared/rotating-headline";

export function LuxuryHero() {
  const currentHeadline = useRotatingHeadline();

  return (
    <section className="flex min-h-[85svh] flex-col items-center justify-center bg-[var(--color-ink)] px-6 pt-20 text-center sm:px-10">
      <p className="mb-6 text-[0.68rem] font-medium uppercase tracking-[0.35em] text-[var(--color-yellow)]/80">
        A Digital Systems Studio
      </p>
      <h1
        style={{ fontFamily: "var(--font-fraunces), serif" }}
        className="max-w-4xl text-[clamp(2.1rem,8vw,4.5rem)] font-medium leading-[1.08] tracking-tight text-[var(--color-cream)]"
      >
        <AnimatedLine text={currentHeadline.who} lines={2} />
        <AnimatedLine text={currentHeadline.what} className="italic text-[var(--color-yellow)]" delay={0.1} lines={2} />
      </h1>
      <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-8 max-w-md text-sm font-light leading-relaxed text-[var(--color-cream)]/55">
        Branding, websites, AI automation, and growth marketing — crafted with the care of a studio that treats every client as its only one.
      </p>
      <a
        href="/get-quote"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
        className="mt-10 border-b border-[var(--color-yellow)] pb-1 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-yellow)] hover:text-[var(--color-cream)] hover:border-[var(--color-cream)] transition-colors"
      >
        Begin a project
      </a>
    </section>
  );
}
