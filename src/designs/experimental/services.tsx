import {
  Building2, Palette, TrendingUp, Cpu, ClipboardCheck, Box, Sparkles, Rocket,
} from "lucide-react";

const services = [
  { icon: Building2, title: "Digital Foundations", description: "Websites, apps, hosting & the full digital infrastructure your brand needs.", href: "/services/digital-foundations", rotate: "-rotate-1" },
  { icon: Palette, title: "Brand & Experience Design", description: "Logo systems, brand strategy, UX/UI that makes your brand look intentional.", href: "/services/brand-experience", rotate: "rotate-1" },
  { icon: TrendingUp, title: "Growth & Marketing Engine", description: "SEO, paid media, funnels & analytics — a measurable growth system.", href: "/services/growth-marketing", rotate: "-rotate-1" },
  { icon: Cpu, title: "Automation & Business Systems", description: "Workflow automation & integrations that run your operations 24/7.", href: "/services/automation-systems", rotate: "rotate-1" },
  { icon: ClipboardCheck, title: "Operations & Digital Consulting", description: "Process audits & transformation roadmaps to fix the internal mess.", href: "/services/ops-consulting", rotate: "-rotate-1" },
  { icon: Box, title: "Custom Product Builds", description: "SaaS MVPs, dashboards & platforms — build what doesn't exist yet.", href: "/services/custom-product-builds", rotate: "rotate-1" },
  { icon: Sparkles, title: "Next-Gen AI Services", description: "AI chatbots, predictive analytics & tools that give a genuine edge.", href: "/services/next-gen-services", rotate: "-rotate-1" },
  { icon: Rocket, title: "'Done-For-You' Scale Suite", description: "Brand, website, CRM & campaigns in one system. We run the machine.", href: "/services/done-for-you", rotate: "rotate-1" },
];

export function ExperimentalServices() {
  return (
    <section className="border-y border-[var(--color-ink)]/15 bg-[var(--color-cream)] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 font-display text-3xl font-black uppercase tracking-tight text-[var(--color-ink)] sm:text-5xl">
          What we do &rarr;
        </h2>
      </div>
      {/* Horizontal scroll-snap gallery — no JS required for the scroll
          itself, works with touch/trackpad/keyboard (arrow keys move focus
          between snap-aligned links) out of the box. */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4" style={{ scrollbarWidth: "none" }}>
        {services.map((service) => (
          <a
            key={service.href}
            href={service.href}
            className={`group w-64 shrink-0 snap-start border border-[var(--color-ink)] bg-[var(--color-paper)] p-6 transition-transform hover:-translate-y-1 ${service.rotate}`}
          >
            <service.icon size={24} className="text-[var(--color-orange)]" />
            <h3 className="mt-4 font-display text-sm font-black uppercase tracking-tight text-[var(--color-ink)]">{service.title}</h3>
            <p className="mt-2 text-xs font-medium text-[var(--color-ink)]/55">{service.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
