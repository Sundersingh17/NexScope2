import type { PortfolioDesignProps } from "../types";

const FALLBACK_PORTFOLIO = [
  { slug: "business-website", title: "Business Website", description: "A premium corporate website with CMS integration.", category: "Web Development" },
  { slug: "ecommerce-store", title: "E-commerce Store", description: "Full-featured online store with custom checkout.", category: "E-Commerce" },
  { slug: "ai-automation-system", title: "AI Automation System", description: "Intelligent workflow automation.", category: "AI / Automation" },
  { slug: "brand-identity-project", title: "Brand Identity Project", description: "Complete brand overhaul.", category: "Brand Identity" },
];

const ROTATIONS = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-1"];

export function ExperimentalPortfolio({ items }: PortfolioDesignProps) {
  const projects = items && items.length > 0 ? items : FALLBACK_PORTFOLIO;

  return (
    <section className="border-y border-[var(--color-ink)]/15 bg-[var(--color-ink)] py-16 text-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
          Selected work &rarr;
        </h2>
      </div>
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4" style={{ scrollbarWidth: "none" }}>
        {projects.map((project, i) => (
          <a
            key={project.slug}
            href={`/portfolio/${project.slug}`}
            className={`group w-72 shrink-0 snap-start overflow-hidden border border-[var(--color-cream)]/20 bg-[var(--color-cream)]/[0.04] transition-transform hover:-translate-y-1 hover:rotate-0 ${ROTATIONS[i % ROTATIONS.length]}`}
          >
            <div className="aspect-[4/3] bg-[var(--color-cream)]/[0.06]">
              {project.image && <img src={project.image} alt={project.title} className="h-full w-full object-cover" />}
            </div>
            <div className="p-5">
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-orange)]">{project.category}</span>
              <h3 className="mt-1.5 font-display text-lg font-black uppercase tracking-tight">{project.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
