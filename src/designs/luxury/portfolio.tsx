import type { PortfolioDesignProps } from "../types";
import type { PortfolioItem } from "@/components/sections/portfolio-showcase";
import Image from "next/image";

const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  {
    slug: "project-1",
    title: "Residential Villa",
    description: "A contemporary residential project.",
    category: "Residential",
  },
  {
    slug: "project-2",
    title: "Luxury Interior",
    description: "An elegant interior design project.",
    category: "Interior",
  },
  {
    slug: "project-3",
    title: "Commercial Space",
    description: "A sophisticated commercial development.",
    category: "Commercial",
  },
];

export function LuxuryPortfolio({ items }: PortfolioDesignProps) {
  const projects = items?.length ? items : FALLBACK_PORTFOLIO;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Selected Work
          </p>

          <h2 className="font-serif text-4xl md:text-6xl">
            Our Portfolio
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="group overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-paper)]">
                {project.image ? (
                  <Image
                    src={project.image}
                    unoptimized
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
                      {project.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {project.category}
                </p>

                <h3 className="font-serif text-2xl">
                  {project.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}