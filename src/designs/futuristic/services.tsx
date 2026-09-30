"use client";

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

export function FuturisticServices() {
  return (
    <section className="bg-[var(--color-ink)] px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">Capabilities</p>
        <h2 className="mb-14 text-center font-display text-3xl font-bold text-[var(--color-cream)] sm:text-5xl">
          What we build
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <a
              key={service.href}
              href={service.href}
              className="group rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-5 backdrop-blur-sm transition-all hover:border-[var(--color-orange)]/40 hover:bg-[var(--color-cream)]/[0.06] hover:shadow-[0_0_30px_-10px_var(--color-orange)]"
            >
              <service.icon size={22} className="text-[var(--color-orange)] transition-transform group-hover:scale-110" />
              <h3 className="mt-4 font-display text-sm font-bold text-[var(--color-cream)]">{service.title}</h3>
              <p className="mt-1.5 text-xs font-light leading-relaxed text-[var(--color-cream)]/60">{service.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
