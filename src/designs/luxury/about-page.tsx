import type { AboutPageProps } from "../types";
import Image from "next/image";

const whyChooseUs = [
  { title: "Systems, not just websites", desc: "Every project is engineered to grow with you — from day one to scale-up." },
  { title: "Transparent partnerships", desc: "No hidden fees, no jargon, no surprises." },
  { title: "Results-obsessed", desc: "We measure success by your metrics — leads, revenue, traffic, efficiency." },
  { title: "End-to-end delivery", desc: "Strategy, design, development, automation, marketing — under one roof." },
  { title: "AI-first approach", desc: "We leverage AI at every layer to automate and accelerate outcomes." },
  { title: "Indian roots, global standards", desc: "World-class quality at accessible rates." },
];

export function LuxuryAboutPage({ team }: AboutPageProps) {
  const teamMembers = team.map((m) => ({ ...m, initials: m.name.split(" ").map((n) => n[0]).join("") }));

  return (
    <div className="pt-20">
      <section className="bg-[var(--color-ink)] px-6 py-28 text-center sm:px-10">
        <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/80">About NexScope</p>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mx-auto max-w-3xl text-4xl font-medium leading-tight text-[var(--color-cream)] sm:text-6xl">
          We build, automate <span className="italic text-[var(--color-yellow)]">&amp; grow</span>
        </h1>
        <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-[var(--color-cream)]/60">
          NexScope was born from a simple belief: every business deserves world-class digital solutions, without the agency markup or corporate complexity.
        </p>
      </section>

      <section className="bg-[var(--color-cream)] px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-[1fr_2fr] sm:items-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[var(--color-ink)]/15" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            <span className="text-3xl italic text-[var(--color-ink)]/60">NE</span>
          </div>
          <div>
            <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[var(--color-ink)]/60">Founder</p>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-2xl font-medium text-[var(--color-ink)] sm:text-3xl">
              Hey, I&apos;m Niranjan.
            </h2>
            <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-3 text-sm font-light leading-relaxed text-[var(--color-ink)]/60">
              I started NexScope because I saw too many businesses struggling with fragmented agencies — one for design, another for development, a third for marketing. Today we&apos;ve helped 50+ businesses build their digital foundations. Just getting started.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-ink)] px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/70">Why Us</p>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-14 text-center text-3xl font-medium text-[var(--color-cream)] sm:text-4xl">
            Six reasons clients stay
          </h2>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {whyChooseUs.map((item) => (
              <div key={item.title}>
                <h4 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-lg font-medium text-[var(--color-cream)]">{item.title}</h4>
                <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-1.5 text-sm font-light text-[var(--color-cream)]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-ink)]/60">Our Team</p>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-14 text-center text-3xl font-medium text-[var(--color-ink)] sm:text-4xl">
            The people behind it
          </h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                {member.image ? (
                  <Image src={member.image} unoptimized alt={member.name} width={64} height={64} className="mx-auto mb-3 h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div style={{ fontFamily: "var(--font-fraunces), serif" }} className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-lg italic text-[var(--color-ink)]/60">
                    {member.initials}
                  </div>
                )}
                <h4 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-sm font-medium text-[var(--color-ink)]">{member.name}</h4>
                <p className="mt-0.5 text-[0.65rem] uppercase tracking-widest text-[var(--color-yellow)]/80">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-ink)] px-6 py-24 text-center sm:px-10">
        <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-3xl font-medium text-[var(--color-cream)] sm:text-4xl">
          Ready to build something great?
        </h2>
        <a href="/get-quote" className="mt-8 inline-block border-b border-[var(--color-yellow)] pb-1 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-yellow)] hover:text-[var(--color-cream)] hover:border-[var(--color-cream)] transition-colors">
          Start a project
        </a>
      </section>
    </div>
  );
}
