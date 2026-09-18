import { MetadataRoute } from "next";
import { getPublishedBlogPosts, getPublishedServices, getPublishedPortfolio } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexscope.in";

// Used only if the database has no published services yet — must match the
// FALLBACK_PILLARS slugs in src/app/services/page.tsx, not an arbitrary
// guess, since a wrong slug here just points search engines at a 404.
const FALLBACK_SERVICE_SLUGS = [
  "digital-foundations",
  "brand-experience",
  "growth-marketing",
  "automation-systems",
  "ops-consulting",
  "custom-product-builds",
  "next-gen-services",
  "done-for-you",
];

// This used to be a hand-typed, static array — meaning any blog post added
// through /admin, and the real service slugs, were never actually reaching
// this file. Now it pulls from the same Prisma-backed content layer every
// page already uses, so the sitemap can never drift from what's actually
// published again.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, services, portfolio] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedServices(),
    getPublishedPortfolio(),
  ]);

  const serviceSlugs = services.length > 0 ? services.map((s) => s.slug) : FALLBACK_SERVICE_SLUGS;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/packages`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/testimonials`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/get-quote`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/careers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolio.map((project) => ({
    url: `${siteUrl}/portfolio/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...portfolioRoutes];
}
