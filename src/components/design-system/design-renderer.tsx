"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDesign } from "./design-provider";
import { getAboutPageComponent, getServicesPageComponent, getTestimonialsPageComponent, getContactPageComponent, getPricingPageComponent, getPackagesPageComponent, getBlogPageComponent } from "@/designs/registry";
import type { PortfolioItem } from "@/components/sections/portfolio-showcase";
import type { TestimonialItem } from "@/components/sections/testimonials";
import type { FAQItem } from "@/components/sections/faq";
import type { AboutPageProps, ServicesPageProps, TestimonialsPageProps, PackagesPageProps, BlogPageProps } from "@/designs/types";

// Crossfades between designs. Keying the wrapper by designSlug is what
// makes this correct rather than just decorative: when the slug changes,
// React treats the old wrapper as a genuinely different element from the
// new one (not the same component re-rendering under new context), so
// AnimatePresence can properly animate the OLD design's content fading
// out while the NEW design's content fades in — a single wrapper keyed
// by state that changed under it wouldn't give a clean crossfade, since
// its content would jump to the new design mid-exit.
export function Crossfade({ designSlug, children }: { designSlug: string; children: React.ReactNode }) {
  // Respects prefers-reduced-motion: the fade+layout-swap that happens on
  // every design switch (and this fires a lot — 9+ times per page) is
  // exactly the kind of motion that setting exists to suppress. When set,
  // content still swaps correctly, it just appears instantly instead of
  // fading, with no other behavior change.
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeInOut" as const };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={designSlug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// The one client/server boundary this whole system needs. page.tsx stays a
// server component doing the real data fetching (getPublishedPortfolio(),
// getFeaturedTestimonials(), getPublishedFAQs() — unchanged, still hitting
// Prisma directly, still SSR'd); it just hands the results down as plain
// props here instead of rendering the Signature components directly. This
// component's only job is picking which design's components to mount —
// it holds no data-fetching logic of its own.
export function DesignHero() {
  const { design: Design, designSlug } = useDesign();
  return <Crossfade designSlug={designSlug}><Design.Hero /></Crossfade>;
}

export function DesignServices() {
  const { design: Design, designSlug } = useDesign();
  return <Crossfade designSlug={designSlug}><Design.Services /></Crossfade>;
}

export function DesignProcess() {
  const { design: Design, designSlug } = useDesign();
  return <Crossfade designSlug={designSlug}><Design.Process /></Crossfade>;
}

export function DesignLeadCapture() {
  const { design: Design, designSlug } = useDesign();
  return <Crossfade designSlug={designSlug}><Design.LeadCapture /></Crossfade>;
}

export function DesignPortfolio({ items }: { items: PortfolioItem[] }) {
  const { design: Design, designSlug } = useDesign();
  return <Crossfade designSlug={designSlug}><Design.Portfolio items={items} /></Crossfade>;
}

export function DesignTestimonials({ items }: { items: TestimonialItem[] }) {
  const { design: Design, designSlug } = useDesign();
  return <Crossfade designSlug={designSlug}><Design.Testimonials items={items} /></Crossfade>;
}

export function DesignFAQ({ items }: { items: FAQItem[] }) {
  const { design: Design, designSlug } = useDesign();
  return <Crossfade designSlug={designSlug}><Design.FAQ items={items} /></Crossfade>;
}

export function DesignAboutPage({ team }: AboutPageProps) {
  const { designSlug } = useDesign();
  const AboutPage = getAboutPageComponent(designSlug);
  return <Crossfade designSlug={designSlug}><AboutPage team={team} /></Crossfade>;
}

export function DesignServicesPage({ pillars }: ServicesPageProps) {
  const { designSlug } = useDesign();
  const ServicesPage = getServicesPageComponent(designSlug);
  return <Crossfade designSlug={designSlug}><ServicesPage pillars={pillars} /></Crossfade>;
}

export function DesignTestimonialsPage({ testimonials }: TestimonialsPageProps) {
  const { designSlug } = useDesign();
  const TestimonialsPage = getTestimonialsPageComponent(designSlug);
  return <Crossfade designSlug={designSlug}><TestimonialsPage testimonials={testimonials} /></Crossfade>;
}

export function DesignContactPage() {
  const { designSlug } = useDesign();
  const ContactPage = getContactPageComponent(designSlug);
  return <Crossfade designSlug={designSlug}><ContactPage /></Crossfade>;
}

export function DesignPricingPage() {
  const { designSlug } = useDesign();
  const PricingPage = getPricingPageComponent(designSlug);
  return <Crossfade designSlug={designSlug}><PricingPage /></Crossfade>;
}

export function DesignPackagesPage({ packages }: PackagesPageProps) {
  const { designSlug } = useDesign();
  const PackagesPage = getPackagesPageComponent(designSlug);
  return <Crossfade designSlug={designSlug}><PackagesPage packages={packages} /></Crossfade>;
}

export function DesignBlogPage({ posts }: BlogPageProps) {
  const { designSlug } = useDesign();
  const BlogPage = getBlogPageComponent(designSlug);
  return <Crossfade designSlug={designSlug}><BlogPage posts={posts} /></Crossfade>;
}
