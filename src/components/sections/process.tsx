"use client";

const PROCESS_STEPS = [
  { number: "01", title: "Discovery Call", description: "We learn about your business, goals, and challenges to define the scope." },
  { number: "02", title: "Strategy Planning", description: "A detailed roadmap with milestones, timelines, and deliverables." },
  { number: "03", title: "Execution", description: "Design, develop, and iterate with regular check-ins and transparent updates." },
];

export function ProcessSection() {
  return (
    <section id="process" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <div>
        <p className="font-display text-sm font-bold tracking-[0.2em] text-[var(--color-orange)]">
          HOW IT WORKS
        </p>
        <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl">
          No drama. Just delivery.
        </h2>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PROCESS_STEPS.map((step) => (
          <div
            key={step.number}
            className="flex h-full gap-5 rounded-3xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-7 shadow-neo-sm transition-all hover:shadow-neo-md hover:-translate-y-1"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--color-orange)] font-display text-xl font-black text-[var(--color-cream)] shadow-neo-sm">
              {step.number}
            </span>
            <div>
              <h3 className="font-display text-xl font-black tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-ink)]/75">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
