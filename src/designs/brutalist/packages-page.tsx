import { CheckCircle, Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders, type LucideIcon } from "lucide-react";
import type { PackagesPageProps } from "../types";

const ICON_MAP: Record<string, LucideIcon> = { Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders };

export function BrutalistPackagesPage({ packages }: PackagesPageProps) {
  return (
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b-4 border-[var(--color-ink)] py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <p className="mb-4 inline-block border-2 border-[var(--color-ink)] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em]">Packages</p>
          <h1 className="font-display text-[clamp(2.2rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter text-[var(--color-ink)]">
            Pre-built systems.
          </h1>
          <p className="mt-4 text-sm font-medium text-[var(--color-ink)]/70">Pick a package engineered for your stage — or build your own.</p>
        </div>
      </section>

      <section className="border-b-4 border-[var(--color-ink)] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="grid gap-0 sm:grid-cols-2">
            {packages.map((pkg, i) => {
              const Icon = ICON_MAP[pkg.icon] || Zap;
              return (
                <div key={pkg.slug} className={`border-2 border-[var(--color-ink)] p-6 ${i % 2 === 1 ? "sm:-ml-0.5" : ""} ${i >= 2 ? "-mt-0.5" : ""}`}>
                  <Icon size={22} className="text-[var(--color-orange)]" />
                  <h2 className="mt-3 font-display text-lg font-black uppercase tracking-tight">{pkg.title}</h2>
                  {pkg.signal && <p className="mt-1 text-xs italic text-[var(--color-ink)]/60">&ldquo;{pkg.signal}&rdquo;</p>}
                  <p className="mt-3 text-xs font-medium text-[var(--color-ink)]/70">{pkg.purpose}</p>
                  <ul className="mt-4 space-y-1.5">
                    {pkg.items.slice(0, 6).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs font-medium text-[var(--color-ink)]/80">
                        <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="/get-quote" className="mt-5 block border-2 border-[var(--color-ink)] py-2.5 text-center font-display text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">
                    Get this package
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-ink)] py-20 text-center text-[var(--color-cream)]">
        <div className="mx-auto max-w-2xl px-4 sm:px-8">
          <h2 className="font-display text-3xl font-black uppercase tracking-tighter sm:text-5xl">Still not sure?</h2>
          <p className="mt-4 text-sm font-medium text-[var(--color-cream)]/60">Tell us what you need and we&apos;ll build the perfect package.</p>
          <a href="/contact" className="mt-8 inline-block border-2 border-[var(--color-orange)] bg-[var(--color-orange)] px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] hover:opacity-90 transition-opacity">
            Talk to us
          </a>
        </div>
      </section>
    </div>
  );
}
