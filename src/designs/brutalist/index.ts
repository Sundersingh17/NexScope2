import { BrutalistNavbar } from "./navbar";
import { BrutalistHero } from "./hero";
import { BrutalistServices } from "./services";
import { BrutalistPortfolio } from "./portfolio";
import { BrutalistProcess } from "./process";
import { BrutalistTestimonials } from "./testimonials";
import { BrutalistFAQ } from "./faq";
import { BrutalistLeadCapture } from "./lead-capture";
import { BrutalistFooter } from "./footer";
import { BrutalistAboutPage } from "./about-page";
import { BrutalistServicesPage } from "./services-page";
import { BrutalistTestimonialsPage } from "./testimonials-page";
import { BrutalistContactPage } from "./contact-page";
import { BrutalistPricingPage } from "./pricing-page";
import { BrutalistPackagesPage } from "./packages-page";
import { BrutalistBlogPage } from "./blog-page";
import type { DesignSystem } from "../types";

// Design 02 — the proof-of-concept alternate design. Genuinely different
// composition (fullscreen menu vs. dropdown, numbered list vs. card grid,
// bento portfolio vs. filtered grid, single-step form vs. two-step) while
// consuming the exact same portfolio/testimonials/FAQ data as Signature.
export const brutalistDesign: DesignSystem = {
  slug: "brutalist",
  name: "Brutalist",
  description: "Oversized type, hard borders, zero decoration. Direct and aggressive.",
  previewColors: { bg: "#F1F1EC", ink: "#0A0A0A", accent: "#FF4D00" },
  recommendedLook: {
    // A punchier, higher-contrast palette than Signature's, and hard
    // square corners to match the borders every Brutalist component
    // already draws by hand.
    colors: { cream: "#F1F1EC", paper: "#E4E4DC", ink: "#0A0A0A", "ink-soft": "#262626", orange: "#FF3B00", yellow: "#F5D400", gray: "#5A5A52" },
    fontPair: "syne-manrope",
    design: "sharp",
    mood: "none",
  },
  Navbar: BrutalistNavbar,
  Hero: BrutalistHero,
  Services: BrutalistServices,
  Portfolio: BrutalistPortfolio,
  Process: BrutalistProcess,
  Testimonials: BrutalistTestimonials,
  FAQ: BrutalistFAQ,
  LeadCapture: BrutalistLeadCapture,
  Footer: BrutalistFooter,
  AboutPage: BrutalistAboutPage,
  ServicesPage: BrutalistServicesPage,
  TestimonialsPage: BrutalistTestimonialsPage,
  ContactPage: BrutalistContactPage,
  PricingPage: BrutalistPricingPage,
  PackagesPage: BrutalistPackagesPage,
  BlogPage: BrutalistBlogPage,
};
