import { CalendarDays, Clock } from "lucide-react";
import type { BlogPageProps } from "../types";

export function BrutalistBlogPage({ posts }: BlogPageProps) {
  return (
    <div className="pt-16 bg-[var(--color-cream)]">
      <section className="border-b-4 border-[var(--color-ink)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <p className="mb-4 inline-block border-2 border-[var(--color-ink)] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em]">Blog</p>
          <h1 className="font-display text-[clamp(2.2rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter text-[var(--color-ink)]">
            Insights & guides.
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="grid gap-0 sm:grid-cols-3">
            {posts.map((post, i) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group border-2 border-[var(--color-ink)] p-5 transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] ${i % 3 !== 0 ? "sm:-ml-0.5" : ""} ${i >= 3 ? "-mt-0.5" : ""}`}
              >
                <span className="inline-block border-2 border-current px-2 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-orange)]">
                  {post.category}
                </span>
                <h3 className="mt-3 font-display text-base font-black uppercase tracking-tight">{post.title}</h3>
                <p className="mt-2 text-xs font-medium opacity-70">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-wide opacity-60">
                  <span className="flex items-center gap-1"><CalendarDays size={11} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
