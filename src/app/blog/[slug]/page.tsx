import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, readingTime } from "@/lib/utils";

interface PostView {
  title: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
}

// Fallback content for the original launch posts, used only if a matching
// row isn't found in the database (e.g. before the admin has migrated them
// into the CMS). Once a post with the same slug exists in the DB, the DB
// version is served instead.
const FALLBACK_POSTS: Record<string, PostView> = {
  "ai-automation-guide-2026": {
    title: "The Complete Guide to AI Automation in 2026",
    content: `
      <p>Artificial intelligence is no longer a futuristic concept — it's a practical tool that businesses of every size are using to transform their operations. In 2026, AI automation has become accessible, affordable, and essential for staying competitive.</p>
      <h2>Why AI Automation Matters Now</h2>
      <p>Companies leveraging AI automation report 30-50% reductions in operational costs, faster decision-making, and the ability to scale without proportional headcount increases.</p>
      <h2>Key Areas to Automate</h2>
      <p><strong>1. Customer Support:</strong> AI-powered chatbots handle up to 80% of routine inquiries, freeing your team for complex issues.</p>
      <p><strong>2. Data Processing:</strong> Automate data entry, report generation, and document processing with machine learning models.</p>
      <p><strong>3. Marketing:</strong> Personalize campaigns at scale with AI-driven content recommendations and audience segmentation.</p>
      <p><strong>4. Workflow Automation:</strong> Connect your tools with intelligent automation to eliminate manual handoffs.</p>
      <h2>Getting Started</h2>
      <p>Start small. Identify one repetitive process in your business, map it out, and explore how AI can streamline it.</p>
    `,
    category: "AI & Automation",
    date: "June 12, 2026",
    readTime: "8 min read",
  },
  "web-design-trends-2026": {
    title: "Web Design Trends That Will Define 2026",
    content: `
      <p>The web design landscape continues to evolve, and 2026 brings a fresh set of trends that prioritize user experience, performance, and visual sophistication.</p>
      <h2>1. Dark Mode as Default</h2>
      <p>More sites are launching with dark mode as the primary experience, reducing eye strain and creating a premium, modern feel.</p>
      <h2>2. Micro-Interactions</h2>
      <p>Subtle animations on hover, scroll, and click events create delightful experiences that keep users engaged.</p>
      <h2>3. Minimalist Typography</h2>
      <p>Bold, clean typography takes center stage. Variable fonts and generous spacing create hierarchy without clutter.</p>
      <h2>4. Performance-First Design</h2>
      <p>With Core Web Vitals being critical for SEO, designers are prioritizing lightweight assets, lazy loading, and optimized images.</p>
    `,
    category: "Design",
    date: "June 5, 2026",
    readTime: "6 min read",
  },
  "seo-strategy-2026": {
    title: "SEO Strategy for 2026: What's Changed",
    content: `
      <p>Google's ranking algorithms continue to evolve, placing greater emphasis on user experience, content quality, and technical excellence.</p>
      <h2>AI Overviews & Search Generative Experience</h2>
      <p>Google's AI-powered search results mean your content needs to be structured, authoritative, and directly answer user questions.</p>
      <h2>Core Web Vitals Are Non-Negotiable</h2>
      <p>LCP under 2.5s, FID under 100ms, and CLS under 0.1 are baseline requirements for ranking well.</p>
      <h2>E-E-A-T Matters More</h2>
      <p>Experience, Expertise, Authoritativeness, and Trustworthiness — Google evaluates these factors rigorously, especially for YMYL topics.</p>
      <h2>Content Strategy Shift</h2>
      <p>Quality over quantity. A single comprehensive, well-researched article outperforms dozens of thin posts.</p>
    `,
    category: "Marketing",
    date: "May 28, 2026",
    readTime: "7 min read",
  },
};

async function getPost(slug: string): Promise<PostView | null> {
  try {
    const row = await prisma.blog.findFirst({
      where: { slug, published: true },
      include: { category: true },
    });
    if (row) {
      return {
        title: row.title,
        content: row.content,
        category: row.category?.name || "General",
        date: formatDate(row.createdAt),
        readTime: `${row.readingTime ?? readingTime(row.content)} min read`,
      };
    }
  } catch (error) {
    console.error(`Failed to load blog post "${slug}" from DB, checking fallback:`, error);
  }
  return FALLBACK_POSTS[slug] ?? null;
}

// Only pre-renders the fallback slugs at build time; DB-backed posts render
// on demand (and get cached) the first time they're requested.
export function generateStaticParams() {
  return Object.keys(FALLBACK_POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.content.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      title: `${post.title} | NexScope Blog`,
      description: post.content.replace(/<[^>]*>/g, "").slice(0, 160),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="pt-28 bg-[var(--color-cream)]">
      <article className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <a href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-gray)] hover:text-[var(--color-orange)] transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Blog
          </a>

          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 text-[var(--color-ink)]">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[var(--color-gray)] mb-10">
            <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {post.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
          </div>

          <div
            className="prose prose-zinc max-w-none
              prose-headings:text-[var(--color-ink)] prose-headings:font-black prose-headings:tracking-tight prose-headings:font-display
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-[var(--color-ink)]/80 prose-p:leading-relaxed prose-p:mb-5
              prose-strong:text-[var(--color-ink)]
              prose-li:text-[var(--color-ink)]/80
              prose-a:text-[var(--color-orange)]
              [&_p]:text-base [&_p]:md:text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t-2 border-[var(--color-ink)]/10 text-center">
            <p className="text-[var(--color-gray)] mb-4">Ready to start your own project?</p>
            <Button href="/get-quote" size="lg" pop>
              Get a Free Quote <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
