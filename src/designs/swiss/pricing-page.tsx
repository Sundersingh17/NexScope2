const plans = [
  { id: "starter", name: "Starter", tagline: "Perfect for early-stage startups.", price: "₹49,999", period: "one-time", features: ["5–7 page website", "Brand identity mini-kit", "1 landing page", "Basic SEO setup"], href: "/get-quote?plan=starter", highlighted: false },
  { id: "growth", name: "Growth", tagline: "For growing businesses ready to scale.", price: "₹1,49,999", period: "one-time + monthly", features: ["Everything in Starter, plus:", "10–15 page website or app", "Paid ads setup", "Lead-gen funnel architecture"], href: "/get-quote?plan=growth", highlighted: true },
  { id: "enterprise", name: "Enterprise", tagline: "For a full digital OS.", price: "Custom", period: "tailored to scope", features: ["Everything in Growth, plus:", "Custom platform or SaaS MVP", "AI automation workflows", "Dedicated project manager"], href: "/contact?plan=enterprise", highlighted: false },
];

const PRICING_FAQS = [
  { q: "How long does a typical project take?", a: "Starter projects typically take 2–4 weeks. Growth projects take 4–8 weeks." },
  { q: "Do you offer payment plans?", a: "50% upfront / 50% on completion, or monthly billing for retainers." },
  { q: "What if I need changes after launch?", a: "Every plan includes revision rounds; maintenance retainers start at ₹9,999/month." },
];

export function SwissPricingPage() {
  return (
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b border-[var(--color-ink)]/15 px-6 py-24 text-center sm:px-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-ink)]/40">Pricing</p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Simple, transparent pricing
        </h1>
      </section>

      <section className="border-b border-[var(--color-ink)]/15 px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className={plan.highlighted ? "border-t-2 border-[var(--color-ink)] pt-4" : "border-t border-[var(--color-ink)]/20 pt-4"}>
              {plan.highlighted && <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-wider text-[var(--color-ink)]/50">Most Popular</p>}
              <h2 className="text-lg font-bold text-[var(--color-ink)]">{plan.name}</h2>
              <p className="mt-1 text-xs font-light text-[var(--color-ink)]/55">{plan.tagline}</p>
              <p className="mt-4 text-2xl font-bold text-[var(--color-ink)]">{plan.price}</p>
              <p className="text-xs font-light text-[var(--color-ink)]/40">/{plan.period}</p>
              <ul className="mt-4 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs font-light text-[var(--color-ink)]/60">— {f}</li>
                ))}
              </ul>
              <a href={plan.href} className="mt-5 inline-block border-b border-[var(--color-ink)]/40 pb-0.5 text-xs font-medium uppercase tracking-wider text-[var(--color-ink)]/70 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors">
                Get started
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl">Pricing FAQ</h2>
          <div className="divide-y divide-[var(--color-ink)]/10">
            {PRICING_FAQS.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="text-sm font-bold text-[var(--color-ink)]">{faq.q}</h3>
                <p className="mt-1.5 text-xs font-light text-[var(--color-ink)]/55">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
