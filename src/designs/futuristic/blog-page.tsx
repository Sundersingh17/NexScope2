import { CalendarDays, Clock } from "lucide-react";
import type { BlogPageProps } from "../types";

export function FuturisticBlogPage({ posts }: BlogPageProps) {
  return (
    <div className="bg-[var(--color-ink)] pt-24">
      <section className="relative overflow-hidden px-4 py-16 text-center">
        <div className="nx-futuristic-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-xl">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">Blog</p>
          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold text-[var(--color-cream)]">Insights &amp; guides</h1>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="group rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] p-6 backdrop-blur-sm transition-all hover:border-[var(--color-orange)]/40">
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-orange)]">{post.category}</span>
              <h3 className="mt-2 font-display text-base font-bold text-[var(--color-cream)] group-hover:text-[var(--color-yellow)] transition-colors">{post.title}</h3>
              <p className="mt-2 text-xs font-light text-[var(--color-cream)]/60">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-[0.65rem] font-light text-[var(--color-cream)]/60">
                <span className="flex items-center gap-1"><CalendarDays size={11} /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
