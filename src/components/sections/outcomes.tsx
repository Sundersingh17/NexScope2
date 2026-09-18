import { ArrowUpRight, Bot, Compass, LayoutTemplate, LineChart } from "lucide-react";

const OUTCOMES = [
  { icon: Compass, index: "01", label: "Positioning", shift: "From hard to explain", result: "To a brand people understand and remember." },
  { icon: LayoutTemplate, index: "02", label: "Digital presence", shift: "From looking behind", result: "To a platform that earns trust before the first call." },
  { icon: LineChart, index: "03", label: "Growth", shift: "From random activity", result: "To a measurable system around the right audience and offer." },
  { icon: Bot, index: "04", label: "Operations", shift: "From repetitive work", result: "To connected workflows that create room to scale." },
];

export function OutcomesSection() {
  return (
    <section className="border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)] py-20 text-[var(--color-cream)] sm:py-28" id="outcomes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-yellow)]">The shift we create</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl">Less noise. More momentum.</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--color-cream)]/65">Every engagement is designed to leave the business clearer, more capable, and easier to grow than we found it.</p>
        </div>

        <div className="mt-12 grid border-2 border-[var(--color-cream)]/20 sm:grid-cols-2">
          {OUTCOMES.map((outcome, index) => (
            <article key={outcome.label} className={`group p-6 transition-colors hover:bg-[var(--color-cream)]/[0.06] sm:p-8 ${index < 2 ? "border-b-2 border-[var(--color-cream)]/20" : ""} ${index % 2 === 0 ? "sm:border-r-2" : ""}`}>
              <div className="flex items-start justify-between gap-4"><div className="grid size-11 place-items-center border-2 border-[var(--color-yellow)] text-[var(--color-yellow)]"><outcome.icon size={20} /></div><span className="font-display text-xs font-bold text-[var(--color-cream)]/35">{outcome.index}</span></div>
              <p className="mt-8 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-orange)]">{outcome.label}</p>
              <h3 className="mt-2 font-display text-2xl font-black uppercase leading-tight sm:text-3xl">{outcome.shift}</h3>
              <div className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-[var(--color-cream)]/65"><ArrowUpRight className="mt-0.5 size-4 shrink-0 text-[var(--color-yellow)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />{outcome.result}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
