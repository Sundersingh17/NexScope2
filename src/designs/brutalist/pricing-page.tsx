import { CheckCircle, Zap, TrendingUp, Building2 } from "lucide-react";

const plans = [
  { id: "starter", icon: Zap, name: "Starter", tagline: "Perfect for early-stage startups and solopreneurs.", price: "₹49,999", period: "one-time", features: ["5–7 page responsive website", "Brand identity mini-kit", "1 high-converting landing page", "Hosting & deployment setup", "Speed & security optimization", "Basic SEO setup", "1 lead-capture → email automation"], cta: "Get Started", href: "/get-quote?plan=starter", highlighted: false },
  { id: "growth", icon: TrendingUp, name: "Growth", tagline: "For growing businesses ready to scale.", price: "₹1,49,999", period: "one-time + monthly", features: ["Everything in Starter, plus:", "10–15 page website or web app", "Complete brand identity system", "SEO strategy + monthly optimization", "Paid ads setup (Meta + Google)", "Lead-gen funnel architecture", "Priority support"], cta: "Scale Up", href: "/get-quote?plan=growth", highlighted: true },
  { id: "enterprise", icon: Building2, name: "Enterprise", tagline: "For established businesses needing a full digital OS.", price: "Custom", period: "tailored to scope", features: ["Everything in Growth, plus:", "Custom web platform or SaaS MVP", "Full brand operating system", "AI automation workflows", "Dedicated project manager", "24/7 support & maintenance"], cta: "Contact Us", href: "/contact?plan=enterprise", highlighted: false },
];

const PRICING_FAQS = [
  { q: "How long does a typical project take?", a: "Starter projects typically take 2–4 weeks. Growth projects take 4–8 weeks. Enterprise timelines are scoped during our discovery call." },
  { q: "Do you offer payment plans?", a: "Yes. 50% upfront / 50% on completion for one-time projects, monthly billing for retainers." },
  { q: "What if I need changes after launch?", a: "Every plan includes revision rounds. Maintenance retainers start at ₹9,999/month." },
  { q: "Can I upgrade my plan later?", a: "Anytime — we'll credit unused portions toward the upgrade." },
  { q: "Do you offer refunds?", a: "If we fail to deliver on the agreed scope, we'll offer a full or partial refund." },
];

export function BrutalistPricingPage() {
  return (
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b-4 border-[var(--color-ink)] py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <p className="mb-4 inline-block border-2 border-[var(--color-ink)] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em]">Pricing</p>
          <h1 className="font-display text-[clamp(2.2rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter text-[var(--color-ink)]">
            No hidden fees.
          </h1>
          <p className="mt-4 text-sm font-medium text-[var(--color-ink)]/70">Pick the plan that fits your stage — or build a custom package.</p>
        </div>
      </section>

      <section className="border-b-4 border-[var(--color-ink)] py-16">
        <div className="mx-auto grid max-w-6xl gap-0 px-4 sm:grid-cols-3 sm:px-8">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <div key={plan.id} className={`border-2 border-[var(--color-ink)] p-6 ${plan.highlighted ? "bg-[var(--color-ink)] text-[var(--color-cream)]" : "bg-[var(--color-cream)]"} ${i > 0 ? "sm:-ml-0.5" : ""}`}>
                {plan.highlighted && <span className="mb-3 inline-block border-2 border-[var(--color-orange)] bg-[var(--color-orange)] px-2 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-ink)]">Most Popular</span>}
                <Icon size={22} className="text-[var(--color-orange)]" />
                <h2 className="mt-3 font-display text-xl font-black uppercase tracking-tight">{plan.name}</h2>
                <p className={`mt-1 text-xs font-medium ${plan.highlighted ? "text-[var(--color-cream)]/60" : "text-[var(--color-ink)]/60"}`}>{plan.tagline}</p>
                <p className="mt-4 font-display text-3xl font-black">{plan.price}</p>
                <p className={`text-xs ${plan.highlighted ? "text-[var(--color-cream)]/60" : "text-[var(--color-ink)]/60"}`}>/{plan.period}</p>
                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs font-medium">
                      <CheckCircle size={13} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={plan.href} className={`mt-6 block border-2 py-3 text-center font-display text-xs font-bold uppercase tracking-widest transition-colors ${plan.highlighted ? "border-[var(--color-orange)] bg-[var(--color-orange)] text-[var(--color-ink)] hover:opacity-90" : "border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"}`}>
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-b-4 border-[var(--color-ink)] bg-[var(--color-ink)] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <h2 className="mb-10 text-center font-display text-3xl font-black uppercase tracking-tighter text-[var(--color-cream)] sm:text-4xl">Pricing FAQ</h2>
          <div className="space-y-0 border-t-2 border-[var(--color-cream)]/15">
            {PRICING_FAQS.map((faq) => (
              <div key={faq.q} className="border-b-2 border-[var(--color-cream)]/15 py-5">
                <h3 className="font-display text-sm font-bold uppercase text-[var(--color-cream)]">{faq.q}</h3>
                <p className="mt-1.5 text-sm text-[var(--color-cream)]/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-8">
          <h2 className="font-display text-3xl font-black uppercase tracking-tighter sm:text-5xl">Not sure which plan fits?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/get-quote" className="border-2 border-[var(--color-ink)] bg-[var(--color-orange)] px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] hover:opacity-90 transition-opacity">Book a Call</a>
            <a href="/packages" className="border-2 border-[var(--color-ink)] px-6 py-3 font-display text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors">View Packages</a>
          </div>
        </div>
      </section>
    </div>
  );
}
