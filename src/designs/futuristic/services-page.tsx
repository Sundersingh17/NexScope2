import { CheckCircle } from "lucide-react";
import type { ServicesPageProps } from "../types";

export function FuturisticServicesPage({ pillars }: ServicesPageProps) {
  return (
    <div className="bg-[var(--color-ink)] pt-24">
      <section className="relative overflow-hidden px-4 py-20 text-center">
        <div className="nx-futuristic-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">
            Services
          </p>
          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight text-[var(--color-cream)]">
            Eight pillars. Infinite possibilities.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-relaxed text-[var(--color-cream)]/60">
            From digital foundations to AI-powered growth — every service is engineered to build, automate, and scale.
          </p>
          <a href="/get-quote" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-yellow)] px-6 py-3 text-sm font-bold text-[var(--color-ink)] shadow-[0_0_25px_-6px_var(--color-orange)] hover:shadow-[0_0_35px_-4px_var(--color-orange)] transition-shadow">
            Get a quote <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2">
          {pillars.map((pillar, i) => (
            <div key={pillar.slug} className="rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-6 backdrop-blur-sm transition-all hover:border-[var(--color-orange)]/40 hover:shadow-[0_0_30px_-10px_var(--color-orange)]">
              <span className="font-display text-2xl font-bold text-[var(--color-orange)]/40">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-2 font-display text-lg font-bold text-[var(--color-cream)]">{pillar.title}</h2>
              <p className="mt-1.5 text-xs font-light text-[var(--color-cream)]/60">{pillar.tagline}</p>
              <ul className="mt-4 space-y-1.5">
                {pillar.items.slice(0, 5).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[0.7rem] font-light text-[var(--color-cream)]/60">
                    <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={`/services/${pillar.slug}`} className="mt-4 inline-block text-xs font-bold text-[var(--color-orange)] hover:text-[var(--color-yellow)] transition-colors">
                Learn more &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-[var(--color-cream)] sm:text-3xl">Not sure where to start?</h2>
        <a href="/packages" className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-cream)]/15 bg-[var(--color-cream)]/5 px-6 py-3 text-sm font-bold text-[var(--color-cream)] backdrop-blur-xl hover:border-[var(--color-orange)]/50 transition-all">
          Explore packages
        </a>
      </section>
    </div>
  );
}
