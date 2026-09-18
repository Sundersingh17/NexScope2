import type { PackagesPageProps } from "../types";

export function LuxuryPackagesPage({ packages }: PackagesPageProps) {
  return (
    <div className="pt-20 bg-[var(--color-cream)]">
      <section className="bg-[var(--color-ink)] px-6 py-28 text-center sm:px-10">
        <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/80">Packages</p>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mx-auto max-w-2xl text-4xl font-medium text-[var(--color-cream)] sm:text-6xl">
          Pre-built <span className="italic text-[var(--color-yellow)]">growth systems</span>
        </h1>
      </section>

      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl divide-y divide-[var(--color-ink)]/10">
          {packages.map((pkg) => (
            <div key={pkg.slug} className="grid gap-6 py-10 sm:grid-cols-[2fr_3fr]">
              <div>
                <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-2xl font-medium text-[var(--color-ink)]">{pkg.title}</h2>
                {pkg.signal && <p style={{ fontFamily: "var(--font-fraunces), serif" }} className="mt-2 text-sm italic text-[var(--color-yellow)]/80">&ldquo;{pkg.signal}&rdquo;</p>}
                <a href="/get-quote" className="mt-4 inline-block border-b border-[var(--color-ink)]/40 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)]/70 hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)] transition-colors">
                  Get this package
                </a>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="text-sm font-light text-[var(--color-ink)]/65">{pkg.purpose}</p>
                <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                  {pkg.items.slice(0, 6).map((item) => (
                    <li key={item} style={{ fontFamily: "var(--font-inter), sans-serif" }} className="text-xs font-light text-[var(--color-ink)]/55">— {item}</li>
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
