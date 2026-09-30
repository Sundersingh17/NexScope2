import { Metadata } from "next";
import { getPublishedServices } from "@/lib/content";
import { DesignServicesPage } from "@/components/design-system/design-renderer";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore NexScope's eight service pillars: Digital Foundations, Brand & Experience Design, Growth & Marketing Engine, Automation & Business Systems, Operations & Consulting, Custom Product Builds, Next-Gen AI Services, and the Done-For-You Scale Suite.",
  openGraph: {
    title: "Our Services | NexScope Agency — AI, Design & Growth",
    description:
      "Explore NexScope's eight service pillars: Digital Foundations, Brand & Experience Design, Growth & Marketing Engine, Automation & Business Systems, Operations & Consulting, Custom Product Builds, Next-Gen AI Services, and the Done-For-You Scale Suite.",
  },
  twitter: {
    title: "Our Services | NexScope Agency — AI, Design & Growth",
    description:
      "Explore NexScope's eight service pillars: Digital Foundations, Brand & Experience Design, Growth & Marketing Engine, Automation & Business Systems, Operations & Consulting, Custom Product Builds, Next-Gen AI Services, and the Done-For-You Scale Suite.",
  },
};

// Shown only if the database has no published services yet.
const FALLBACK_PILLARS = [
  { slug: "digital-foundations", title: "Digital Foundations", tagline: "Everything a brand needs to exist and function online.", items: ["Website Engineering", "Web App Development", "Lightning-Fast Landing Pages", "Secure Hosting & Cloud Deployment", "Website Maintenance & Upgrades", "Performance & Speed Optimization", "Security Hardening & Compliance Setup", "Conversion-Optimized UI Systems", "Multi-platform Responsiveness"] },
  { slug: "brand-experience", title: "Brand & Experience Design", tagline: "Make the brand look intentional, premium, and consistent.", items: ["Logo & Visual Identity Systems", "Brand Strategy & Positioning", "UX Architecture & Wireframing", "High-Fidelity UI Design", "Complete Brand Guidelines", "Creative Content Design Kits", "Rebranding & Modernization", "Design Systems for Scale (Reusable UI libraries)"] },
  { slug: "growth-marketing", title: "Growth & Marketing Engine", tagline: "A predictable, measurable growth system.", items: ["Advanced SEO (Technical + Content + Authority)", "Performance Marketing (Meta, Google, LinkedIn)", "Social Media Strategy & Management", "Content Ecosystem Buildout", "Lead-Gen Funnels & CRO", "Email Marketing & Drip Journeys", "Influencer & Creator Campaign Architecture", "Analytics Dashboards & Insights", "A/B Testing & Optimization Loops"] },
  { slug: "automation-systems", title: "Automation & Business Systems", tagline: "Replace manual effort with clean, efficient systems that run 24/7.", items: ["CRM Setup & Optimization (HubSpot, Zoho, Salesforce)", "Sales & Lead Automation Systems", "Workflow Automation (Internal + Client-facing)", "Email Automation Flows", "Custom Integrations (CRM / CMS / Payments / APIs)", "Internal Tool Automation (Ops + Support + Sales)", "No-Code Systems Engineering (n8n, Zapier, Make)", "End-to-End Funnel Automation"] },
  { slug: "ops-consulting", title: "Operations & Digital Consulting", tagline: "Fix the internal mess clients pretend they don't have.", items: ["Business Process Optimization", "Digital Transformation Roadmaps", "System Audits (Tech + Ops + Marketing)", "Brand Positioning & Communication Strategy", "Scaling Blueprints & Hiring Structure", "Automation Feasibility Planning", "Full Funnel Audits & Performance Breakdown", "SOP Development & Documentation"] },
  { slug: "custom-product-builds", title: "Custom Product Builds", tagline: "For when the client needs something beyond usual agency scope.", items: ["SaaS MVP Development", "Internal Dashboards & Admin Tools", "Custom Web Platforms", "Data-Driven Applications", "Advanced API Integrations", "Product Strategy + UX Architecture", "Prototype → Production Development", "Long-Term Tech Partnership & Support"] },
  { slug: "next-gen-services", title: 'Specialized "Next-Gen" Services', tagline: "Extraordinary category. This is where you stand out.", items: ["AI-Powered Chatbots & Assistants", "AI Automation Workflows (Internal + Customer-side)", "AI-Based Lead Qualification & Support Systems", "Data Visualization Dashboards", "Predictive Analytics Systems", "Automated Reporting Systems", "Custom AI Tools for Workflow Efficiency", "Intelligent Content & Campaign Generators"] },
  { slug: "done-for-you", title: '"Done-For-You" Scale Suite', tagline: "For brands that want end-to-end growth without micromanaging anything.", items: ["Full Digital Ecosystem Setup", "Brand + Website + CRM + Campaigns in One System", "Automated Lead Engine Deployment", "Monthly Growth Management", "Always-On Optimization Loops", "Quarterly Scale Strategy", "Dedicated Ops Support"] },
];

// Data fetching stays here, server-side, exactly as before — this page
// just hands the result to DesignServicesPage instead of rendering the
// Signature markup directly, so whichever design is active renders its
// own Services page composition with the same real service data.
export default async function ServicesPage() {
  const dbServices = await getPublishedServices();
  const pillars =
    dbServices.length > 0
      ? dbServices.map((s) => ({ slug: s.slug, title: s.title, tagline: s.shortDesc, items: s.benefits }))
      : FALLBACK_PILLARS;

  return <DesignServicesPage pillars={pillars} />;
}
