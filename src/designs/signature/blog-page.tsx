import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RevealCard } from "@/components/ui/reveal-card";
import type { BlogPageProps } from "../types";

export function SignatureBlogPage({ posts }: BlogPageProps) {
  return (
    <div className="pt-28">
      <section className="py-16 md:py-20 bg-[var(--color-cream)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4">Blog</Badge>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-12 text-[var(--color-ink)]">
            Insights &amp; Guides
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <RevealCard key={post.slug} delay={i * 0.08} hover={false} className="h-full">
                <a href={`/blog/${post.slug}`} className="group block h-full rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 shadow-neo-sm transition-shadow hover:shadow-neo-md">
                  <span className="font-display text-[0.6rem] font-bold tracking-wider uppercase text-[var(--color-orange)] border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <h3 className="font-display text-lg font-black mt-3 mb-2 text-[var(--color-ink)] group-hover:text-[var(--color-orange)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-gray)]">
                    <span className="flex items-center gap-1.5"><CalendarDays size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                  </div>
                </a>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
