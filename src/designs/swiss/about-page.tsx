import { CheckCircle } from "lucide-react";
import type { AboutPageProps } from "../types";

const whyChooseUs = [
  { title: "Systems, not just websites", desc: "Every project is engineered to grow with you." },
  { title: "Transparent partnerships", desc: "No hidden fees, no jargon, no surprises." },
  { title: "Results-obsessed", desc: "We measure success by your metrics." },
  { title: "End-to-end delivery", desc: "Strategy, design, dev, automation, marketing." },
  { title: "AI-first approach", desc: "AI at every layer to automate and accelerate." },
  { title: "Global standards", desc: "World-class quality at accessible rates." },
];

export function SwissAboutPage({ team }: AboutPageProps) {
  const teamMembers = team.map((m) => ({ ...m, initials: m.name.split(" ").map((n) => n[0]).join("") }));

  return (
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b border-[var(--color-ink)]/15 px-6 py-24 text-center sm:px-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-ink)]/40">About</p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          We build, automate & grow
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-[var(--color-ink)]/55">
          NexScope was born from a simple belief: every business deserves world-class digital solutions.
        </p>
      </section>

      <section className="border-b border-[var(--color-ink)]/15 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)]/40">Founder</p>
          <h2 className="text-2xl font-bold text-[var(--color-ink)]">Hey, I&apos;m Niranjan.</h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-[var(--color-ink)]/60">
            I started NexScope because I saw too many businesses struggling with fragmented agencies. Today we&apos;ve helped 50+ businesses build their digital foundations.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--color-ink)]/15 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">Why us</h2>
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="border-t border-[var(--color-ink)] pt-4">
                <CheckCircle size={16} className="text-[var(--color-ink)]/50" />
                <h4 className="mt-2 text-sm font-bold text-[var(--color-ink)]">{item.title}</h4>
                <p className="mt-1 text-xs font-light text-[var(--color-ink)]/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">The team</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="border-t border-[var(--color-ink)] pt-4 text-center">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="mx-auto mb-3 h-14 w-14 object-cover grayscale" />
                ) : (
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center bg-[var(--color-ink)] text-sm font-bold text-[var(--color-cream)]">
                    {member.initials}
                  </div>
                )}
                <h4 className="text-xs font-bold text-[var(--color-ink)]">{member.name}</h4>
                <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-[var(--color-ink)]/40">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-ink)]/15 px-6 py-20 text-center sm:px-10">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">Ready to build something great?</h2>
        <a href="/get-quote" className="mt-8 inline-block border border-[var(--color-ink)] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">
          Start a project
        </a>
      </section>
    </div>
  );
}
