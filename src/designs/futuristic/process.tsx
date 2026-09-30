const PROCESS_STEPS = [
  { number: "01", title: "Discovery Call", description: "We learn about your business, goals, and challenges to define the scope." },
  { number: "02", title: "Strategy Planning", description: "A detailed roadmap with milestones, timelines, and deliverables." },
  { number: "03", title: "Execution", description: "Design, develop, and iterate with regular check-ins and transparent updates." },
];

export function FuturisticProcess() {
  return (
    <section className="bg-[var(--color-ink)] px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">The Process</p>
        <h2 className="mb-16 text-center font-display text-3xl font-bold text-[var(--color-cream)] sm:text-5xl">
          How it works
        </h2>
        <div className="relative grid gap-8 sm:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[var(--color-orange)]/40 to-transparent sm:block" aria-hidden="true" />
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="relative text-center">
              <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-orange)]/40 bg-[var(--color-ink)] font-display text-sm font-bold text-[var(--color-orange)] shadow-[0_0_20px_-4px_var(--color-orange)]">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-[var(--color-cream)]">{step.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-[var(--color-cream)]/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
