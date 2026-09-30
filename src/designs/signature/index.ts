import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { PortfolioShowcase } from "@/components/sections/portfolio-showcase";
import { ProcessSection } from "@/components/sections/process";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq";
import { LeadCaptureSection } from "@/components/sections/lead-capture";
import { SignatureAboutPage } from "./about-page";
import { SignatureServicesPage } from "./services-page";
import { SignatureTestimonialsPage } from "./testimonials-page";
import { SignatureContactPage } from "./contact-page";
import { SignaturePricingPage } from "./pricing-page";
import { SignaturePackagesPage } from "./packages-page";
import { SignatureBlogPage } from "./blog-page";
import type { DesignSystem } from "../types";

// Design 01 — the current, existing NexScope site. This file changes
// nothing about how the site looks or works; it just packages the
// existing components under the DesignSystem contract so the registry has
// something to point "signature" at. This is what guarantees zero
// regression: nobody who never touches the Design Studio ever sees
// anything different.
export const signatureDesign: DesignSystem = {
  slug: "signature",
  name: "Signature",
  description: "The current NexScope site — bold, direct, high-energy.",
  previewColors: { bg: "#FBF7EE", ink: "#141414", accent: "#FF4D00" },
  recommendedLook: {
    colors: { cream: "#FBF7EE", paper: "#F3EDE2", ink: "#141414", "ink-soft": "#2A2622", orange: "#FF4D00", yellow: "#FFC72E", gray: "#6B6B62" },
    fontPair: "grotesk-archivo",
    design: "signature",
    mood: "none",
  },
  Navbar,
  Hero: HeroSection,
  Services: ServicesSection,
  Portfolio: PortfolioShowcase,
  Process: ProcessSection,
  Testimonials: TestimonialsSection,
  FAQ: FAQSection,
  LeadCapture: LeadCaptureSection,
  Footer,
  AboutPage: SignatureAboutPage,
  ServicesPage: SignatureServicesPage,
  TestimonialsPage: SignatureTestimonialsPage,
  ContactPage: SignatureContactPage,
  PricingPage: SignaturePricingPage,
  PackagesPage: SignaturePackagesPage,
  BlogPage: SignatureBlogPage,
};
