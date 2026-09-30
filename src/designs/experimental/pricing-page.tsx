import { CheckCircle, Zap, TrendingUp, Building2 } from "lucide-react";

const plans = [
  { id: "starter", icon: Zap, name: "Starter", tagline: "Perfect for early-stage startups.", price: "₹49,999", period: "one-time", features: ["5–7 page website", "Brand identity mini-kit", "1 landing page", "Basic SEO setup"], href: "/get-quote?plan=starter", highlighted: false, rotate: "-rotate-1" },
  { id: "growth", icon: TrendingUp, name: "Growth", tagline: "For growing businesses ready to scale.", price: "₹1,49,999", period: "one-time + monthly", features: ["Everything in Starter, plus:", "10–15 page website or app", "Paid ads setup", "Lead-gen funnel architecture"], href: "/get-quote?plan=growth", highlighted: true, rotate: "rotate-0" },
  { id: "enterprise", icon: Building2, name: "Enterprise", tagline: "For a full digital OS.", price: "Custom", period: "tailored to scope", features: ["Everything in Growth, plus:", "Custom platform or SaaS MVP", "AI automation workflows", "Dedicated PM"], href: "/contact?plan=enterprise", highlighted: false, rotate: "rotate-1" },
];

export function ExperimentalPricingPage() {
  return (
    <div className="bg-[var(--color-cream)] pt-28">
      <section className="px-6 py-16 text-center">
        <p className="-rotate-2 mx-auto mb-4 inline-block border border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
          Pricing
        </p>
        <h1 className="font-display text-[clamp(2.2rem,8vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]">
          No hidden fees<span className="text-[var(--color-orange)]">.</span>
        </h1>
      </section>

      <section className="border-t border-[var(--color-ink)]/15 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.id} className={`border border-[var(--color-ink)] p-6 transition-transform hover:rotate-0 ${plan.rotate} ${plan.highlighted ? "bg-[var(--color-ink)] text-[var(--color-cream)]" : "bg-[var(--color-paper)]"}`}>
                {plan.highlighted && <span className="mb-3 inline-block border border-[var(--color-orange)] bg-[var(--color-orange)] px-2 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-ink)]">Popular</span>}
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
                <a href={plan.href} className={`mt-6 block border py-3 text-center font-display text-xs font-bold uppercase tracking-widest transition-colors ${plan.highlighted ? "border-[var(--color-orange)] bg-[var(--color-orange)] text-[var(--color-ink)] hover:opacity-90" : "border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"}`}>
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
