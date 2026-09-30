import { CheckCircle } from "lucide-react";
import type { AboutPageProps } from "../types";
import Image from "next/image";

const whyChooseUs = [
  { title: "Systems, not just websites", desc: "Every project is engineered to grow with you.", rotate: "-rotate-1" },
  { title: "Transparent partnerships", desc: "No hidden fees, no jargon, no surprises.", rotate: "rotate-1" },
  { title: "Results-obsessed", desc: "We measure success by your metrics.", rotate: "-rotate-1" },
  { title: "End-to-end delivery", desc: "Strategy, design, dev, automation, marketing.", rotate: "rotate-1" },
  { title: "AI-first approach", desc: "AI at every layer to automate and accelerate.", rotate: "-rotate-1" },
  { title: "Global standards", desc: "World-class quality at accessible rates.", rotate: "rotate-1" },
];

export function ExperimentalAboutPage({ team }: AboutPageProps) {
  const teamMembers = team.map((m) => ({ ...m, initials: m.name.split(" ").map((n) => n[0]).join("") }));

  return (
    <div className="bg-[var(--color-cream)] pt-28">
      <section className="px-6 py-16 text-center">
        <p className="-rotate-2 mx-auto mb-4 inline-block border border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
          About
        </p>
        <h1 className="font-display text-[clamp(2.2rem,8vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]">
          We build, automate<br /><span className="text-[var(--color-orange)]">&amp; grow.</span>
        </h1>
      </section>

      <section className="border-y border-[var(--color-ink)]/15 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="rotate-1 mb-2 inline-block border border-[var(--color-ink)] px-3 py-0.5 font-display text-xs font-bold uppercase tracking-widest">Founder</p>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">Hey, I&apos;m Niranjan.</h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--color-ink)]/65">
            I started NexScope because I saw too many businesses struggling with fragmented agencies. Today we&apos;ve helped 50+ businesses build their digital foundations. Just getting started.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-3xl font-black uppercase tracking-tight text-[var(--color-ink)] sm:text-5xl">Why us</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className={`border border-[var(--color-ink)] bg-[var(--color-paper)] p-5 transition-transform hover:rotate-0 ${item.rotate}`}>
                <CheckCircle size={16} className="text-[var(--color-orange)]" />
                <h4 className="mt-2 font-display text-sm font-black uppercase text-[var(--color-ink)]">{item.title}</h4>
                <p className="mt-1 text-xs font-medium text-[var(--color-ink)]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-ink)]/15 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-3xl font-black uppercase tracking-tight text-[var(--color-ink)] sm:text-5xl">The team</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {teamMembers.map((member, i) => (
              <div key={member.name} className={`border border-[var(--color-ink)] bg-[var(--color-paper)] p-4 text-center transition-transform hover:rotate-0 ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}>
                {member.image ? (
                  <Image src={member.image} unoptimized alt={member.name} width={56} height={56} className="mx-auto mb-3 h-14 w-14 rounded-full border border-[var(--color-ink)] object-cover" />
                ) : (
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-ink)] bg-[var(--color-orange)] font-display text-sm font-black text-[var(--color-cream)]">
                    {member.initials}
                  </div>
                )}
                <h4 className="font-display text-xs font-black uppercase text-[var(--color-ink)]">{member.name}</h4>
                <p className="mt-0.5 text-[0.65rem] font-bold text-[var(--color-orange)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-ink)]/15 bg-[var(--color-ink)] py-16 text-center text-[var(--color-cream)]">
        <h2 className="font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">Ready to build something great?</h2>
        <a href="/get-quote" className="mt-8 inline-block rotate-1 border border-[var(--color-orange)] bg-[var(--color-orange)] px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] transition-transform hover:rotate-0 hover:scale-105">
          Start a project
        </a>
      </section>
    </div>
  );
}
