import type { PortfolioDesignProps } from "../types";
import Image from "next/image";

const FALLBACK_PORTFOLIO = [
  { slug: "business-website", title: "Business Website", description: "A premium corporate website with CMS integration and lightning-fast performance.", category: "Web Development" },
  { slug: "ecommerce-store", title: "E-commerce Store", description: "Full-featured online store with custom checkout and inventory management.", category: "E-Commerce" },
  { slug: "ai-automation-system", title: "AI Automation System", description: "Intelligent workflow automation reducing manual processing by 80%.", category: "AI / Automation" },
  { slug: "brand-identity-project", title: "Brand Identity Project", description: "Complete brand overhaul including logo, guidelines, and marketing collateral.", category: "Brand Identity" },
];

export function LuxuryPortfolio({ items }: PortfolioDesignProps) {
  const projects = items && items.length > 0 ? items : FALLBACK_PORTFOLIO;

  return (
    <section className="bg-[var(--color-cream)] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.3em] text-[var(--color-ink)]/60">Selected Work</p>
        <h2 style={{ fontFamily: "var(--font-fraunces), serif" }} className="mb-20 text-center text-4xl font-medium text-[var(--color-ink)] sm:text-5xl">
          Case studies
        </h2>
        <div className="space-y-20 sm:space-y-28">
          {projects.map((project, i) => (
            <a
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className={`group grid gap-6 sm:grid-cols-2 sm:items-center sm:gap-12 ${i % 2 === 1 ? "sm:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-paper)]">
                {project.image ? (
                  <Image src={project.image} unoptimized alt={project.title} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-6xl italic text-[var(--color-ink)]/60">{project.title[0]}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[var(--color-yellow)]/80">{project.category}</p>
                <h3 style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-2xl font-medium text-[var(--color-ink)] group-hover:text-[var(--color-yellow)] transition-colors sm:text-3xl">
                  {project.title}
                </h3>
                <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="mt-3 max-w-sm text-sm font-light leading-relaxed text-[var(--color-ink)]/60">
                  {project.description}
                </p>
                <span className="mt-5 inline-block border-b border-[var(--color-ink)]/40 pb-0.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)]/70 group-hover:border-[var(--color-yellow)] group-hover:text-[var(--color-yellow)] transition-colors">
                  View case study
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
