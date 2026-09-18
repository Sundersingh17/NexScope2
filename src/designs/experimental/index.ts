import { ExperimentalNavbar } from "./navbar";
import { ExperimentalHero } from "./hero";
import { ExperimentalServices } from "./services";
import { ExperimentalPortfolio } from "./portfolio";
import { ExperimentalProcess } from "./process";
import { ExperimentalTestimonials } from "./testimonials";
import { ExperimentalFAQ } from "./faq";
import { ExperimentalLeadCapture } from "./lead-capture";
import { ExperimentalFooter } from "./footer";
import type { DesignSystem } from "../types";

// Design 06 — Experimental. Corner-anchored circular menu instead of a
// nav bar, horizontal scroll-snap galleries for Services/Portfolio,
// playful rotated cards throughout. The "unconventional" feel is achieved
// structurally (layout, rotation, scroll-snap) rather than through heavy
// JS-driven cursor effects, so it stays calm and usable under
// prefers-reduced-motion — rotations and hover-lifts are static/
// hover-triggered, not autoplaying. Page-level slots (AboutPage,
// ServicesPage, etc.) aren't built yet and fall back to Signature's.
export const experimentalDesign: DesignSystem = {
  slug: "experimental",
  name: "Experimental",
  description: "Playful and unconventional — a circular menu, scroll-snap galleries, tilted cards.",
  previewColors: { bg: "#FBF7EE", ink: "#141414", accent: "#FF4D00" },
  recommendedLook: {
    colors: { cream: "#FBF7EE", paper: "#F3EDE2", ink: "#141414", "ink-soft": "#2A2622", orange: "#FF4D00", yellow: "#FFC72E", gray: "#6B6B62" },
    fontPair: "grotesk-archivo",
    design: "sharp",
    mood: "none",
  },
  Navbar: ExperimentalNavbar,
  Hero: ExperimentalHero,
  Services: ExperimentalServices,
  Portfolio: ExperimentalPortfolio,
  Process: ExperimentalProcess,
  Testimonials: ExperimentalTestimonials,
  FAQ: ExperimentalFAQ,
  LeadCapture: ExperimentalLeadCapture,
  Footer: ExperimentalFooter,
};
