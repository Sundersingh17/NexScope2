"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScratchCard } from "@/components/ui/scratch-card";
import { SparkIcon } from "@/components/icons/spark-icon";
import {
  Building2, Palette, TrendingUp, Cpu, ClipboardCheck, Box, Sparkles, Rocket,
} from "lucide-react";

const services = [
  { icon: Building2, title: "Digital Foundations", description: "Websites, apps, hosting & the full digital infrastructure your brand needs.", href: "/services/digital-foundations" },
  { icon: Palette, title: "Brand & Experience Design", description: "Logo systems, brand strategy, UX/UI that makes your brand look intentional.", href: "/services/brand-experience" },
  { icon: TrendingUp, title: "Growth & Marketing Engine", description: "SEO, paid media, funnels & analytics — a measurable growth system.", href: "/services/growth-marketing" },
  { icon: Cpu, title: "Automation & Business Systems", description: "Workflow automation & integrations that run your operations 24/7.", href: "/services/automation-systems" },
  { icon: ClipboardCheck, title: "Operations & Digital Consulting", description: "Process audits & transformation roadmaps to fix the internal mess.", href: "/services/ops-consulting" },
  { icon: Box, title: "Custom Product Builds", description: "SaaS MVPs, dashboards & platforms — build what doesn't exist yet.", href: "/services/custom-product-builds" },
  { icon: Sparkles, title: "Next-Gen AI Services", description: "AI chatbots, predictive analytics & tools that give a genuine edge.", href: "/services/next-gen-services" },
  { icon: Rocket, title: "'Done-For-You' Scale Suite", description: "Brand, website, CRM & campaigns in one system. We run the machine.", href: "/services/done-for-you" },
];

export function ServicesSection() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="bg-[var(--color-cream)] py-20 sm:py-28" id="services">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 sm:mb-14">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-orange)]">
            Three things. Done right.
          </span>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
            What We Do
          </h2>
        </div>

        {/* Scratch-to-reveal card — the whole services grid sits behind
            this until scratched. A visible "Reveal" button is provided
            alongside it for keyboard/accessibility, since dragging a
            canvas isn't operable without a pointer. */}
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-[7px_7px_0_0_#141414] sm:min-h-[460px]">
          <div className="grid grid-cols-1 gap-px bg-[var(--color-ink)]/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <motion.a
                key={service.title}
                href={service.href}
                initial={{ opacity: 0, y: 20 }}
                animate={revealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: revealed ? i * 0.06 : 0 }}
                className="group flex flex-col gap-4 bg-[var(--color-paper)] p-6 transition-colors hover:bg-[var(--color-cream)] sm:p-7"
              >
                <span className="font-display text-xs font-bold text-[var(--color-orange)]">
                  0{i + 1}
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)]">
                  <service.icon size={20} className="text-[var(--color-ink)]" />
                </div>
                <h3 className="font-display text-base font-bold leading-tight">{service.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--color-gray)]">{service.description}</p>
              </motion.a>
            ))}
          </div>

          {!revealed && <ScratchCard onDone={() => setRevealed(true)} />}
        </div>

        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="mx-auto mt-4 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60 underline decoration-dotted underline-offset-4 hover:text-[var(--color-ink)]"
          >
            <SparkIcon className="size-3 text-[var(--color-orange)]" />
            Can't scratch? Tap to reveal instantly
          </button>
        )}
      </div>
    </section>
  );
}
