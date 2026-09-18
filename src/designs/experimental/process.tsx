const PROCESS_STEPS = [
  { number: "01", title: "Discovery Call", description: "We learn about your business, goals, and challenges to define the scope.", rotate: "-rotate-1" },
  { number: "02", title: "Strategy Planning", description: "A detailed roadmap with milestones, timelines, and deliverables.", rotate: "rotate-1" },
  { number: "03", title: "Execution", description: "Design, develop, and iterate with regular check-ins and transparent updates.", rotate: "-rotate-1" },
];

export function ExperimentalProcess() {
  return (
    <section className="bg-[var(--color-cream)] px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 text-center font-display text-3xl font-black uppercase tracking-tight text-[var(--color-ink)] sm:text-5xl">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className={`border border-[var(--color-ink)] bg-[var(--color-paper)] p-6 transition-transform hover:rotate-0 ${step.rotate}`}>
              <span className="font-display text-4xl font-black text-[var(--color-orange)]">{step.number}</span>
              <h3 className="mt-3 font-display text-lg font-black uppercase tracking-tight text-[var(--color-ink)]">{step.title}</h3>
              <p className="mt-2 text-sm font-medium text-[var(--color-ink)]/55">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
