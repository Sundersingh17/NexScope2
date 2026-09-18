import type { ServicesPageProps } from "../types";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function LuxuryServicesPage({ pillars }: ServicesPageProps) {
  return (
    <div className="pt-20">
      <section className="bg-[var(--color-ink)] px-6 py-28 text-center sm:px-10">
        <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/80">Services</p>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mx-auto max-w-3xl text-4xl font-medium leading-tight text-[var(--color-cream)] sm:text-6xl">
          Eight pillars, <span className="italic text-[var(--color-yellow)]">one studio</span>
        </h1>
        <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-[var(--color-cream)]/55">
          From digital foundations to AI-powered growth, every capability is designed to build, automate, and scale your business.
        </p>
        <a href="/get-quote" className="mt-8 inline-block border-b border-[var(--color-yellow)] pb-1 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-yellow)] hover:text-[var(--color-cream)] hover:border-[var(--color-cream)] transition-colors">
          Get a quote
        </a>
      </section>

      {pillars.map((pillar, i) => {
        const dark = i % 2 === 1;
        return (
          <section key={pillar.slug} className={`px-6 py-20 sm:px-10 ${dark ? "bg-[var(--color-ink)]" : "bg-[var(--color-cream)]"}`}>
            <div className="mx-auto max-w-3xl">
              <span style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-sm italic text-[var(--color-yellow)]/70">{ROMAN[i]}</span>
              <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className={`mt-2 text-2xl font-medium sm:text-3xl ${dark ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]"}`}>
                {pillar.title}
              </h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className={`mt-2 max-w-xl text-sm font-light ${dark ? "text-[var(--color-cream)]/55" : "text-[var(--color-ink)]/55"}`}>
                {pillar.tagline}
              </p>
              <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {pillar.items.map((item) => (
                  <li key={item} style={{ fontFamily: "var(--font-inter), sans-serif" }} className={`text-xs font-light ${dark ? "text-[var(--color-cream)]/60" : "text-[var(--color-ink)]/60"}`}>
                    — {item}
                  </li>
                ))}
              </ul>
              <a
                href={`/services/${pillar.slug}`}
                className={`mt-6 inline-block border-b pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${dark ? "border-[var(--color-cream)]/40 text-[var(--color-cream)]/80 hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)]" : "border-[var(--color-ink)]/30 text-[var(--color-ink)]/70 hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)]"}`}
              >
                Learn more
              </a>
            </div>
          </section>
        );
      })}

      <section className="bg-[var(--color-cream)] px-6 py-24 text-center sm:px-10">
        <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-3xl font-medium text-[var(--color-ink)] sm:text-4xl">
          Not sure where to start?
        </h2>
        <a href="/packages" className="mt-8 inline-block border-b border-[var(--color-ink)]/40 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)]/70 hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)] transition-colors">
          Explore packages
        </a>
      </section>
    </div>
  );
}
