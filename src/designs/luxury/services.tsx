// Same service content as Signature/Brutalist, laid out as an editorial
// two-column list — a small roman-numeral index, a serif title, and a
// short description, with generous vertical whitespace between rows.
const services = [
  { title: "Digital Foundations", description: "Websites, apps, hosting & the full digital infrastructure your brand needs.", href: "/services/digital-foundations" },
  { title: "Brand & Experience Design", description: "Logo systems, brand strategy, UX/UI that makes your brand look intentional.", href: "/services/brand-experience" },
  { title: "Growth & Marketing Engine", description: "SEO, paid media, funnels & analytics — a measurable growth system.", href: "/services/growth-marketing" },
  { title: "Automation & Business Systems", description: "Workflow automation & integrations that run your operations 24/7.", href: "/services/automation-systems" },
  { title: "Operations & Digital Consulting", description: "Process audits & transformation roadmaps to fix the internal mess.", href: "/services/ops-consulting" },
  { title: "Custom Product Builds", description: "SaaS MVPs, dashboards & platforms — build what doesn't exist yet.", href: "/services/custom-product-builds" },
  { title: "Next-Gen AI Services", description: "AI chatbots, predictive analytics & tools that give a genuine edge.", href: "/services/next-gen-services" },
  { title: "\u2018Done-For-You\u2019 Scale Suite", description: "Brand, website, CRM & campaigns in one system. We run the machine.", href: "/services/done-for-you" },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function LuxuryServices() {
  return (
    <section className="bg-[var(--color-cream)] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-ink)]/40">What we offer</p>
        <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-16 text-center text-4xl font-medium text-[var(--color-ink)] sm:text-5xl">
          Capabilities
        </h2>
        <div className="divide-y divide-[var(--color-ink)]/10">
          {services.map((service, i) => (
            <a key={service.href} href={service.href} className="group flex items-baseline gap-6 py-8 sm:gap-10">
              <span style={{ fontFamily: "var(--font-fraunces), serif" }} className="w-8 shrink-0 text-sm text-[var(--color-yellow)]/70">
                {ROMAN[i]}
              </span>
              <div className="min-w-0 flex-1">
                <h3 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-xl font-medium text-[var(--color-ink)] group-hover:text-[var(--color-yellow)] transition-colors sm:text-2xl">
                  {service.title}
                </h3>
                <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-1.5 max-w-lg text-sm font-light text-[var(--color-ink)]/55">
                  {service.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
