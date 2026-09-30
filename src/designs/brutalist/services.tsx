"use client";

import {
  Building2, Palette, TrendingUp, Cpu, ClipboardCheck, Box, Sparkles, Rocket,
} from "lucide-react";

// Identical service list/content to the Signature design's ServicesSection —
// only the composition differs (large numbered rows vs. a card grid).
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

export function BrutalistServices() {
  return (
    <section id="services" className="border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <h2 className="mb-10 font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          What we do
        </h2>
        <div className="border-t-2 border-[var(--color-ink)]">
          {services.map((service, i) => (
            <a
              key={service.href}
              href={service.href}
              className="group flex items-center gap-4 border-b-2 border-[var(--color-ink)] py-5 transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] sm:gap-8 sm:py-7"
            >
              <span className="font-display text-lg font-black text-[var(--color-orange)] sm:text-2xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <service.icon size={22} className="shrink-0 sm:size-7" />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-black uppercase tracking-tight sm:text-2xl">{service.title}</h3>
                <p className="mt-0.5 hidden text-sm text-[var(--color-ink)]/60 group-hover:text-[var(--color-cream)]/70 sm:block">{service.description}</p>
              </div>
              <span aria-hidden="true" className="shrink-0 font-display text-lg font-black transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
