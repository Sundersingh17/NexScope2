import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";
import { getServiceBySlug } from "@/lib/content";
import { RevealCard } from "@/components/ui/reveal-card";

interface ServiceView {
  title: string;
  tagline: string;
  description: string;
  items: string[];
  process: { title: string; desc: string }[];
  gradient: string;
}

// Fallback content for the original launch services, used only if a
// matching row isn't found in the database (e.g. before the admin has
// migrated them into the CMS). Once a service with the same slug exists in
// the DB and is published, the DB version is served instead.
const FALLBACK_SERVICES: Record<string, ServiceView> = {
  "digital-foundations": {
    title: "Digital Foundations",
    tagline: "Everything a brand needs to exist and function online.",
    description: "We engineer the full digital foundation — from fast, secure websites to cloud deployment and performance optimization. This is where your brand gets a reliable, scalable home on the internet.",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    items: ["Website Engineering", "Web App Development", "Lightning-Fast Landing Pages", "Secure Hosting & Cloud Deployment", "Website Maintenance & Upgrades", "Performance & Speed Optimization", "Security Hardening & Compliance Setup", "Conversion-Optimized UI Systems", "Multi-platform Responsiveness"],
    process: [
      { title: "Audit", desc: "Analyze current infrastructure, performance, and security posture." },
      { title: "Architect", desc: "Design scalable, secure, and fast digital architecture." },
      { title: "Build", desc: "Develop using modern frameworks with CI/CD pipelines." },
      { title: "Launch", desc: "Deploy with monitoring, security, and performance guarantees." },
    ],
  },
  "brand-experience": {
    title: "Brand & Experience Design",
    tagline: "Make the brand look intentional, premium, and consistent.",
    description: "We craft complete brand identities that communicate your values, differentiate you in the market, and resonate across every touchpoint. Premium design systems that scale.",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    items: ["Logo & Visual Identity Systems", "Brand Strategy & Positioning", "UX Architecture & Wireframing", "High-Fidelity UI Design", "Complete Brand Guidelines", "Creative Content Design Kits", "Rebranding & Modernization", "Design Systems for Scale (Reusable UI libraries)"],
    process: [
      { title: "Research", desc: "Understand your market, audience, and competitive landscape." },
      { title: "Ideation", desc: "Explore concepts through moodboards, sketches, and creative direction." },
      { title: "Design", desc: "Refine chosen direction into a comprehensive visual system." },
      { title: "Deliver", desc: "Provide complete brand assets, guidelines, and production files." },
    ],
  },
  "growth-marketing": {
    title: "Growth & Marketing Engine",
    tagline: "Not 'marketing services.' A predictable, measurable growth system.",
    description: "We build full-funnel growth engines — from technical SEO to paid media, content ecosystems to conversion optimization. Every channel measured, every dollar accounted for.",
    gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
    items: ["Advanced SEO (Technical + Content + Authority)", "Performance Marketing (Meta, Google, LinkedIn)", "Social Media Strategy & Management", "Content Ecosystem Buildout", "Lead-Gen Funnels & CRO", "Email Marketing & Drip Journeys", "Influencer & Creator Campaign Architecture", "Analytics Dashboards & Insights", "A/B Testing & Optimization Loops"],
    process: [
      { title: "Audit", desc: "Analyze current performance, channels, and competition." },
      { title: "Strategy", desc: "Develop a data-backed growth plan with clear KPIs." },
      { title: "Execute", desc: "Implement campaigns, content, and optimization levers." },
      { title: "Optimize", desc: "Continuously test, measure, and refine for better results." },
    ],
  },
  "automation-systems": {
    title: "Automation & Business Systems",
    tagline: "Replace manual effort with clean, efficient systems that run 24/7.",
    description: "We design and deploy automation systems that handle the heavy lifting — from CRM optimization to workflow automation, email sequences to custom integrations. Your business runs while you sleep.",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    items: ["CRM Setup & Optimization (HubSpot, Zoho, Salesforce)", "Sales & Lead Automation Systems", "Workflow Automation (Internal + Client-facing)", "Email Automation Flows", "Custom Integrations (CRM / CMS / Payments / APIs)", "Internal Tool Automation (Ops + Support + Sales)", "No-Code Systems Engineering (n8n, Zapier, Make)", "End-to-End Funnel Automation"],
    process: [
      { title: "Map", desc: "Identify bottlenecks, manual tasks, and automation opportunities." },
      { title: "Design", desc: "Architect automated workflows with the right tool stack." },
      { title: "Build", desc: "Implement integrations, triggers, and fail-safes." },
      { title: "Monitor", desc: "Optimize flows, track performance, and scale." },
    ],
  },
  "ops-consulting": {
    title: "Operations & Digital Consulting",
    tagline: "Fix the internal mess clients pretend they don't have.",
    description: "We audit, diagnose, and fix broken systems. From business process optimization to digital transformation roadmaps, we help you build operations that scale without chaos.",
    gradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
    items: ["Business Process Optimization", "Digital Transformation Roadmaps", "System Audits (Tech + Ops + Marketing)", "Brand Positioning & Communication Strategy", "Scaling Blueprints & Hiring Structure", "Automation Feasibility Planning", "Full Funnel Audits & Performance Breakdown", "SOP Development & Documentation"],
    process: [
      { title: "Audit", desc: "Deep dive into current operations, systems, and pain points." },
      { title: "Diagnose", desc: "Identify root causes and prioritize quick wins vs long-term fixes." },
      { title: "Plan", desc: "Deliver a clear roadmap with timelines and resource requirements." },
      { title: "Execute", desc: "Implement changes with ongoing support and iteration." },
    ],
  },
  "custom-product-builds": {
    title: "Custom Product Builds",
    tagline: "For when the client needs something beyond usual agency scope.",
    description: "We engineer custom digital products — from SaaS MVPs to internal dashboards, data-driven applications to advanced API integrations. Strategy, architecture, and production in one package.",
    gradient: "from-red-500/20 via-rose-500/10 to-transparent",
    items: ["SaaS MVP Development", "Internal Dashboards & Admin Tools", "Custom Web Platforms", "Data-Driven Applications", "Advanced API Integrations", "Product Strategy + UX Architecture", "Prototype → Production Development", "Long-Term Tech Partnership & Support"],
    process: [
      { title: "Strategy", desc: "Define product vision, user stories, and technical requirements." },
      { title: "Design", desc: "Create wireframes, prototypes, and system architecture." },
      { title: "Build", desc: "Develop iteratively with agile sprints and continuous delivery." },
      { title: "Ship", desc: "Deploy, monitor, and iterate based on real usage data." },
    ],
  },
  "next-gen-services": {
    title: "Specialized 'Next-Gen' Services",
    tagline: "Extraordinary category. This is where you stand out.",
    description: "We build AI-powered systems that give your business a genuine competitive advantage — chatbots, automation workflows, predictive analytics, and intelligent tools that transform how you operate.",
    gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
    items: ["AI-Powered Chatbots & Assistants", "AI Automation Workflows (Internal + Customer-side)", "AI-Based Lead Qualification & Support Systems", "Data Visualization Dashboards", "Predictive Analytics Systems", "Automated Reporting Systems", "Custom AI Tools for Workflow Efficiency", "Intelligent Content & Campaign Generators"],
    process: [
      { title: "Discover", desc: "Identify high-impact areas for AI integration in your workflows." },
      { title: "Design", desc: "Architect AI solutions tailored to your data and infrastructure." },
      { title: "Build", desc: "Develop, train, and integrate AI models into existing systems." },
      { title: "Deploy", desc: "Roll out with monitoring, retraining pipelines, and optimization." },
    ],
  },
  "done-for-you": {
    title: "The 'Done-For-You' Scale Suite",
    tagline: "For brands that want end-to-end growth without micromanaging anything.",
    description: "Full digital ecosystem setup — brand, website, CRM, and campaigns in one unified system. Automated lead engines, monthly growth management, and dedicated ops support. You focus on the vision, we run the machine.",
    gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
    items: ["Full Digital Ecosystem Setup", "Brand + Website + CRM + Campaigns in One System", "Automated Lead Engine Deployment", "Monthly Growth Management", "Always-On Optimization Loops", "Quarterly Scale Strategy", "Dedicated Ops Support"],
    process: [
      { title: "Onboard", desc: "Full discovery of your business, goals, and existing systems." },
      { title: "Build", desc: "Set up the complete digital ecosystem in one seamless build." },
      { title: "Launch", desc: "Go live with campaigns, automation, and monitoring active." },
      { title: "Scale", desc: "Monthly optimization, quarterly strategy, always-on support." },
    ],
  },
};

