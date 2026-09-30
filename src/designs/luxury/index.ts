import { LuxuryNavbar } from "./navbar";
import { LuxuryHero } from "./hero";
import { LuxuryServices } from "./services";
import { LuxuryPortfolio } from "./portfolio";
import { LuxuryProcess } from "./process";
import { LuxuryTestimonials } from "./testimonials";
import { LuxuryFAQ } from "./faq";
import { LuxuryLeadCapture } from "./lead-capture";
import { LuxuryFooter } from "./footer";
import { LuxuryAboutPage } from "./about-page";
import { LuxuryServicesPage } from "./services-page";
import { LuxuryTestimonialsPage } from "./testimonials-page";
import { LuxuryContactPage } from "./contact-page";
import { LuxuryPricingPage } from "./pricing-page";
import { LuxuryPackagesPage } from "./packages-page";
import { LuxuryBlogPage } from "./blog-page";
import type { DesignSystem } from "../types";

// Design 03 — Luxury Editorial. Dark neutral palette (built from the same
// --color-ink/--color-cream/--color-yellow variables as every other
// design — "dark neutral + champagne/gold" comes from *which* semantic
// role each var plays here, not from a separate hardcoded palette), with
// Fraunces/Inter hardcoded directly for headings/body rather than routed
// through the swappable --font-family-display/--sans vars, because a
// serif editorial voice is core to this design's identity and shouldn't
// be silently overridden by an unrelated Look (color/font) preset pick.
export const luxuryDesign: DesignSystem = {
  slug: "luxury",
  name: "Luxury Editorial",
  description: "Cinematic, serif, dark — generous whitespace and a premium, unhurried feel.",
  previewColors: { bg: "#141414", ink: "#F5F0E6", accent: "#D4AF37" },
  recommendedLook: {
    // Warm near-black background, warm off-white text, and a proper
    // champagne/gold accent (Luxury's components lean on --color-yellow
    // as their primary accent throughout).
    colors: { cream: "#F5F0E6", paper: "#EDE4D3", ink: "#15130F", "ink-soft": "#2A251C", orange: "#B8925A", yellow: "#D4AF37", gray: "#8A8272" },
    fontPair: "fraunces-inter",
    design: "soft",
    mood: "none",
  },
  Navbar: LuxuryNavbar,
  Hero: LuxuryHero,
  Services: LuxuryServices,
  Portfolio: LuxuryPortfolio,
  Process: LuxuryProcess,
  Testimonials: LuxuryTestimonials,
  FAQ: LuxuryFAQ,
  LeadCapture: LuxuryLeadCapture,
  Footer: LuxuryFooter,
  AboutPage: LuxuryAboutPage,
  ServicesPage: LuxuryServicesPage,
  TestimonialsPage: LuxuryTestimonialsPage,
  ContactPage: LuxuryContactPage,
  PricingPage: LuxuryPricingPage,
  PackagesPage: LuxuryPackagesPage,
  BlogPage: LuxuryBlogPage,
};
