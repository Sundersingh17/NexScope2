// Same three steps/copy as Signature's ProcessSection, laid out as a single
// bold vertical sequence with oversized numbers instead of a 3-up card grid.
const PROCESS_STEPS = [
  { number: "01", title: "Discovery Call", description: "We learn about your business, goals, and challenges to define the scope." },
  { number: "02", title: "Strategy Planning", description: "A detailed roadmap with milestones, timelines, and deliverables." },
  { number: "03", title: "Execution", description: "Design, develop, and iterate with regular check-ins and transparent updates." },
];

export function BrutalistProcess() {
  return (
    <section id="process" className="border-b-4 border-[var(--color-ink)] bg-[var(--color-paper)] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <h2 className="mb-10 font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          How it works
        </h2>
        <div className="grid gap-0 sm:grid-cols-3">
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`border-t-2 border-[var(--color-ink)] py-6 pr-6 sm:border-t-0 sm:border-l-2 sm:pl-6 sm:pt-0 ${i === 0 ? "sm:border-l-0" : ""}`}
            >
              <span className="block font-display text-6xl font-black text-[var(--color-orange)] sm:text-8xl">{step.number}</span>
              <h3 className="mt-3 font-display text-xl font-black uppercase tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-ink)]/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
