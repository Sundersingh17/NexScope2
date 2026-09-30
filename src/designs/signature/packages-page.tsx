import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders, ArrowRight, type LucideIcon } from "lucide-react";
import { RevealCard } from "@/components/ui/reveal-card";
import type { PackagesPageProps } from "../types";

const ICON_MAP: Record<string, LucideIcon> = { Zap, TrendingUp, Cpu, Palette, Users, Box, LayoutGrid, Sliders };

export function SignaturePackagesPage({ packages }: PackagesPageProps) {
  return (
    <div className="pt-28">
      <section className="py-16 md:py-24 border-b-2 border-[var(--color-ink)] text-center bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4">Packages</Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02] mb-4 text-[var(--color-ink)]">
            Pre-Built Growth Systems
          </h1>
          <p className="text-[var(--color-gray)] text-lg max-w-3xl mx-auto leading-relaxed">
            Not sure where to start? Pick a package engineered for your stage — or build your own. Every package is designed to deliver real outcomes, not just deliverables.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg, i) => {
              const Icon = ICON_MAP[pkg.icon] || Zap;
              return (
                <RevealCard key={pkg.slug} delay={i * 0.08} className="group relative rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-8 shadow-neo-md transition-shadow hover:shadow-neo-lg overflow-hidden">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 shrink-0 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-orange)] flex items-center justify-center">
                      <Icon size={20} className="text-[var(--color-cream)]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display text-xl font-black tracking-tight mb-1 text-[var(--color-ink)]">{pkg.title}</h2>
                      {pkg.signal && <p className="text-sm text-[var(--color-gray)] italic">&ldquo;{pkg.signal}&rdquo;</p>}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-ink)]/75 mb-4">
                    <span className="font-bold text-[var(--color-ink)]">Purpose:</span> {pkg.purpose}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {pkg.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[var(--color-ink)]/80">
                        <CheckCircle size={14} className="text-[var(--color-orange)] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2 mb-6 pt-4 border-t-2 border-[var(--color-ink)]/10">
                    {pkg.forWhom && (
                      <p className="text-xs text-[var(--color-gray)]"><span className="font-bold text-[var(--color-ink)]/70">Who It&apos;s For:</span> {pkg.forWhom}</p>
                    )}
                    {pkg.outcome && (
                      <p className="text-xs text-[var(--color-gray)]"><span className="font-bold text-[var(--color-orange)]">Outcome:</span> {pkg.outcome}</p>
                    )}
                  </div>
                  <Button href="/get-quote" size="sm" pop className="w-full justify-center">
                    Get This Package <ArrowRight size={14} />
                  </Button>
                </RevealCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 text-center bg-[var(--color-ink)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-cream)]">Still Not Sure?</h2>
          <p className="text-[var(--color-cream)]/70 mb-8">Every business is different. Tell us what you need and we&apos;ll build the perfect package — no templates, no fluff.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/contact" size="lg" pop>Talk to Us</Button>
            <Button href="/services" variant="secondary" dark size="lg">Explore Services First</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
