import type { ComponentType } from "react";
import type { PortfolioItem } from "@/components/sections/portfolio-showcase";
import type { TestimonialItem } from "@/components/sections/testimonials";
import type { FAQItem } from "@/components/sections/faq";
import type { Look } from "@/lib/apply-look";

// Every design's Portfolio/Testimonials/FAQ components take the exact same
// props shape as the current (Signature) ones — this is the contract that
// keeps content flowing from the shared data layer (content.ts / Prisma)
// into whichever design is active, instead of each design inventing its
// own data shape. Navbar/Hero/Services/Process/LeadCapture/Footer take no
// props today (their content is either static copy shared across designs,
// or — for LeadCapture — internal form state), matching how the current
// site already works.
export interface PortfolioDesignProps {
  items?: PortfolioItem[];
}

export interface TestimonialsDesignProps {
  items?: TestimonialItem[];
}

export interface FAQDesignProps {
  items?: FAQItem[];
}

export interface TeamMemberDesignItem {
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
}

export interface AboutPageProps {
  team: TeamMemberDesignItem[];
}

export interface ServicePillar {
  slug: string;
  title: string;
  tagline: string;
  items: string[];
}

export interface ServicesPageProps {
  pillars: ServicePillar[];
}

export interface TestimonialsPageItem {
  name: string;
  company: string;
  role: string | null;
  content: string;
  rating: number;
  videoUrl?: string | null;
  featured: boolean;
}

export interface TestimonialsPageProps {
  testimonials: TestimonialsPageItem[];
}

export interface PackageView {
  slug: string;
  icon: string;
  color: string;
  title: string;
  signal: string;
  purpose: string;
  forWhom: string;
  outcome: string;
  items: string[];
}

export interface PackagesPageProps {
  packages: PackageView[];
}

export interface BlogPostCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
}

export interface BlogPageProps {
  posts: BlogPostCard[];
}

export interface DesignSystem {
  slug: string;
  name: string;
  /** One line, shown in the Design Studio picker. */
  description: string;
  /** Small swatch of colors used to render the picker preview tile without
   *  needing a real screenshot/thumbnail asset per design. */
  previewColors: { bg: string; ink: string; accent: string };
  /** The color/font/shape/mood combination this design was actually
   *  designed against. Applied automatically the moment a visitor picks
   *  this design in the Studio, so switching layout also switches the
   *  look — a visitor can still fine-tune colors afterward via the "Look"
   *  swatches, which simply overrides this. */
  recommendedLook: Look;

  Navbar: ComponentType;
  Hero: ComponentType;
  Services: ComponentType;
  Portfolio: ComponentType<PortfolioDesignProps>;
  Process: ComponentType;
  Testimonials: ComponentType<TestimonialsDesignProps>;
  FAQ: ComponentType<FAQDesignProps>;
  LeadCapture: ComponentType;
  Footer: ComponentType;
  /** Optional — designs that haven't built their own About page yet fall
   *  back to Signature's (see getAboutPageComponent() in registry.ts), so
   *  this can be added to a design incrementally without breaking it. */
  AboutPage?: ComponentType<AboutPageProps>;
  ServicesPage?: ComponentType<ServicesPageProps>;
  TestimonialsPage?: ComponentType<TestimonialsPageProps>;
  ContactPage?: ComponentType;
  PricingPage?: ComponentType;
  PackagesPage?: ComponentType<PackagesPageProps>;
  BlogPage?: ComponentType<BlogPageProps>;
}
