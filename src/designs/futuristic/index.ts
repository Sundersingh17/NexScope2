import { FuturisticNavbar } from "./navbar";
import { FuturisticHero } from "./hero";
import { FuturisticServices } from "./services";
import { FuturisticPortfolio } from "./portfolio";
import { FuturisticProcess } from "./process";
import { FuturisticTestimonials } from "./testimonials";
import { FuturisticFAQ } from "./faq";
import { FuturisticLeadCapture } from "./lead-capture";
import { FuturisticFooter } from "./footer";
import { FuturisticAboutPage } from "./about-page";
import { FuturisticServicesPage } from "./services-page";
import { FuturisticTestimonialsPage } from "./testimonials-page";
import { FuturisticContactPage } from "./contact-page";
import { FuturisticPricingPage } from "./pricing-page";
import { FuturisticPackagesPage } from "./packages-page";
import { FuturisticBlogPage } from "./blog-page";
import type { DesignSystem } from "../types";

// Design 04 — Futuristic Digital. Dark immersive background, glass
// surfaces (backdrop-blur + translucent borders), glowing accents,
// animated gradients, Syne for that bold/tech display voice.
export const futuristicDesign: DesignSystem = {
  slug: "futuristic",
  name: "Futuristic",
  description: "Dark, glowing, glass surfaces — animated gradients and an immersive, tech-forward feel.",
  previewColors: { bg: "#0A0A0F", ink: "#F5F0E6", accent: "#FF6B2C" },
  recommendedLook: {
    colors: { cream: "#F2F0EC", paper: "#E8E5DE", ink: "#0A0A0F", "ink-soft": "#1A1A22", orange: "#FF6B2C", yellow: "#FFB84D", gray: "#7A7A85" },
    fontPair: "syne-manrope",
    design: "soft",
    mood: "none",
  },
  Navbar: FuturisticNavbar,
  Hero: FuturisticHero,
  Services: FuturisticServices,
  Portfolio: FuturisticPortfolio,
  Process: FuturisticProcess,
  Testimonials: FuturisticTestimonials,
  FAQ: FuturisticFAQ,
  LeadCapture: FuturisticLeadCapture,
  Footer: FuturisticFooter,
  AboutPage: FuturisticAboutPage,
  ServicesPage: FuturisticServicesPage,
  TestimonialsPage: FuturisticTestimonialsPage,
  ContactPage: FuturisticContactPage,
  PricingPage: FuturisticPricingPage,
  PackagesPage: FuturisticPackagesPage,
  BlogPage: FuturisticBlogPage,
};
