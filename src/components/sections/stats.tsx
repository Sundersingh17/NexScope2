"use client";

import { useRef, useState, useEffect } from "react";

interface CountUpProps {
  to: number;
  suffix: string;
}

/** Animates 0 → target once the number scrolls into view, ported from
 *  the reference implementation (IntersectionObserver + requestAnimationFrame
 *  with an ease-out curve, plus a scroll-listener fallback for older
 *  browsers/edge cases where the observer doesn't fire in time). */
function CountUp({ to, suffix }: CountUpProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let timeoutId = 0;
    let hasRun = false;

    const startCount = () => {
      if (hasRun) return;
      hasRun = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setVal(to);
        return;
      }

      let startTime = 0;
      const step = (now: number) => {
        if (!startTime) startTime = now;
        const progress = Math.min(1, (now - startTime) / 1400);
        setVal(Math.round(to * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
      timeoutId = window.setTimeout(() => setVal(to), 1800);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startCount();
          observer.disconnect();
        }
      },
      { rootMargin: "-40px" }
    );
    observer.observe(el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
        startCount();
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const fallbackTimer = window.setTimeout(onScroll, 900);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      clearTimeout(fallbackTimer);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [to]);

  return (
    <p
      ref={ref}
      className="font-display text-2xl font-black leading-none tracking-tight tabular-nums sm:text-5xl md:text-6xl text-[var(--color-ink)]"
    >
      {val}
      <span className="text-[var(--color-orange)]">{suffix}</span>
    </p>
  );
}

const STATS_DATA = [
  { value: "50", suffix: "+", label: "PROJECTS DELIVERED" },
  { value: "30", suffix: "+", label: "HAPPY CLIENTS" },
  { value: "98", suffix: "%", label: "CLIENT RETENTION" },
];

export function StatsSection() {
  return (
    <section className="border-b-2 border-[var(--color-ink)] bg-[var(--color-yellow)]">
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x-2 divide-[var(--color-ink)] border-x-2 border-[var(--color-ink)]">
        {STATS_DATA.map((stat) => (
          <div key={stat.label} className="px-2 py-7 text-center sm:px-6 sm:py-12">
            <CountUp to={parseInt(stat.value, 10) || 0} suffix={stat.suffix} />
            <p className="mt-1.5 font-display text-[0.5rem] font-bold leading-tight tracking-[0.14em] text-[var(--color-ink)]/70 sm:mt-2 sm:text-xs sm:tracking-[0.18em]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
