import { Metadata } from "next";
import { getPublishedPackages } from "@/lib/content";
import { DesignPackagesPage } from "@/components/design-system/design-renderer";
import type { PackageView } from "@/designs/types";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Explore NexScope's pre-built packages: Starter Digital Launch, Growth Engine, Scale Automation, Brand Operating System, Influencer Growth Machine, Custom Build Lab, Enterprise Digital OS, and Build-Your-Own System.",
  openGraph: {
    title: "Packages | NexScope Agency — AI, Design & Growth",
    description:
      "Explore NexScope's pre-built packages: Starter Digital Launch, Growth Engine, Scale Automation, Brand Operating System, Influencer Growth Machine, Custom Build Lab, Enterprise Digital OS, and Build-Your-Own System.",
  },
  twitter: {
    title: "Packages | NexScope Agency — AI, Design & Growth",
    description:
      "Explore NexScope's pre-built packages designed for every stage of business growth. Find the right fit or build your own.",
  },
};

// Shown only if the database has no published packages yet.
const FALLBACK_PACKAGES: PackageView[] = [
  { slug: "starter", icon: "Zap", color: "from-blue-500 to-cyan-500", title: "Starter Digital Launch Pack", signal: "Starting out? This is enough.", purpose: "Build your entire digital foundation from zero.", forWhom: "New founders, service providers, small teams.", outcome: "A stable, clean, trustworthy online presence.", items: ["Website (5–7 pages)", "Brand identity mini-kit", "One high-converting landing page", "Hosting + deployment", "Speed + security setup", "Basic CRM setup", "1 lead-capture → email automation", "Mobile responsiveness", "Basic analytics setup"] },
  { slug: "growth", icon: "TrendingUp", color: "from-green-500 to-emerald-500", title: "Growth Engine Pack", signal: "You have presence. Now you need traffic + leads.", purpose: "Build a predictable, measurable growth system.", forWhom: "Growing brands, coaches, agencies, D2C, consultants.", outcome: "A repeatable engine that brings in qualified leads.", items: ["Advanced SEO", "Paid ads (Meta + Google)", "Content ecosystem", "Lead-gen funnels + CRO", "Email drip journeys", "Analytics dashboard", "Monthly performance reports"] },
  { slug: "scale", icon: "Cpu", color: "from-purple-500 to-violet-500", title: "Scale Automation Pack", signal: "You're growing but drowning in manual work.", purpose: "Automate operations so the business runs itself.", forWhom: "Scaling teams tired of manual busywork.", outcome: "Hours saved every week, fewer dropped balls.", items: ["CRM setup & optimization", "Sales & lead automation", "Workflow automation", "Custom integrations", "No-code systems engineering", "End-to-end funnel automation"] },
  { slug: "brand-os", icon: "Palette", color: "from-pink-500 to-rose-500", title: "Brand Operating System Pack", signal: "Your brand feels inconsistent across channels.", purpose: "A complete, consistent brand system.", forWhom: "Brands ready to look and feel premium everywhere.", outcome: "One coherent brand, instantly recognizable.", items: ["Logo & visual identity system", "Full brand guidelines", "UX architecture & UI design", "Creative content design kits", "Design systems for scale"] },
  { slug: "influencer-growth", icon: "Users", color: "from-orange-500 to-amber-500", title: "Influencer Growth Machine Pack", signal: "You want reach, not just a website.", purpose: "Build an audience-driven growth engine.", forWhom: "Creators, personal brands, coaches.", outcome: "A content + campaign machine that compounds.", items: ["Social media strategy & management", "Influencer/creator campaign architecture", "Content ecosystem buildout", "Email marketing", "Analytics & insights"] },
  { slug: "custom-build-lab", icon: "Box", color: "from-red-500 to-rose-500", title: "Custom Build Lab Pack", signal: "Your idea doesn't fit anyone's template.", purpose: "Engineer custom digital products and internal tools.", forWhom: "Tech founders, enterprise teams, B2B companies.", outcome: "A working, launch-ready product — not a dream.", items: ["SaaS MVP development", "Custom dashboards", "Internal business tools", "Advanced API integrations", "Product strategy + UX architecture", "Prototype → production development", "Ops + support systems"] },
  { slug: "enterprise", icon: "LayoutGrid", color: "from-indigo-500 to-violet-500", title: "Enterprise Digital OS Pack", signal: "You want EVERYTHING in one unified system.", purpose: "Build the company's entire digital operating system.", forWhom: "Scaling brands, SMEs, high-growth companies.", outcome: "The whole business runs like one coordinated machine.", items: ["Everything from Starter + Growth + Scale + Brand OS", "Predictive analytics", "AI employee suite (content + support + sales)", "Ops-in-a-Box (SOPs, hiring templates)", "Dedicated ops manager", "Crisis-response architecture", "Founder cockpit dashboard (KPIs, bottlenecks, recommendations)", "Quarterly scale blueprint", "Data normalization layer"] },
  { slug: "build-your-own", icon: "Sliders", color: "from-teal-500 to-cyan-500", title: "Build-Your-Own System Pack", signal: "You want total freedom.", purpose: "Mix & match modules, we assemble the system.", forWhom: "Anyone who wants a custom-engineered build without confusion.", outcome: "Your own custom system tailored exactly to your needs.", items: ["Choose modules from any service pillar", "Choose Depth: Light / Standard / Advanced", "Set your timeline & budget band", "Select automation count & design complexity", "Pick funnel count & platform choices", "System auto-creates price range & scope", "Detailed timeline estimate", "Proposal PDF delivered"] },
];

// Data fetching stays here, server-side, exactly as before — this page
// just hands the result to DesignPackagesPage instead of rendering the
// Signature markup directly.
export default async function PackagesPage() {
  const dbPackages = await getPublishedPackages();
  const packages = dbPackages.length > 0 ? dbPackages : FALLBACK_PACKAGES;

  return <DesignPackagesPage packages={packages} />;
}
