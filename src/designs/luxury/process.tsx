const PROCESS_STEPS = [
  { roman: "I", title: "Discovery Call", description: "We learn about your business, goals, and challenges to define the scope." },
  { roman: "II", title: "Strategy Planning", description: "A detailed roadmap with milestones, timelines, and deliverables." },
  { roman: "III", title: "Execution", description: "Design, develop, and iterate with regular check-ins and transparent updates." },
];

export function LuxuryProcess() {
  return (
    <section className="bg-[var(--color-ink)] px-6 py-24 text-[var(--color-cream)] sm:px-10 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/70">The Process</p>
        <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-16 text-4xl font-medium sm:text-5xl">
          How we work together
        </h2>
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
          {PROCESS_STEPS.map((step) => (
            <div key={step.roman}>
              <span style={{ fontFamily: "var(--font-fraunces), serif" }} className="block text-3xl italic text-[var(--color-yellow)]/60">{step.roman}</span>
              <h3 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mt-3 text-xl font-medium">{step.title}</h3>
              <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-2 text-sm font-light leading-relaxed text-[var(--color-cream)]/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
