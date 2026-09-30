import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Quote } from "lucide-react";
import { getPublishedPortfolio, getPublishedPortfolioBySlug } from "@/lib/content";
import { Button } from "@/components/ui/button";

interface PortfolioDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioDetailProps): Promise<Metadata> {
  const project = await getPublishedPortfolioBySlug((await params).slug);
  return { title: project ? `${project.title} | NexScope Case Study` : "Case Study" };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailProps) {
  const project = await getPublishedPortfolioBySlug((await params).slug);
  if (!project) notFound();
  const relatedProjects = (await getPublishedPortfolio())
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3);

  const sections = [
    { label: "The challenge", value: project.challenge || project.description },
    { label: "The approach", value: project.solution || "We combined strategy, design, and focused execution around the project's most important outcome." },
    { label: "The result", value: project.results || "Results and measurable outcomes will be added as this project story is updated." },
  ];
  const processSteps = project.process?.split("\n").map((step) => step.trim()).filter(Boolean) || ["Discover the opportunity", "Shape the right experience", "Build, test, and launch"];

  return (
    <main className="bg-[var(--color-cream)] pt-28 text-[var(--color-ink)]">
      <section className="border-b-2 border-[var(--color-ink)] bg-[var(--color-paper)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <Link href="/portfolio" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gray)] hover:text-[var(--color-orange)]"><ArrowLeft size={14} /> All work</Link>
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-orange)]">{project.category}</p>
              <h1 className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-7xl">{project.title}</h1>
            </div>
            <div className="text-sm leading-relaxed text-[var(--color-gray)]"><p>{project.description}</p>{project.client && <p className="mt-4 font-bold text-[var(--color-ink)]">Client: {project.client}</p>}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-ink)] shadow-neo-lg">
          {project.videoUrl ? <video className="aspect-video w-full object-cover" controls preload="metadata" src={project.videoUrl} /> : project.image ? <Image src={project.image} unoptimized alt={project.title} fill sizes="(min-width: 768px) 1024px, 100vw" className="object-cover" /> : <div className="flex aspect-video items-center justify-center bg-[var(--color-orange)]"><span className="font-display text-7xl font-black uppercase text-[var(--color-cream)] sm:text-9xl">{project.title.slice(0, 2)}</span></div>}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 sm:pb-24 md:grid-cols-3">
        {sections.map((section) => <article key={section.label} className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 shadow-neo-sm sm:p-8"><p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-orange)]">{section.label}</p><p className="mt-4 text-sm leading-relaxed text-[var(--color-gray)]">{section.value}</p></article>)}
      </section>

      <section className="border-y-2 border-[var(--color-ink)] bg-[var(--color-yellow)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.7fr_1fr]">
          <div><p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-orange)]">How we worked</p><h2 className="mt-3 font-display text-4xl font-black uppercase leading-none sm:text-6xl">From insight to impact.</h2></div>
          <div className="space-y-4">{processSteps.map((step, index) => <div key={step} className="flex items-center gap-4 border-b-2 border-[var(--color-ink)]/20 pb-4"><span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-[var(--color-ink)] font-display text-sm font-black">{index + 1}</span><span className="font-display text-lg font-bold">{step}</span><Check className="ml-auto size-5" /></div>)}</div>
        </div>
      </section>

      {project.testimonial && <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24"><Quote className="mx-auto size-10 text-[var(--color-orange)]" /><blockquote className="mt-6 font-display text-2xl font-bold leading-tight sm:text-4xl">&ldquo;{project.testimonial}&rdquo;</blockquote></section>}

      {relatedProjects.length > 0 && <section className="border-t-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-orange)]">Keep exploring</p><h2 className="mt-3 font-display text-3xl font-black uppercase sm:text-5xl">More work like this.</h2></div><Link href="/portfolio" className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gray)] hover:text-[var(--color-orange)]">View all work <ArrowUpRight className="inline size-4" /></Link></div><div className="mt-8 grid gap-4 sm:grid-cols-3">{relatedProjects.map((item) => <Link key={item.slug} href={`/portfolio/${item.slug}`} className="group border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-5 transition-transform hover:-translate-y-1 hover:shadow-neo-sm"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-orange)]">{item.category}</p><h3 className="mt-8 font-display text-xl font-black uppercase leading-tight">{item.title}</h3><p className="mt-3 line-clamp-2 text-sm text-[var(--color-gray)]">{item.description}</p><ArrowUpRight className="mt-5 size-5 text-[var(--color-ink)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>)}</div></div></section>}

      <section className="border-t-2 border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-16 text-center text-[var(--color-cream)] sm:px-6 sm:py-20"><h2 className="font-display text-3xl font-black uppercase sm:text-5xl">Have a project like this?</h2><div className="mt-7 flex flex-wrap justify-center gap-3"><Button href="/get-quote" size="lg" pop>Start a project</Button>{project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-cream)] px-6 py-3 text-sm font-bold text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)]">Visit project <ArrowUpRight size={15} /></a>}</div></section>
    </main>
  );
}