import { Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders, CheckCircle, type LucideIcon } from "lucide-react";
import type { PackagesPageProps } from "../types";

const ICON_MAP: Record<string, LucideIcon> = { Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders };

export function SwissPackagesPage({ packages }: PackagesPageProps) {
  return (
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b border-[var(--color-ink)]/15 px-6 py-24 text-center sm:px-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-ink)]/40">Packages</p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Pre-built growth systems
        </h1>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-4xl divide-y divide-[var(--color-ink)]/10">
          {packages.map((pkg) => {
            const Icon = ICON_MAP[pkg.icon] || Zap;
            return (
              <div key={pkg.slug} className="grid gap-6 py-10 sm:grid-cols-[1fr_2fr]">
                <div>
                  <Icon size={20} className="text-[var(--color-ink)]/50" />
                  <h2 className="mt-2 text-lg font-bold text-[var(--color-ink)]">{pkg.title}</h2>
                  {pkg.signal && <p className="mt-1 text-xs font-light italic text-[var(--color-ink)]/45">&ldquo;{pkg.signal}&rdquo;</p>}
                  <a href="/get-quote" className="mt-4 inline-block border-b border-[var(--color-ink)]/40 pb-0.5 text-xs font-medium uppercase tracking-wider text-[var(--color-ink)]/70 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors">
                    Get this package
                  </a>
                </div>
                <div>
                  <p className="text-sm font-light text-[var(--color-ink)]/60">{pkg.purpose}</p>
                  <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                    {pkg.items.slice(0, 6).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs font-light text-[var(--color-ink)]/50">
                        <CheckCircle size={11} className="mt-0.5 shrink-0 text-[var(--color-ink)]/35" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
