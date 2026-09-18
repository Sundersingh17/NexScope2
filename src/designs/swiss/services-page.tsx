import { CheckCircle } from "lucide-react";
import type { ServicesPageProps } from "../types";

export function SwissServicesPage({ pillars }: ServicesPageProps) {
  return (
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b border-[var(--color-ink)]/15 px-6 py-24 text-center sm:px-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-ink)]/40">Services</p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Eight pillars. Infinite possibilities.
        </h1>
        <a href="/get-quote" className="mt-8 inline-block border border-[var(--color-ink)] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">
          Get a quote
        </a>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl divide-y divide-[var(--color-ink)]/10">
          {pillars.map((pillar, i) => (
            <div key={pillar.slug} className="grid gap-4 py-10 sm:grid-cols-[1fr_2fr]">
              <div>
                <span className="text-xs font-medium text-[var(--color-ink)]/40">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-1 text-xl font-bold text-[var(--color-ink)]">{pillar.title}</h2>
                <a href={`/services/${pillar.slug}`} className="mt-3 inline-block border-b border-[var(--color-ink)]/40 pb-0.5 text-xs font-medium uppercase tracking-wider text-[var(--color-ink)]/70 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors">
                  Learn more
                </a>
              </div>
              <div>
                <p className="text-sm font-light text-[var(--color-ink)]/60">{pillar.tagline}</p>
                <ul className="mt-4 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  {pillar.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs font-light text-[var(--color-ink)]/55">
                      <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-ink)]/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
