import { CalendarDays, Clock } from "lucide-react";
import type { BlogPageProps } from "../types";

const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-1"];

export function ExperimentalBlogPage({ posts }: BlogPageProps) {
  return (
    <div className="bg-[var(--color-cream)] pt-28">
      <section className="px-6 py-16 text-center">
        <p className="-rotate-2 mx-auto mb-4 inline-block border border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
          Blog
        </p>
        <h1 className="font-display text-[clamp(2.2rem,8vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]">
          Insights &amp; guides<span className="text-[var(--color-orange)]">.</span>
        </h1>
      </section>

      <section className="border-t border-[var(--color-ink)]/15 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          {posts.map((post, i) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className={`group border border-[var(--color-ink)] bg-[var(--color-paper)] p-5 transition-transform hover:rotate-0 ${ROTATIONS[i % ROTATIONS.length]}`}>
              <span className="inline-block border border-[var(--color-ink)] px-2 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-orange)]">{post.category}</span>
              <h3 className="mt-3 font-display text-sm font-black uppercase tracking-tight text-[var(--color-ink)]">{post.title}</h3>
              <p className="mt-2 text-xs font-medium text-[var(--color-ink)]/60">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--color-ink)]/60">
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
