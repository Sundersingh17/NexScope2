import { signatureDesign } from "./signature";
import { brutalistDesign } from "./brutalist";
import { luxuryDesign } from "./luxury";
import { futuristicDesign } from "./futuristic";
import { swissDesign } from "./swiss";
import { experimentalDesign } from "./experimental";
import type { DesignSystem } from "./types";

// Adding Design 07, etc. later is exactly this: build a new
// src/designs/<slug>/ folder that implements the DesignSystem contract,
// then add one line here. Nothing else in the app needs to change —
// page.tsx and site-chrome.tsx only ever ask the registry for "the active
// design," they never know how many designs exist.
export const DESIGN_REGISTRY: Record<string, DesignSystem> = {
  signature: signatureDesign,
  brutalist: brutalistDesign,
  luxury: luxuryDesign,
  futuristic: futuristicDesign,
  swiss: swissDesign,
  experimental: experimentalDesign,
};

export const DEFAULT_DESIGN_SLUG = "signature";

export function getDesignPreset(slug: string | null | undefined): DesignSystem {
  if (slug && DESIGN_REGISTRY[slug]) return DESIGN_REGISTRY[slug];
  return DESIGN_REGISTRY[DEFAULT_DESIGN_SLUG];
}

// Falls back to Signature's AboutPage when the active design hasn't built
// its own yet — this is what lets a page-level slot be added to the
// contract incrementally (see the AboutPage? optional field in types.ts)
// without every existing design breaking.
export function getAboutPageComponent(slug: string | null | undefined) {
  const design = getDesignPreset(slug);
  return design.AboutPage || DESIGN_REGISTRY[DEFAULT_DESIGN_SLUG].AboutPage!;
}

export function getServicesPageComponent(slug: string | null | undefined) {
  const design = getDesignPreset(slug);
  return design.ServicesPage || DESIGN_REGISTRY[DEFAULT_DESIGN_SLUG].ServicesPage!;
}

export function getTestimonialsPageComponent(slug: string | null | undefined) {
  const design = getDesignPreset(slug);
  return design.TestimonialsPage || DESIGN_REGISTRY[DEFAULT_DESIGN_SLUG].TestimonialsPage!;
}

export function getContactPageComponent(slug: string | null | undefined) {
  const design = getDesignPreset(slug);
  return design.ContactPage || DESIGN_REGISTRY[DEFAULT_DESIGN_SLUG].ContactPage!;
}

export function getPricingPageComponent(slug: string | null | undefined) {
  const design = getDesignPreset(slug);
  return design.PricingPage || DESIGN_REGISTRY[DEFAULT_DESIGN_SLUG].PricingPage!;
}

export function getPackagesPageComponent(slug: string | null | undefined) {
  const design = getDesignPreset(slug);
  return design.PackagesPage || DESIGN_REGISTRY[DEFAULT_DESIGN_SLUG].PackagesPage!;
}

export function getBlogPageComponent(slug: string | null | undefined) {
  const design = getDesignPreset(slug);
  return design.BlogPage || DESIGN_REGISTRY[DEFAULT_DESIGN_SLUG].BlogPage!;
}

export const DESIGN_LIST: DesignSystem[] = Object.values(DESIGN_REGISTRY);
