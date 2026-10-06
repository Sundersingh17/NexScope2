import type { PortfolioDesignProps } from "../types";
import type { PortfolioItem } from "@/components/sections/portfolio-showcase";
import Image from "next/image";

// Same fallback used by Signature's PortfolioShowcase, so an empty database
// still shows something reasonable in both designs.
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

// Bento-style asymmetric grid — first item spans two columns, the rest sit
// in a regular grid. Real project data comes from the same
// getPublishedPortfolio() call as Signature; this component never fetches
// or hardcodes project content of its own beyond the shared fallback above.
export function BrutalistPortfolio({ items }: PortfolioDesignProps) {
  const projects = items && items.length > 0 ? items : FALLBACK_PORTFOLIO;

  return (
    <section
      id="work"
      className="border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <h2 className="mb-10 font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          Selected work
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {projects.map((project, i) => (
            <a
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className={`group relative flex min-h-[160px] flex-col justify-between overflow-hidden border-2 border-[var(--color-ink)] p-5 transition-colors hover:bg-[var(--color-orange)] sm:min-h-[220px] sm:p-7 ${
                i === 0 ? "col-span-2" : ""
              }`}
            >
              {project.image && (
                <Image
                  src={project.image}
                  unoptimized
                  alt={project.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-20 transition-opacity group-hover:opacity-30"
                />
              )}

              <span className="relative self-start border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-2 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-widest">
                {project.category}
              </span>

              <div className="relative flex items-end justify-between gap-2">
                <h3 className="font-display text-xl font-black uppercase tracking-tight sm:text-3xl">
                  {project.title}
                </h3>

                <span
                  aria-hidden="true"
                  className="shrink-0 font-display text-xl font-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  &#8599;
                </span>
              </div>
            </a>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="mt-8 text-sm text-[var(--color-ink)]/60">
            More work in this category is on the way.
          </p>
        )}
      </div>
    </section>
  );
}