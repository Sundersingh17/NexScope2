import { Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders, CheckCircle, type LucideIcon } from "lucide-react";
import type { PackagesPageProps } from "../types";

const ICON_MAP: Record<string, LucideIcon> = { Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders };
const ROTATIONS = ["-rotate-1", "rotate-1"];

export function ExperimentalPackagesPage({ packages }: PackagesPageProps) {
  return (
    <div className="bg-[var(--color-cream)] pt-28">
      <section className="px-6 py-16 text-center">
        <p className="-rotate-2 mx-auto mb-4 inline-block border border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
          Packages
        </p>
        <h1 className="font-display text-[clamp(2.2rem,8vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]">
          Pre-built systems<span className="text-[var(--color-orange)]">.</span>
        </h1>
      </section>

      <section className="border-t border-[var(--color-ink)]/15 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {packages.map((pkg, i) => {
            const Icon = ICON_MAP[pkg.icon] || Zap;
            return (
              <div key={pkg.slug} className={`border border-[var(--color-ink)] bg-[var(--color-paper)] p-6 transition-transform hover:rotate-0 ${ROTATIONS[i % 2]}`}>
                <Icon size={22} className="text-[var(--color-orange)]" />
                <h2 className="mt-3 font-display text-lg font-black uppercase tracking-tight text-[var(--color-ink)]">{pkg.title}</h2>
                {pkg.signal && <p className="mt-1 text-xs font-medium italic text-[var(--color-ink)]/60">&ldquo;{pkg.signal}&rdquo;</p>}
                <ul className="mt-4 space-y-1.5">
                  {pkg.items.slice(0, 6).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs font-medium text-[var(--color-ink)]/70">
                      <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="/get-quote" className="mt-5 inline-block border border-[var(--color-ink)] px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">
                  Get this package
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
