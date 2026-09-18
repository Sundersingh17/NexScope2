import { Metadata } from "next";
import { DesignPortfolio, DesignLeadCapture } from "@/components/design-system/design-renderer";
import { getPublishedPortfolio } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore NexScope's portfolio of selected projects across web development, AI automation, branding, UI/UX design, and digital marketing. See our work in action.",
  openGraph: {
    title: "Our Portfolio | NexScope Agency — AI, Design & Growth",
    description:
      "Explore NexScope's portfolio of selected projects across web development, AI automation, branding, UI/UX design, and digital marketing.",
  },
  twitter: {
    title: "Our Portfolio | NexScope Agency — AI, Design & Growth",
    description:
      "Explore NexScope's portfolio of selected projects across web development, AI automation, branding, UI/UX design, and digital marketing.",
  },
};

export default async function PortfolioPage() {
  const portfolio = await getPublishedPortfolio();

  return (
    <div className="pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center py-20 bg-[var(--color-cream)]">
        <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">Our Work</h1>
        <p className="text-[var(--color-gray)] max-w-2xl mx-auto text-lg">
          Selected projects that showcase our expertise and passion.
        </p>
      </div>
      <DesignPortfolio items={portfolio} />
      <DesignLeadCapture />
    </div>
  );
}