const PROCESS_STEPS = [
  { number: "01", title: "Discovery Call", description: "We learn about your business, goals, and challenges to define the scope." },
  { number: "02", title: "Strategy Planning", description: "A detailed roadmap with milestones, timelines, and deliverables." },
  { number: "03", title: "Execution", description: "Design, develop, and iterate with regular check-ins and transparent updates." },
];

export function SwissProcess() {
  return (
    <section className="border-b border-[var(--color-ink)]/15 bg-[var(--color-cream)] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          How it works
        </h2>
        <div className="grid gap-10 sm:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="border-t border-[var(--color-ink)] pt-4 text-center">
              <span className="text-xs font-medium text-[var(--color-ink)]/60">{step.number}</span>
              <h3 className="mt-2 text-sm font-bold text-[var(--color-ink)]">{step.title}</h3>
              <p className="mt-1.5 text-xs font-light leading-relaxed text-[var(--color-ink)]/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
