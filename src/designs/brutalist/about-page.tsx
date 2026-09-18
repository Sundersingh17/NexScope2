import { CheckCircle } from "lucide-react";
import type { AboutPageProps } from "../types";

const whyChooseUs = [
  { title: "We Build Systems, Not Just Websites", desc: "Every project is engineered to grow with you — from day one to scale-up." },
  { title: "Transparent Partnerships", desc: "No hidden fees, no jargon, no surprises. You'll always know exactly what's happening." },
  { title: "Results-Obsessed", desc: "We measure success by your metrics — leads, revenue, traffic, efficiency." },
  { title: "End-to-End Delivery", desc: "Strategy, design, development, automation, marketing — all under one roof." },
  { title: "AI-First Approach", desc: "We leverage AI at every layer to automate, optimize, and accelerate outcomes." },
  { title: "Indian Roots, Global Standards", desc: "Based in India, delivering world-class quality at accessible rates." },
];

export function BrutalistAboutPage({ team }: AboutPageProps) {
  const teamMembers = team.map((m) => ({ ...m, initials: m.name.split(" ").map((n) => n[0]).join("") }));

  return (
    <div className="pt-16">
      <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <p className="mb-4 inline-block border-2 border-[var(--color-ink)] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em]">About Us</p>
          <h1 className="font-display text-[clamp(2.2rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter text-[var(--color-ink)]">
            We build.<br />We automate.<br /><span className="text-[var(--color-orange)]">We grow.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-medium leading-relaxed text-[var(--color-ink)]/70">
            NexScope was born from a simple belief: every business deserves world-class digital solutions, without the agency markup or corporate complexity. We combine strategy, design, and engineering to deliver measurable outcomes — not just deliverables.
          </p>
        </div>
      </section>

      <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-ink)] py-20 text-[var(--color-cream)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <span className="border-2 border-[var(--color-cream)] px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-widest">Founder</span>
          <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Hey, I&apos;m Niranjan.
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-[var(--color-cream)]/70">
            I started NexScope because I saw too many businesses struggling with fragmented agencies — one for design, another for development, a third for marketing. The result: inconsistent brands, broken systems, wasted budgets. Today we&apos;ve helped 50+ businesses build their digital foundations, automate operations, and scale growth. Just getting started.
          </p>
        </div>
      </section>

      <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-paper)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <h2 className="mb-10 font-display text-4xl font-black uppercase tracking-tighter sm:text-5xl">Why us</h2>
          <div className="grid gap-0 sm:grid-cols-2">
            {whyChooseUs.map((item, i) => (
              <div key={item.title} className={`flex items-start gap-3 border-t-2 border-[var(--color-ink)] py-5 pr-6 ${i % 2 === 0 ? "sm:border-r-2" : ""}`}>
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                <div>
                  <h4 className="font-display text-sm font-black uppercase tracking-tight">{item.title}</h4>
                  <p className="mt-1 text-xs font-medium text-[var(--color-ink)]/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <h2 className="mb-10 font-display text-4xl font-black uppercase tracking-tighter sm:text-5xl">The team</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="border-2 border-[var(--color-ink)] p-4 text-center">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="mx-auto mb-3 h-14 w-14 border-2 border-[var(--color-ink)] object-cover" />
                ) : (
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-orange)] font-display text-sm font-black text-[var(--color-cream)]">
                    {member.initials}
                  </div>
                )}
                <h4 className="font-display text-xs font-black uppercase">{member.name}</h4>
                <p className="mt-0.5 text-[0.65rem] font-bold text-[var(--color-orange)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-ink)] py-20 text-center text-[var(--color-cream)]">
        <div className="mx-auto max-w-2xl px-4 sm:px-8">
          <h2 className="font-display text-3xl font-black uppercase tracking-tighter sm:text-5xl">Let&apos;s build.</h2>
          <p className="mt-4 text-sm font-medium text-[var(--color-cream)]/60">No pressure, no sales pitch — just a conversation about how we can help.</p>
          <a href="/get-quote" className="mt-8 inline-block border-2 border-[var(--color-orange)] bg-[var(--color-orange)] px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] hover:bg-transparent hover:text-[var(--color-orange)] transition-colors">
            Start a project
          </a>
        </div>
      </section>
    </div>
  );
}
