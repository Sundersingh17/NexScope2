import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Zap, TrendingUp, Building2 } from "lucide-react";
import { RevealCard } from "@/components/ui/reveal-card";

const plans = [
  { id: "starter", icon: Zap, name: "Starter", tagline: "Perfect for early-stage startups and solopreneurs.", price: "₹49,999", period: "one-time", features: ["5–7 page responsive website", "Brand identity mini-kit (logo + colors + fonts)", "1 high-converting landing page", "Hosting & deployment setup", "Speed & security optimization", "Basic SEO setup", "Mobile responsiveness", "Basic analytics integration", "1 lead-capture form → email automation", "1 revision round"], cta: "Get Started", href: "/get-quote?plan=starter", highlighted: false },
  { id: "growth", icon: TrendingUp, name: "Growth", tagline: "For growing businesses ready to scale.", price: "₹1,49,999", period: "one-time + monthly retainer", features: ["Everything in Starter, plus:", "10–15 page website or web app", "Complete brand identity system", "SEO strategy + monthly optimization", "Social media management (8–12 posts/month)", "Paid ads setup (Meta + Google)", "Lead-gen funnel architecture", "Email drip campaigns (up to 3 sequences)", "Content calendar creation", "Analytics dashboard setup", "Monthly performance reports", "Priority support"], cta: "Scale Up", href: "/get-quote?plan=growth", highlighted: true },
  { id: "enterprise", icon: Building2, name: "Enterprise", tagline: "For established businesses needing a full digital OS.", price: "Custom", period: "tailored to scope", features: ["Everything in Growth, plus:", "Custom web platform or SaaS MVP", "Full brand operating system", "AI automation workflows", "CRM full build & optimization", "Advanced integrations (API, payments, tools)", "Dedicated project manager", "24/7 support & maintenance", "Quarterly strategy sessions", "Custom reporting dashboard", "Team training & documentation", "Priority onboarding"], cta: "Contact Us", href: "/contact?plan=enterprise", highlighted: false },
];

const PRICING_FAQS = [
  { q: "How long does a typical project take?", a: "Starter projects typically take 2–4 weeks. Growth projects take 4–8 weeks. Enterprise timelines are scoped during our discovery call." },
  { q: "Do you offer payment plans?", a: "Yes. We offer 50% upfront / 50% on completion for one-time projects, and monthly billing for retainer-based engagements." },
  { q: "What if I need changes after launch?", a: "Every plan includes revision rounds. For ongoing support, we offer maintenance retainers starting at ₹9,999/month." },
  { q: "Can I upgrade my plan later?", a: "Absolutely. You can upgrade anytime. We'll credit unused portions of your current plan toward the upgrade." },
  { q: "Do you offer refunds?", a: "We stand by our work. If we fail to deliver on the agreed scope, we'll offer a full or partial refund — no questions asked." },
];

export function SignaturePricingPage() {
  return (
    <div className="pt-28">
      <section className="py-16 md:py-24 border-b-2 border-[var(--color-ink)] text-center bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02] mb-4 text-[var(--color-ink)]">
            Simple, Transparent Pricing
          </h1>
          <p className="text-[var(--color-gray)] text-lg max-w-3xl mx-auto leading-relaxed">
            No hidden fees. No surprise charges. Pick the plan that fits your stage — or build a custom package.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <div key={plan.id} className={`relative rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] flex flex-col ${plan.highlighted ? "shadow-neo-lg scale-105 md:scale-105" : "shadow-neo-sm"}`}>
                  <RevealCard hover={false} delay={i * 0.1} className="p-8 flex flex-col flex-1">
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="font-display text-[0.6rem] font-bold tracking-widest uppercase bg-[var(--color-orange)] text-[var(--color-cream)] border-2 border-[var(--color-ink)] px-4 py-1.5 rounded-full">Most Popular</span>
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-ink)] flex items-center justify-center mb-4">
                      <Icon size={20} className="text-[var(--color-cream)]" />
                    </div>
                    <h2 className="font-display text-2xl font-black tracking-tight mb-1 text-[var(--color-ink)]">{plan.name}</h2>
                    <p className="text-sm text-[var(--color-gray)] mb-6">{plan.tagline}</p>
                    <div className="mb-6">
                      <span className="font-display text-4xl font-black text-[var(--color-ink)]">{plan.price}</span>
                      <span className="text-sm text-[var(--color-gray)] ml-2">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-[var(--color-ink)]/80">
                          <CheckCircle size={16} className="text-[var(--color-orange)] shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button href={plan.href} size="lg" pop={plan.highlighted} variant={plan.highlighted ? "primary" : "secondary"} className="w-full justify-center">
                      {plan.cta} <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </RevealCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-ink)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-center mb-12 text-[var(--color-cream)]">Pricing FAQ</h2>
          <div className="space-y-4">
            {PRICING_FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl border-2 border-[var(--color-cream)]/15 bg-[var(--color-cream)]/[0.04] p-6">
                <h3 className="font-display font-bold mb-2 text-[var(--color-cream)]">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-cream)]/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center bg-[var(--color-cream)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">Not Sure Which Plan Fits?</h2>
          <p className="text-[var(--color-gray)] mb-8">Book a free 15-minute discovery call and we&apos;ll recommend the perfect plan for your business.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/get-quote" size="lg" pop>Book a Discovery Call</Button>
            <Button href="/packages" variant="secondary" size="lg">View Pre-Built Packages</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
