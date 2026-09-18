"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface PortfolioItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  client?: string;
  url?: string;
  image?: string;
  videoUrl?: string;
  testimonial?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  process?: string;
}

const BG_VARIANTS = [
  "bg-[var(--color-orange)] text-[var(--color-cream)]",
  "bg-[var(--color-ink)] text-[var(--color-yellow)]",
  "bg-[var(--color-yellow)] text-[var(--color-ink)]",
  "bg-[var(--color-paper)] text-[var(--color-ink)]",
];

function shortCodeFor(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// Shown only if the database has no published portfolio items yet.
const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  { slug: "business-website", title: "Business Website", description: "A premium corporate website with CMS integration and lightning-fast performance.", category: "Web Development" },
  { slug: "ecommerce-store", title: "E-commerce Store", description: "Full-featured online store with custom checkout and inventory management.", category: "E-Commerce" },
  { slug: "ai-automation-system", title: "AI Automation System", description: "Intelligent workflow automation reducing manual processing by 80%.", category: "AI / Automation" },
  { slug: "brand-identity-project", title: "Brand Identity Project", description: "Complete brand overhaul including logo, guidelines, and marketing collateral.", category: "Brand Identity" },
];

export function PortfolioShowcase({ items }: { items?: PortfolioItem[] }) {
  const projects = items && items.length > 0 ? items : FALLBACK_PORTFOLIO;
  const [activeCategory, setActiveCategory] = useState("All work");
  const categories = ["All work", ...Array.from(new Set(projects.map((project) => project.category)))];
  const visibleProjects = activeCategory === "All work"
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  return (
    <section id="work" className="scroll-mt-20 border-y-2 border-[var(--color-ink)] bg-[var(--color-paper)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold tracking-[0.2em] text-[var(--color-orange)]">
              SELECTED WORK
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
              Built by us. Loved by clients.
            </h2>
          </div>
          <p className="max-w-xs text-sm font-medium text-[var(--color-ink)]/60">
            A few of the brands we design, build and automate for.
          </p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="Filter portfolio projects">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border-2 border-[var(--color-ink)] px-4 py-2 text-xs font-bold transition-colors ${activeCategory === category ? "bg-[var(--color-ink)] text-[var(--color-cream)]" : "bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-yellow)]"}`}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:gap-6">
          <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, i) => {
            const CardWrapper = motion.a;
            const wrapperProps = { href: `/portfolio/${project.slug}` };
            const bgClass = BG_VARIANTS[i % BG_VARIANTS.length];

            return (
              <CardWrapper
                key={project.slug}
                {...wrapperProps}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover="hover"
                className="group block overflow-hidden rounded-xl border-2 border-[var(--color-ink)] shadow-[4px_4px_0_0_#141414] sm:rounded-3xl sm:shadow-[7px_7px_0_0_#141414] cursor-pointer"
              >
                <div className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden ${bgClass}`}>
                  {project.image ? (
                    <img src={project.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : null}
                  <motion.span
                    variants={{ hover: { scale: 1.12, rotate: -4 } }}
                    transition={{ type: "spring", bounce: 0.3 }}
                    className="font-display text-[3.25rem] font-black tracking-tighter opacity-90 sm:text-[6rem] lg:text-[7.5rem]"
                  >
                    {shortCodeFor(project.title)}
                  </motion.span>

                  <span className="absolute right-2 top-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-2 py-0.5 font-display text-[0.5rem] font-bold tracking-[0.1em] text-[var(--color-ink)] sm:right-4 sm:top-4 sm:px-3 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.14em]">
                    {project.category}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 border-t-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-3 py-3 sm:px-6 sm:py-5">
                  <h3 className="truncate font-display text-sm font-black tracking-tight sm:text-xl lg:text-2xl">
                    {project.title}
                  </h3>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-[var(--color-ink)] transition-colors group-hover:bg-[var(--color-orange)] group-hover:text-[var(--color-cream)] sm:size-10">
                    <svg viewBox="0 0 24 24" className="size-3 transition-transform group-hover:translate-x-0.5 sm:size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </CardWrapper>
            );
          })}
          </AnimatePresence>
        </div>
        {visibleProjects.length === 0 && <p className="mt-12 text-center text-sm text-[var(--color-gray)]">More work in this category is on the way.</p>}
      </div>
    </section>
  );
}
