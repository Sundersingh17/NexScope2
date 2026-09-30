import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Quote } from "lucide-react";
import type { AboutPageProps } from "../types";
import Image from "next/image";

const whyChooseUs = [
  { title: "We Build Systems, Not Just Websites", desc: "Every project is engineered to grow with you — from day one to scale-up." },
  { title: "Transparent Partnerships", desc: "No hidden fees, no jargon, no surprises. You'll always know exactly what's happening." },
  { title: "Results-Obsessed", desc: "We measure success by your metrics — leads, revenue, traffic, efficiency." },
  { title: "End-to-End Delivery", desc: "Strategy, design, development, automation, marketing — all under one roof." },
  { title: "AI-First Approach", desc: "We leverage AI at every layer to automate, optimize, and accelerate outcomes." },
  { title: "Indian Roots, Global Standards", desc: "Based in India, delivering world-class quality at accessible rates." },
];

export function SignatureAboutPage({ team }: AboutPageProps) {
  const teamMembers = team.map((m) => ({ ...m, initials: m.name.split(" ").map((n) => n[0]).join("") }));

  return (
    <div className="pt-28">
      <section id="story" className="py-20 md:py-28 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4">About Us</Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02] mb-6 text-[var(--color-ink)]">
            We Build, Automate & Grow
          </h1>
          <p className="text-lg text-[var(--color-gray)] max-w-3xl leading-relaxed">
            NexScope was born from a simple belief: every business deserves access to world-class digital solutions,
            without the agency markup or corporate complexity. We combine strategy, design, and engineering to
            deliver measurable outcomes — not just deliverables.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/get-quote" pop>Start a Project</Button>
            <Button href="/portfolio" variant="secondary">View Our Work</Button>
          </div>
        </div>
      </section>

      <section id="founder" className="py-20 bg-[var(--color-ink)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="aspect-square max-w-xs mx-auto lg:mx-0 rounded-2xl border-2 border-[var(--color-cream)]/15 bg-[var(--color-cream)]/[0.04] flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-orange)] flex items-center justify-center font-display text-4xl font-black text-[var(--color-cream)]">
                  NE
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <Badge dark className="mb-3">Founder</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-4 text-[var(--color-cream)]">
                Hey, I&apos;m Niranjan — The Founder
              </h2>
              <p className="text-[var(--color-cream)]/70 leading-relaxed mb-4">
                I started NexScope because I saw too many businesses struggling with fragmented agencies —
                one agency for design, another for development, a third for marketing. The result? Inconsistent
                brands, broken systems, and wasted budgets.
              </p>
              <p className="text-[var(--color-cream)]/70 leading-relaxed mb-4">
                I believed there was a better way: a single team that could handle everything — from strategy
                to execution to automation — with full ownership and accountability.
              </p>
              <p className="text-[var(--color-cream)]/70 leading-relaxed">
                Today, we&apos;ve helped 50+ businesses build their digital foundations, automate their operations,
                and scale their growth. And we&apos;re just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <Badge className="mb-3">Our Mission</Badge>
              <h2 className="font-display text-2xl font-black tracking-tight mb-4 text-[var(--color-ink)]">Making World-Class Digital Accessible</h2>
              <p className="text-[var(--color-gray)] leading-relaxed">
                We believe great digital solutions shouldn&apos;t be reserved for enterprises with giant budgets.
                Our mission is to democratize AI, design, and growth — making them accessible to every
                ambitious business, regardless of size.
              </p>
            </div>
            <div>
              <Badge className="mb-3">Our Approach</Badge>
              <h2 className="font-display text-2xl font-black tracking-tight mb-4 text-[var(--color-ink)]">Listen. Strategize. Execute. Optimize.</h2>
              <p className="text-[var(--color-gray)] leading-relaxed">
                Every engagement starts with listening. We map your goals, craft a strategy,
                execute with precision, and support you long after launch. Your success is our metric.
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <Badge className="mb-3">Why Choose Us</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
              Six Reasons Clients Trust Us
            </h2>
            <p className="text-[var(--color-gray)] max-w-2xl mx-auto">
              We don&apos;t just deliver projects — we build lasting partnerships.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 shadow-neo-sm transition-shadow hover:shadow-neo-md">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold mb-1 text-sm text-[var(--color-ink)]">{item.title}</h4>
                    <p className="text-xs text-[var(--color-gray)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="py-20 bg-[var(--color-paper)] border-y-2 border-[var(--color-ink)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-3">Our Team</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
              The People Behind the Work
            </h2>
            <p className="text-[var(--color-gray)] max-w-2xl mx-auto">
              A small, focused team with big ambitions. We hire for attitude, skill, and obsession with quality.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member) => (
              <div key={member.name} className="rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-6 text-center shadow-neo-sm transition-shadow hover:shadow-neo-md group">
                {member.image ? (
                  <Image src={member.image} unoptimized alt={member.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-[var(--color-ink)] group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-orange)] flex items-center justify-center font-display text-lg font-black text-[var(--color-cream)] mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.initials}
                  </div>
                )}
                <h4 className="font-display font-bold mb-0.5 text-[var(--color-ink)]">{member.name}</h4>
                <p className="text-xs text-[var(--color-orange)] font-bold mb-3">{member.role}</p>
                <p className="text-xs text-[var(--color-gray)] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-ink)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Quote size={32} className="text-[var(--color-cream)]/60 mx-auto mb-6" />
          <blockquote className="text-xl md:text-2xl text-[var(--color-cream)]/90 leading-relaxed mb-8 max-w-3xl mx-auto">
            &ldquo;Working with NexScope on our brand identity was a revelation. They didn&apos;t just design a
            logo — they built a complete brand system that we use across every touchpoint.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--color-cream)]/20 bg-[var(--color-orange)] flex items-center justify-center text-sm font-bold text-[var(--color-cream)]">
              AM
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--color-cream)]">Arjun Mehta</p>
              <p className="text-xs text-[var(--color-cream)]/60">Founder, Elevate Brands</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-center bg-[var(--color-cream)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
            Ready to Build Something Great?
          </h2>
          <p className="text-[var(--color-gray)] mb-8 max-w-2xl mx-auto">
            Let&apos;s talk about your project. No pressure, no sales pitch — just a conversation about how we can help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/get-quote" size="lg" pop>Start a Project</Button>
            <Button href="/contact" variant="secondary" size="lg">Get in Touch</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
