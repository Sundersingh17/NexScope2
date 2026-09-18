import type { PortfolioDesignProps } from "../types";

const FALLBACK_PORTFOLIO = [
  { slug: "business-website", title: "Business Website", description: "A premium corporate website with CMS integration and lightning-fast performance.", category: "Web Development" },
  { slug: "ecommerce-store", title: "E-commerce Store", description: "Full-featured online store with custom checkout and inventory management.", category: "E-Commerce" },
  { slug: "ai-automation-system", title: "AI Automation System", description: "Intelligent workflow automation reducing manual processing by 80%.", category: "AI / Automation" },
  { slug: "brand-identity-project", title: "Brand Identity Project", description: "Complete brand overhaul including logo, guidelines, and marketing collateral.", category: "Brand Identity" },
];

export function SwissPortfolio({ items }: PortfolioDesignProps) {
  const projects = items && items.length > 0 ? items : FALLBACK_PORTFOLIO;

  return (
    <section className="border-b border-[var(--color-ink)]/15 bg-[var(--color-cream)] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          Selected work
        </h2>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {projects.map((project) => (
            <a key={project.slug} href={`/portfolio/${project.slug}`} className="group border-t border-[var(--color-ink)] pt-4">
              <div className="mb-4 aspect-[4/3] bg-[var(--color-paper)]">
                {project.image && <img src={project.image} alt={project.title} className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0" />}
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink)]/40">{project.category}</p>
              <h3 className="mt-1 text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-ink)]/60 transition-colors">{project.title}</h3>
              <p className="mt-1 text-xs font-light text-[var(--color-ink)]/50">{project.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
