import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";
import { RevealCard } from "@/components/ui/reveal-card";
import type { ServicesPageProps } from "../types";

export function SignatureServicesPage({ pillars }: ServicesPageProps) {
  return (
    <div className="pt-28">
      <section className="py-16 md:py-24 border-b-2 border-[var(--color-ink)] text-center bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4">Services</Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02] mb-4">
            Eight Pillars.
            <br />
            <span className="text-[var(--color-orange)]">Infinite Possibilities.</span>
          </h1>
          <p className="text-[var(--color-gray)] text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            From digital foundations to AI-powered growth — every service is designed to build, automate, and scale your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/packages" size="lg" pop>View Packages</Button>
            <Button href="/get-quote" variant="secondary" size="lg">Get a Free Quote</Button>
          </div>
        </div>
      </section>

      {pillars.map((pillar, i) => {
        const dark = i % 2 === 1;
        return (
          <section
            key={pillar.slug}
            className={`relative py-20 border-b-2 border-[var(--color-ink)] overflow-hidden ${dark ? "bg-[var(--color-ink)]" : "bg-[var(--color-cream)]"}`}
          >
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
              <RevealCard hover={false} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className={`font-display text-5xl font-black block mb-2 ${dark ? "text-[var(--color-cream)]/[0.06]" : "text-[var(--color-ink)]/[0.06]"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className={`font-display text-3xl md:text-4xl font-black tracking-tight mb-3 ${dark ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]"}`}>
                    {pillar.title}
                  </h2>
                  <p className={`text-lg mb-6 ${dark ? "text-[var(--color-cream)]/70" : "text-[var(--color-gray)]"}`}>
                    {pillar.tagline}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {pillar.items.map((item) => (
                      <li key={item} className={`flex items-start gap-3 text-sm ${dark ? "text-[var(--color-cream)]/85" : "text-[var(--color-ink)]/80"}`}>
                        <CheckCircle size={16} className="text-[var(--color-orange)] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${pillar.slug}`}
                    className={`inline-flex items-center gap-2 font-display text-sm font-bold transition-colors group ${dark ? "text-[var(--color-cream)] hover:text-[var(--color-orange)]" : "text-[var(--color-ink)] hover:text-[var(--color-orange)]"}`}
                  >
                    Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="hidden lg:block">
                  <div className={`aspect-square max-w-md mx-auto rounded-2xl border-2 flex items-center justify-center ${dark ? "bg-[var(--color-cream)]/[0.04] border-[var(--color-cream)]/15" : "bg-[var(--color-paper)] border-[var(--color-ink)]/10"}`}>
                    <span className={`font-display text-8xl font-black ${dark ? "text-[var(--color-cream)]/[0.08]" : "text-[var(--color-ink)]/[0.08]"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </RevealCard>
            </div>
          </section>
        );
      })}

      <section className="py-20 text-center bg-[var(--color-cream)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
            Not Sure Where to Start?
          </h2>
          <p className="text-[var(--color-gray)] mb-8">
            Browse our pre-built packages or build your own custom system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/packages" size="lg" pop>Explore Packages</Button>
            <Button href="/get-quote" variant="secondary" size="lg">Talk to Us</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
