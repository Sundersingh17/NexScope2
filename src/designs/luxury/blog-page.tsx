import { CalendarDays, Clock } from "lucide-react";
import type { BlogPageProps } from "../types";

export function LuxuryBlogPage({ posts }: BlogPageProps) {
  return (
    <div className="pt-20 bg-[var(--color-cream)]">
      <section className="bg-[var(--color-ink)] px-6 py-28 text-center sm:px-10">
        <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-yellow)]/80">Blog</p>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mx-auto max-w-2xl text-4xl font-medium text-[var(--color-cream)] sm:text-6xl">
          Insights <span className="italic text-[var(--color-yellow)]">&amp; guides</span>
        </h1>
      </section>

      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl divide-y divide-[var(--color-ink)]/10">
          {posts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="group block py-8">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[var(--color-yellow)]/80">{post.category}</p>
              <h3 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mt-2 text-xl font-medium text-[var(--color-ink)] group-hover:text-[var(--color-yellow)] transition-colors">
                {post.title}
              </h3>
              <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-2 text-sm font-light text-[var(--color-ink)]/60">{post.excerpt}</p>
              <div className="mt-3 flex items-center gap-4 text-xs font-light text-[var(--color-ink)]/60">
                <span className="flex items-center gap-1.5"><CalendarDays size={12} /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
