import { CheckCircle } from "lucide-react";
import type { AboutPageProps } from "../types";
import Image from "next/image";

const whyChooseUs = [
  { title: "Systems, not just websites", desc: "Every project is engineered to grow with you." },
  { title: "Transparent partnerships", desc: "No hidden fees, no jargon, no surprises." },
  { title: "Results-obsessed", desc: "We measure success by your metrics." },
  { title: "End-to-end delivery", desc: "Strategy, design, dev, automation, marketing." },
  { title: "AI-first approach", desc: "AI at every layer to automate and accelerate." },
  { title: "Global standards", desc: "World-class quality at accessible rates." },
];

export function FuturisticAboutPage({ team }: AboutPageProps) {
  const teamMembers = team.map((m) => ({ ...m, initials: m.name.split(" ").map((n) => n[0]).join("") }));

  return (
    <div className="bg-[var(--color-ink)] pt-24">
      <section className="relative overflow-hidden px-4 py-20 text-center">
        <div className="nx-futuristic-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">
            About NexScope
          </p>
          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight text-[var(--color-cream)]">
            We build, automate & grow
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-relaxed text-[var(--color-cream)]/60">
            NexScope was born from a simple belief: every business deserves world-class digital solutions, without the agency markup.
          </p>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-8 backdrop-blur-sm sm:p-10">
          <p className="mb-2 text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-orange)]">Founder</p>
          <h2 className="font-display text-2xl font-bold text-[var(--color-cream)]">Hey, I&apos;m Niranjan.</h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-[var(--color-cream)]/60">
            I started NexScope because I saw too many businesses struggling with fragmented agencies. Today we&apos;ve helped 50+ businesses build their digital foundations, automate operations, and scale growth.
          </p>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-[var(--color-cream)] sm:text-4xl">Why us</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-5 backdrop-blur-sm">
                <CheckCircle size={18} className="text-[var(--color-orange)]" />
                <h4 className="mt-3 font-display text-sm font-bold text-[var(--color-cream)]">{item.title}</h4>
                <p className="mt-1 text-xs font-light text-[var(--color-cream)]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-[var(--color-cream)] sm:text-4xl">The team</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-5 text-center backdrop-blur-sm">
                {member.image ? (
                  <Image src={member.image} unoptimized alt={member.name} width={56} height={56} className="mx-auto mb-3 h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-yellow)] font-display text-sm font-bold text-[var(--color-ink)]">
                    {member.initials}
                  </div>
                )}
                <h4 className="font-display text-xs font-bold text-[var(--color-cream)]">{member.name}</h4>
                <p className="mt-0.5 text-[0.6rem] font-bold text-[var(--color-orange)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-[var(--color-cream)] sm:text-3xl">Ready to build something great?</h2>
        <a href="/get-quote" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-yellow)] px-6 py-3 text-sm font-bold text-[var(--color-ink)] shadow-[0_0_25px_-6px_var(--color-orange)] hover:shadow-[0_0_35px_-4px_var(--color-orange)] transition-shadow">
          Start a project <span aria-hidden="true">&rarr;</span>
        </a>
      </section>
    </div>
  );
}
