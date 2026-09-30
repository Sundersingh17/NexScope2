"use client";

import { useState } from "react";
import { ArrowRight, Bot, ChartNoAxesCombined, Palette, Rocket, Sparkles } from "lucide-react";

const PATHS = [
  {
    id: "launch",
    icon: Rocket,
    goal: "Launch something new",
    service: "Digital Foundations",
    description: "A sharp website or product foundation that makes your next launch feel credible from day one.",
    href: "/services/digital-foundations",
  },
  {
    id: "brand",
    icon: Palette,
    goal: "Make the brand feel premium",
    service: "Brand & Experience Design",
    description: "A clear identity system and digital experience your team can use consistently everywhere.",
    href: "/services/brand-experience",
  },
  {
    id: "growth",
    icon: ChartNoAxesCombined,
    goal: "Generate more qualified demand",
    service: "Growth & Marketing Engine",
    description: "A measurable growth system built around the right audience, offer, funnel, and feedback loop.",
    href: "/services/growth-marketing",
  },
  {
    id: "automate",
    icon: Bot,
    goal: "Remove repetitive work",
    service: "Automation & Business Systems",
    description: "Connected workflows that give your team back time and make operations easier to scale.",
    href: "/services/automation-systems",
  },
];

export function ServiceExplorer() {
  const [selected, setSelected] = useState(PATHS[0]);

  return (
    <section className="border-y-2 border-[var(--color-ink)] bg-[var(--color-yellow)] py-20 sm:py-28" id="find-your-path">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-orange)]">Not sure where to start?</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl">Start with the outcome.</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--color-ink)]/65">Choose the result you want. We&apos;ll point you toward the service that creates the strongest foundation for it.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {PATHS.map((path) => {
              const active = selected.id === path.id;
              return (
                <button key={path.id} type="button" onClick={() => setSelected(path)} className={`flex items-center gap-3 border-2 border-[var(--color-ink)] p-4 text-left transition-transform hover:-translate-y-1 ${active ? "bg-[var(--color-ink)] text-[var(--color-cream)] shadow-[4px_4px_0_0_#ff4d00]" : "bg-[var(--color-paper)] text-[var(--color-ink)]"}`}>
                  <path.icon className={`size-5 shrink-0 ${active ? "text-[var(--color-yellow)]" : "text-[var(--color-orange)]"}`} />
                  <span className="font-display text-sm font-bold">{path.goal}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 shadow-[6px_6px_0_0_#141414] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-orange)]"><Sparkles className="size-4" /> Recommended path</div>
            <h3 className="mt-3 font-display text-2xl font-black uppercase sm:text-4xl">{selected.service}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-gray)]">{selected.description}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a href={selected.href} className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] px-5 py-3 text-xs font-bold text-[var(--color-ink)] hover:bg-[var(--color-yellow)]">Explore service <ArrowRight className="size-4" /></a>
            <a href={`/get-quote?service=${selected.id}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-xs font-bold text-[var(--color-cream)] shadow-[4px_4px_0_0_#ff4d00]">Talk to us <ArrowRight className="size-4" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
