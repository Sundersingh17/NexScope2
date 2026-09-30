import { CalendarDays, Clock } from "lucide-react";
import type { BlogPageProps } from "../types";

export function SwissBlogPage({ posts }: BlogPageProps) {
  return (
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b border-[var(--color-ink)]/15 px-6 py-24 text-center sm:px-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-ink)]/60">Blog</p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Insights &amp; guides
        </h1>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl divide-y divide-[var(--color-ink)]/10">
          {posts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="group block py-8">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink)]/60">{post.category}</p>
              <h3 className="mt-2 text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-ink)]/60 transition-colors">{post.title}</h3>
              <p className="mt-1.5 text-sm font-light text-[var(--color-ink)]/60">{post.excerpt}</p>
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
