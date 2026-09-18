import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate, readingTime } from "@/lib/utils";
import { DesignBlogPage } from "@/components/design-system/design-renderer";
import type { BlogPostCard } from "@/designs/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, guides, and thought leadership on AI, design, development, and growth.",
};

// Shown only if the database has no published posts yet.
const FALLBACK_POSTS: BlogPostCard[] = [
  { slug: "ai-automation-guide-2026", title: "The Complete Guide to AI Automation in 2026", excerpt: "Discover how businesses are leveraging AI to automate workflows, reduce costs, and scale operations.", category: "AI & Automation", date: "June 12, 2026", readTime: "8 min read" },
  { slug: "web-design-trends-2026", title: "Web Design Trends That Will Define 2026", excerpt: "From dark mode dominance to micro-interactions — the design trends shaping the web this year.", category: "Design", date: "June 5, 2026", readTime: "6 min read" },
  { slug: "seo-strategy-2026", title: "SEO Strategy for 2026: What's Changed", excerpt: "Google's latest updates and how to adapt your SEO strategy for better rankings.", category: "Marketing", date: "May 28, 2026", readTime: "7 min read" },
];

async function getPosts(): Promise<BlogPostCard[]> {
  try {
    const rows = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    if (rows.length === 0) return FALLBACK_POSTS;
    return rows.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || "",
      category: p.category?.name || "General",
      date: formatDate(p.createdAt),
      readTime: `${p.readingTime ?? readingTime(p.content)} min read`,
    }));
  } catch (error) {
    console.error("Failed to load blog posts, using fallback:", error);
    return FALLBACK_POSTS;
  }
}

// Data fetching stays here, server-side, exactly as before — this page
// just hands the result to DesignBlogPage instead of rendering the
// Signature markup directly.
export default async function BlogPage() {
  const posts = await getPosts();
  return <DesignBlogPage posts={posts} />;
}
