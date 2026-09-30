import { Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders, CheckCircle, type LucideIcon } from "lucide-react";
import type { PackagesPageProps } from "../types";

const ICON_MAP: Record<string, LucideIcon> = { Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders };

export function FuturisticPackagesPage({ packages }: PackagesPageProps) {
  return (
    <div className="bg-[var(--color-ink)] pt-24">
      <section className="relative overflow-hidden px-4 py-16 text-center">
        <div className="nx-futuristic-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-xl">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">Packages</p>
          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold text-[var(--color-cream)]">Pre-built growth systems</h1>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2">
          {packages.map((pkg) => {
            const Icon = ICON_MAP[pkg.icon] || Zap;
            return (
              <div key={pkg.slug} className="rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-6 backdrop-blur-sm transition-all hover:border-[var(--color-orange)]/40">
                <Icon size={20} className="text-[var(--color-orange)]" />
                <h2 className="mt-3 font-display text-lg font-bold text-[var(--color-cream)]">{pkg.title}</h2>
                {pkg.signal && <p className="mt-1 text-xs italic text-[var(--color-cream)]/60">&ldquo;{pkg.signal}&rdquo;</p>}
                <p className="mt-3 text-xs font-light text-[var(--color-cream)]/60">{pkg.purpose}</p>
                <ul className="mt-4 space-y-1.5">
                  {pkg.items.slice(0, 5).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[0.7rem] font-light text-[var(--color-cream)]/60">
                      <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="/get-quote" className="mt-4 inline-block text-xs font-bold text-[var(--color-orange)] hover:text-[var(--color-yellow)] transition-colors">
                  Get this package &rarr;
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
