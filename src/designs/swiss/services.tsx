const services = [
  { title: "Digital Foundations", description: "Websites, apps, hosting & the full digital infrastructure your brand needs.", href: "/services/digital-foundations" },
  { title: "Brand & Experience Design", description: "Logo systems, brand strategy, UX/UI that makes your brand look intentional.", href: "/services/brand-experience" },
  { title: "Growth & Marketing Engine", description: "SEO, paid media, funnels & analytics — a measurable growth system.", href: "/services/growth-marketing" },
  { title: "Automation & Business Systems", description: "Workflow automation & integrations that run your operations 24/7.", href: "/services/automation-systems" },
  { title: "Operations & Digital Consulting", description: "Process audits & transformation roadmaps to fix the internal mess.", href: "/services/ops-consulting" },
  { title: "Custom Product Builds", description: "SaaS MVPs, dashboards & platforms — build what doesn't exist yet.", href: "/services/custom-product-builds" },
  { title: "Next-Gen AI Services", description: "AI chatbots, predictive analytics & tools that give a genuine edge.", href: "/services/next-gen-services" },
  { title: "'Done-For-You' Scale Suite", description: "Brand, website, CRM & campaigns in one system. We run the machine.", href: "/services/done-for-you" },
];

export function SwissServices() {
  return (
    <section className="border-b border-[var(--color-ink)]/15 bg-[var(--color-cream)] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          What we do
        </h2>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <a key={service.href} href={service.href} className="group border-t border-[var(--color-ink)] pt-4">
              <span className="text-xs font-medium text-[var(--color-ink)]/60">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-sm font-bold text-[var(--color-ink)] group-hover:text-[var(--color-ink)]/60 transition-colors">{service.title}</h3>
              <p className="mt-1.5 text-xs font-light leading-relaxed text-[var(--color-ink)]/60">{service.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
