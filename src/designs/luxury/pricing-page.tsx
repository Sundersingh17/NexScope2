const plans = [
  { id: "starter", name: "Starter", tagline: "Perfect for early-stage startups and solopreneurs.", price: "₹49,999", period: "one-time", features: ["5–7 page responsive website", "Brand identity mini-kit", "1 landing page", "Hosting & deployment", "Basic SEO setup"], href: "/get-quote?plan=starter", highlighted: false },
  { id: "growth", name: "Growth", tagline: "For growing businesses ready to scale.", price: "₹1,49,999", period: "one-time + monthly", features: ["Everything in Starter, plus:", "10–15 page website or web app", "Complete brand identity system", "Paid ads setup", "Lead-gen funnel architecture"], href: "/get-quote?plan=growth", highlighted: true },
  { id: "enterprise", name: "Enterprise", tagline: "For established businesses needing a full digital OS.", price: "Custom", period: "tailored to scope", features: ["Everything in Growth, plus:", "Custom web platform or SaaS MVP", "AI automation workflows", "Dedicated project manager", "24/7 support"], href: "/contact?plan=enterprise", highlighted: false },
];

const PRICING_FAQS = [
  { q: "How long does a typical project take?", a: "Starter projects typically take 2–4 weeks. Growth projects take 4–8 weeks." },
  { q: "Do you offer payment plans?", a: "50% upfront / 50% on completion, or monthly billing for retainers." },
  { q: "What if I need changes after launch?", a: "Every plan includes revision rounds; maintenance retainers start at ₹9,999/month." },
];

export function LuxuryPricingPage() {
  return (
    <div className="pt-20 bg-[var(--color-cream)]">
      <section className="bg-[var(--color-ink)] px-6 py-28 text-center sm:px-10">
        <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/80">Pricing</p>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mx-auto max-w-2xl text-4xl font-medium text-[var(--color-cream)] sm:text-6xl">
          Simple, transparent <span className="italic text-[var(--color-yellow)]">pricing</span>
        </h1>
      </section>

      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className={plan.highlighted ? "border-t-2 border-[var(--color-yellow)] pt-6" : "border-t border-[var(--color-ink)]/15 pt-6"}>
              {plan.highlighted && <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-[var(--color-yellow)]">Most Popular</p>}
              <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-xl font-medium text-[var(--color-ink)]">{plan.name}</h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-1 text-xs font-light text-[var(--color-ink)]/60">{plan.tagline}</p>
              <p style={{ fontFamily: "var(--font-fraunces), serif" }} className="mt-5 text-3xl font-medium text-[var(--color-ink)]">{plan.price}</p>
              <p className="text-xs font-light text-[var(--color-ink)]/60">/{plan.period}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} style={{ fontFamily: "var(--font-inter), sans-serif" }} className="text-xs font-light text-[var(--color-ink)]/65">— {f}</li>
                ))}
              </ul>
              <a href={plan.href} className="mt-6 inline-block border-b border-[var(--color-ink)]/40 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)]/70 hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)] transition-colors">
                Get started
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-ink)] px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-10 text-center text-2xl font-medium text-[var(--color-cream)] sm:text-3xl">Pricing FAQ</h2>
          <div className="divide-y divide-[var(--color-cream)]/10">
            {PRICING_FAQS.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-base font-medium text-[var(--color-cream)]">{faq.q}</h3>
                <p className="mt-1.5 text-sm font-light text-[var(--color-cream)]/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
