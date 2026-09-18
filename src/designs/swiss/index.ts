import { SwissNavbar } from "./navbar";
import { SwissHero } from "./hero";
import { SwissServices } from "./services";
import { SwissPortfolio } from "./portfolio";
import { SwissProcess } from "./process";
import { SwissTestimonials } from "./testimonials";
import { SwissFAQ } from "./faq";
import { SwissLeadCapture } from "./lead-capture";
import { SwissFooter } from "./footer";
import { SwissAboutPage } from "./about-page";
import { SwissServicesPage } from "./services-page";
import { SwissTestimonialsPage } from "./testimonials-page";
import { SwissContactPage } from "./contact-page";
import { SwissPricingPage } from "./pricing-page";
import { SwissPackagesPage } from "./packages-page";
import { SwissBlogPage } from "./blog-page";
import type { DesignSystem } from "../types";

// Design 05 — Swiss Minimal. Strict grid, restrained monochrome palette,
// clean geometric sans typography, generous whitespace, near-zero
// decorative motion.
export const swissDesign: DesignSystem = {
  slug: "swiss",
  name: "Swiss Minimal",
  description: "Strict grid, monochrome, restrained — precise alignment and generous whitespace.",
  previewColors: { bg: "#FAFAFA", ink: "#0A0A0A", accent: "#0A0A0A" },
  recommendedLook: {
    // Deliberately near-monochrome — the "accent" colors are just dark
    // grays rather than a bright hue, which is what makes this read as
    // restrained rather than just "another palette."
    colors: { cream: "#FAFAFA", paper: "#F0F0F0", ink: "#0A0A0A", "ink-soft": "#333333", orange: "#1A1A1A", yellow: "#4D4D4D", gray: "#8A8A8A" },
    fontPair: "grotesk-archivo",
    design: "sharp",
    mood: "none",
  },
  Navbar: SwissNavbar,
  Hero: SwissHero,
  Services: SwissServices,
  Portfolio: SwissPortfolio,
  Process: SwissProcess,
  Testimonials: SwissTestimonials,
  FAQ: SwissFAQ,
  LeadCapture: SwissLeadCapture,
  Footer: SwissFooter,
  AboutPage: SwissAboutPage,
  ServicesPage: SwissServicesPage,
  TestimonialsPage: SwissTestimonialsPage,
  ContactPage: SwissContactPage,
  PricingPage: SwissPricingPage,
  PackagesPage: SwissPackagesPage,
  BlogPage: SwissBlogPage,
};