const GRADIENTS = [
  "from-blue-500/20 via-cyan-500/10 to-transparent",
  "from-purple-500/20 via-pink-500/10 to-transparent",
  "from-green-500/20 via-emerald-500/10 to-transparent",
  "from-orange-500/20 via-amber-500/10 to-transparent",
  "from-indigo-500/20 via-violet-500/10 to-transparent",
  "from-red-500/20 via-rose-500/10 to-transparent",
  "from-teal-500/20 via-cyan-500/10 to-transparent",
  "from-yellow-500/20 via-amber-500/10 to-transparent",
];

// Deterministic pick so a given slug always gets the same gradient across
// requests, without needing a stored gradient column in the database.
function gradientForSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

async function getService(slug: string): Promise<ServiceView | null> {
  const dbService = await getServiceBySlug(slug);
  if (dbService && dbService.description) {
    return {
      title: dbService.title,
      tagline: dbService.shortDesc,
      description: dbService.description,
      items: dbService.benefits,
      process: dbService.process,
      gradient: gradientForSlug(slug),
    };
  }
  return FALLBACK_SERVICES[slug] ?? null;
}

// Only pre-renders the fallback slugs at build time; DB-backed services
// render on demand (and get cached) the first time they're requested.
export function generateStaticParams() {
  return Object.keys(FALLBACK_SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.tagline,
    openGraph: {
      title: `${service.title} | NexScope Agency — AI, Design & Growth`,
      description: service.tagline,
    },
    twitter: {
      title: `${service.title} | NexScope Agency — AI, Design & Growth`,
      description: service.tagline,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <div className="pt-28">
      {/* Hero */}
      <section className="relative py-16 md:py-24 border-b-2 border-[var(--color-ink)] overflow-hidden bg-[var(--color-cream)]">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Badge className="mb-4">{service.title}</Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02] mb-4 text-[var(--color-ink)]">
            {service.tagline}
          </h1>
          <p className="text-[var(--color-gray)] text-lg max-w-3xl mx-auto leading-relaxed">
            {service.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button href="/get-quote" size="lg" pop>Start Your Project</Button>
            <Button href="/packages" variant="secondary" size="lg">View Packages</Button>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      {service.items.length > 0 && (
        <section className="py-20 bg-[var(--color-cream)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight mb-8 text-[var(--color-ink)]">
              What's Inside
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.items.map((item, i) => (
                <RevealCard
                  key={item}
                  delay={i * 0.05}
                  hover={false}
                  className="flex items-start gap-3 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-4 shadow-neo-sm"
                >
                  <CheckCircle size={18} className="text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-ink)]/85">{item}</span>
                </RevealCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {service.process.length > 0 && (
        <section className="py-20 bg-[var(--color-ink)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight mb-8 text-[var(--color-cream)]">
              How We Deliver
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((step, i) => (
                <RevealCard key={step.title} delay={i * 0.1} hover={false} className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-[var(--color-cream)]/20 bg-[var(--color-cream)]/[0.06] flex items-center justify-center mx-auto mb-4 font-display text-2xl font-black text-[var(--color-orange)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h4 className="font-display font-bold mb-1 text-[var(--color-cream)]">{step.title}</h4>
                  <p className="text-xs text-[var(--color-cream)]/60">{step.desc}</p>
                </RevealCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 text-center bg-[var(--color-cream)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
            Ready to Get Started?
          </h2>
          <p className="text-[var(--color-gray)] mb-8">
            Let's discuss how {service.title} can transform your business.
          </p>
          <Button href="/get-quote" size="lg" pop>
            Get a Free Quote <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}
