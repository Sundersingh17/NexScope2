import { prisma } from "@/lib/prisma";
import type { TestimonialItem } from "@/components/sections/testimonials";
import type { PortfolioItem } from "@/components/sections/portfolio-showcase";

const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  { slug: "business-website", title: "Business Website", description: "A premium corporate website with CMS integration and lightning-fast performance.", category: "Web Development" },
  { slug: "ecommerce-store", title: "E-commerce Store", description: "Full-featured online store with custom checkout and inventory management.", category: "E-Commerce" },
  { slug: "ai-automation-system", title: "AI Automation System", description: "Intelligent workflow automation reducing manual processing by 80%.", category: "AI / Automation" },
  { slug: "brand-identity-project", title: "Brand Identity Project", description: "Complete brand overhaul including logo, guidelines, and marketing collateral.", category: "Brand Identity" },
];

/**
 * Server-side data access for public pages. Each function is defensive:
 * if the database is unreachable or empty, it returns [] rather than
 * throwing, so a page render never breaks because the DB had a hiccup —
 * the calling component falls back to its own placeholder content instead.
 */

function initialsFromName(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function getFeaturedTestimonials(limit = 3): Promise<TestimonialItem[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return rows.map((t) => ({
      initials: initialsFromName(t.name),
      name: t.name,
      company: t.company,
      role: t.role ? `${t.role}, ${t.company}` : t.company,
      content: t.content,
      rating: t.rating,
      videoUrl: t.videoUrl || undefined,
      isSample: t.isSample,
    }));
  } catch (error) {
    console.error("getFeaturedTestimonials failed, falling back:", error);
    return [];
  }
}

export async function getAllTestimonials(): Promise<TestimonialItem[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map((t) => ({
      initials: initialsFromName(t.name),
      name: t.name,
      company: t.company,
      role: t.role ? `${t.role}, ${t.company}` : t.company,
      content: t.content,
      rating: t.rating,
      videoUrl: t.videoUrl || undefined,
      isSample: t.isSample,
    }));
  } catch (error) {
    console.error("getAllTestimonials failed, falling back:", error);
    return [];
  }
}

export async function getPublishedPortfolio(limit?: number): Promise<PortfolioItem[]> {
  try {
    const rows = await prisma.portfolio.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      ...(limit ? { take: limit } : {}),
    });
    return rows.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: p.category || "Project",
      client: p.client || undefined,
      url: p.url || undefined,
      image: p.images ? (() => { try { const parsed = JSON.parse(p.images); return Array.isArray(parsed) ? parsed[0] : p.images; } catch { return p.images; } })() : undefined,
      videoUrl: p.videoUrl || undefined,
      testimonial: p.testimonial || undefined,
      challenge: p.challenge || undefined,
      solution: p.solution || undefined,
      results: p.results || undefined,
      process: p.process || undefined,
    }));
  } catch (error) {
    console.error("getPublishedPortfolio failed, falling back:", error);
    return [];
  }
}

export async function getPublishedPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  try {
    const p = await prisma.portfolio.findFirst({ where: { slug, published: true } });
    if (!p) return FALLBACK_PORTFOLIO.find((project) => project.slug === slug) || null;
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: p.category || "Project",
      client: p.client || undefined,
      url: p.url || undefined,
      image: p.images ? (() => { try { const parsed = JSON.parse(p.images); return Array.isArray(parsed) ? parsed[0] : p.images; } catch { return p.images; } })() : undefined,
      videoUrl: p.videoUrl || undefined,
      testimonial: p.testimonial || undefined,
      challenge: p.challenge || undefined,
      solution: p.solution || undefined,
      results: p.results || undefined,
      process: p.process || undefined,
    };
  } catch (error) {
    console.error(`getPublishedPortfolioBySlug("${slug}") failed:`, error);
    return FALLBACK_PORTFOLIO.find((project) => project.slug === slug) || null;
  }
}

export async function getPublishedBlogPosts() {
  try {
    return await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { category: true, author: { select: { name: true } } },
    });
  } catch (error) {
    console.error("getPublishedBlogPosts failed, falling back:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await prisma.blog.findFirst({
      where: { slug, published: true },
      include: { category: true, author: { select: { name: true } } },
    });
  } catch (error) {
    console.error("getBlogPostBySlug failed:", error);
    return null;
  }
}

export interface ServiceListItem {
  slug: string;
  title: string;
  shortDesc: string;
  benefits: string[];
}

export interface ServiceDetail {
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  benefits: string[];
  process: { title: string; desc: string }[];
}

/** benefits/process are stored as JSON strings in Prisma; parse defensively
 *  since hand-edited or malformed JSON shouldn't crash a page render. */
function parseJsonArray<T>(raw: string | null, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export async function getPublishedServices(): Promise<ServiceListItem[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map((s) => ({
      slug: s.slug,
      title: s.title,
      shortDesc: s.shortDesc,
      benefits: parseJsonArray<string>(s.benefits, []),
    }));
  } catch (error) {
    console.error("getPublishedServices failed, falling back:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  try {
    const row = await prisma.service.findFirst({ where: { slug, published: true } });
    if (!row) return null;
    return {
      slug: row.slug,
      title: row.title,
      shortDesc: row.shortDesc,
      description: row.description,
      benefits: parseJsonArray<string>(row.benefits, []),
      process: parseJsonArray<{ title: string; desc: string }>(row.process, []),
    };
  } catch (error) {
    console.error(`getServiceBySlug("${slug}") failed:`, error);
    return null;
  }
}

export async function getPublishedFAQs(): Promise<{ q: string; a: string }[]> {
  try {
    const rows = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map((f) => ({ q: f.question, a: f.answer }));
  } catch (error) {
    console.error("getPublishedFAQs failed, falling back:", error);
    return [];
  }
}

export interface ThemePresetItem {
  slug: string;
  name: string;
  colors: Record<string, string>;
  fontPair: string;
  design: string;
  mood: string;
  isDefault: boolean;
}

export async function getPublishedThemePresets(): Promise<ThemePresetItem[]> {
  try {
    const rows = await prisma.themePreset.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map((t) => ({
      slug: t.slug,
      name: t.name,
      colors: JSON.parse(t.colors),
      fontPair: t.fontPair,
      design: t.design,
      mood: t.mood,
      isDefault: t.isDefault,
    }));
  } catch (error) {
    console.error("getPublishedThemePresets failed, falling back:", error);
    return [];
  }
}

export interface PackageListItem {
  slug: string;
  title: string;
  icon: string;
  color: string;
  signal: string;
  purpose: string;
  forWhom: string;
  outcome: string;
  items: string[];
}

export async function getPublishedPackages(): Promise<PackageListItem[]> {
  try {
    const rows = await prisma.package.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map((p) => ({
      slug: p.slug,
      title: p.title,
      icon: p.icon,
      color: p.color,
      signal: p.signal,
      purpose: p.purpose,
      forWhom: p.forWhom,
      outcome: p.outcome,
      items: parseJsonArray<string>(p.items, []),
    }));
  } catch (error) {
    console.error("getPublishedPackages failed, falling back:", error);
    return [];
  }
}

export interface TeamMemberListItem {
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
}

export async function getPublishedTeamMembers(): Promise<TeamMemberListItem[]> {
  try {
    const rows = await prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map((m) => ({ name: m.name, role: m.role, bio: m.bio, image: m.image }));
  } catch (error) {
    console.error("getPublishedTeamMembers failed, falling back:", error);
    return [];
  }
}
