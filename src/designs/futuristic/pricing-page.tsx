import { CheckCircle, Zap, TrendingUp, Building2 } from "lucide-react";

const plans = [
  { id: "starter", icon: Zap, name: "Starter", tagline: "Perfect for early-stage startups.", price: "₹49,999", period: "one-time", features: ["5–7 page website", "Brand identity mini-kit", "1 landing page", "Basic SEO setup"], href: "/get-quote?plan=starter", highlighted: false },
  { id: "growth", icon: TrendingUp, name: "Growth", tagline: "For growing businesses ready to scale.", price: "₹1,49,999", period: "one-time + monthly", features: ["Everything in Starter, plus:", "10–15 page website or app", "Paid ads setup", "Lead-gen funnel architecture"], href: "/get-quote?plan=growth", highlighted: true },
  { id: "enterprise", icon: Building2, name: "Enterprise", tagline: "For a full digital OS.", price: "Custom", period: "tailored to scope", features: ["Everything in Growth, plus:", "Custom platform or SaaS MVP", "AI automation workflows", "Dedicated PM"], href: "/contact?plan=enterprise", highlighted: false },
];

export function FuturisticPricingPage() {
  return (
    <div className="bg-[var(--color-ink)] pt-24">
      <section className="relative overflow-hidden px-4 py-16 text-center">
        <div className="nx-futuristic-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-xl">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">Pricing</p>
          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold text-[var(--color-cream)]">Simple, transparent pricing</h1>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.id} className={`rounded-2xl border p-6 backdrop-blur-sm ${plan.highlighted ? "border-[var(--color-orange)]/50 bg-[var(--color-orange)]/[0.06] shadow-[0_0_30px_-10px_var(--color-orange)]" : "border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03]"}`}>
                {plan.highlighted && <span className="mb-3 inline-block rounded-full bg-[var(--color-orange)] px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-ink)]">Popular</span>}
                <Icon size={20} className="text-[var(--color-orange)]" />
                <h2 className="mt-3 font-display text-lg font-bold text-[var(--color-cream)]">{plan.name}</h2>
                <p className="mt-1 text-xs font-light text-[var(--color-cream)]/60">{plan.tagline}</p>
                <p className="mt-4 font-display text-2xl font-bold text-[var(--color-cream)]">{plan.price}</p>
                <p className="text-xs font-light text-[var(--color-cream)]/60">/{plan.period}</p>
                <ul className="mt-4 space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs font-light text-[var(--color-cream)]/60">
                      <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={plan.href} className={`mt-5 block rounded-xl py-2.5 text-center text-xs font-bold transition-shadow ${plan.highlighted ? "bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-yellow)] text-[var(--color-ink)] shadow-[0_0_20px_-6px_var(--color-orange)]" : "border border-[var(--color-cream)]/15 text-[var(--color-cream)] hover:border-[var(--color-orange)]/50"}`}>
                  Get started
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
