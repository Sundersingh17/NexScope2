import type { PortfolioDesignProps } from "../types";
import type { PortfolioItem } from "@/components/sections/portfolio-showcase";
import Image from "next/image";

const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  {
    slug: "business-website",
    title: "Business Website",
    description:
      "A premium corporate website with CMS integration and lightning-fast performance.",
    category: "Web Development",
  },
  {
    slug: "ecommerce-store",
    title: "E-commerce Store",
    description:
      "Full-featured online store with custom checkout and inventory management.",
    category: "E-Commerce",
  },
  {
    slug: "ai-automation-system",
    title: "AI Automation System",
    description:
      "Intelligent workflow automation reducing manual processing by 80%.",
    category: "AI / Automation",
  },
  {
    slug: "brand-identity-project",
    title: "Brand Identity Project",
    description:
      "Complete brand overhaul including logo, guidelines, and marketing collateral.",
    category: "Brand Identity",
  },
];

export function FuturisticPortfolio({ items }: PortfolioDesignProps) {
  const projects = items && items.length > 0 ? items : FALLBACK_PORTFOLIO;

  return (
    <section className="bg-[var(--color-ink)] px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-orange)]">
          Selected Work
        </p>

        <h2 className="mb-14 text-center font-display text-3xl font-bold text-[var(--color-cream)] sm:text-5xl">
          Recent builds
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.03] backdrop-blur-sm transition-all hover:border-[var(--color-orange)]/40 hover:shadow-[0_0_40px_-12px_var(--color-orange)]"
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--color-orange)]/15 to-[var(--color-yellow)]/10">
                {project.image && (
                  <Image
                    src={project.image}
                    unoptimized
                    alt={project.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              <div className="p-5">
                <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-orange)]">
                  {project.category}
                </span>

                <h3 className="mt-1.5 font-display text-lg font-bold text-[var(--color-cream)]">
                  {project.title}
                </h3>

                <p className="mt-1.5 text-xs font-light leading-relaxed text-[var(--color-cream)]/60">
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}