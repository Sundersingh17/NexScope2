import { CheckCircle } from "lucide-react";
import type { ServicesPageProps } from "../types";

export function BrutalistServicesPage({ pillars }: ServicesPageProps) {
  return (
    <div className="pt-16">
      <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)] py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <p className="mb-4 inline-block border-2 border-[var(--color-ink)] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em]">Services</p>
          <h1 className="font-display text-[clamp(2.2rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter text-[var(--color-ink)]">
            Eight pillars.<br /><span className="text-[var(--color-orange)]">Zero fluff.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm font-medium leading-relaxed text-[var(--color-ink)]/70">
            From digital foundations to AI-powered growth — every service is built to build, automate, and scale your business.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/packages" className="border-2 border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-cream)] hover:bg-[var(--color-orange)] transition-colors">View Packages</a>
            <a href="/get-quote" className="border-2 border-[var(--color-ink)] px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">Get a Quote</a>
          </div>
        </div>
      </section>

      {pillars.map((pillar, i) => {
        const dark = i % 2 === 1;
        return (
          <section key={pillar.slug} className={`border-b-4 border-[var(--color-ink)] py-16 ${dark ? "bg-[var(--color-ink)] text-[var(--color-cream)]" : "bg-[var(--color-cream)] text-[var(--color-ink)]"}`}>
            <div className="mx-auto max-w-5xl px-4 sm:px-8">
              <div className="flex items-start gap-6">
                <span className={`shrink-0 font-display text-4xl font-black sm:text-6xl ${dark ? "text-[var(--color-cream)]/60" : "text-[var(--color-ink)]/60"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-black uppercase tracking-tight sm:text-4xl">{pillar.title}</h2>
                  <p className={`mt-2 max-w-xl text-sm font-medium ${dark ? "text-[var(--color-cream)]/60" : "text-[var(--color-ink)]/60"}`}>{pillar.tagline}</p>
                  <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs font-medium">
                        <CheckCircle size={14} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`/services/${pillar.slug}`}
                    className={`mt-6 inline-block border-2 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest transition-colors ${dark ? "border-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)]" : "border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"}`}
                  >
                    Learn more &rarr;
                  </a>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-[var(--color-cream)] py-20 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-8">
          <h2 className="font-display text-3xl font-black uppercase tracking-tighter sm:text-5xl">Not sure where to start?</h2>
          <p className="mt-4 text-sm font-medium text-[var(--color-ink)]/60">Browse pre-built packages or build your own custom system.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/packages" className="border-2 border-[var(--color-ink)] bg-[var(--color-orange)] px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] hover:opacity-90 transition-opacity">Explore Packages</a>
            <a href="/get-quote" className="border-2 border-[var(--color-ink)] px-6 py-3 font-display text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">Talk to Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
