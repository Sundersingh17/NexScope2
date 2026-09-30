"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pause, Play, Quote } from "lucide-react";

export interface VideoTestimonialItem {
  project: string;
  category: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  videoUrl?: string;
}

const SAMPLE_STORIES: VideoTestimonialItem[] = [
  {
    project: "TechFlow Solutions",
    category: "Digital platform",
    quote: "NexScope turned our outdated website into a platform that finally represents the quality of our work.",
    name: "Rahul Sharma",
    role: "CEO, TechFlow Solutions",
    initials: "RS",
  },
  {
    project: "Bloom Ventures",
    category: "AI automation",
    quote: "The workflow they built gave our team back more than 40 hours every week. It feels like adding an extra team member.",
    name: "Priya Patel",
    role: "Marketing Director, Bloom Ventures",
    initials: "PP",
  },
  {
    project: "Elevate Brands",
    category: "Brand identity",
    quote: "We now have a brand system that looks consistent everywhere, from our website to every campaign we launch.",
    name: "Arjun Mehta",
    role: "Founder, Elevate Brands",
    initials: "AM",
  },
];

export function VideoTestimonialShowcase({ items = SAMPLE_STORIES }: { items?: VideoTestimonialItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const story = items[activeIndex] ?? SAMPLE_STORIES[0];

  useEffect(() => {
    if (!isPlaying || items.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [isPlaying, items.length]);

  return (
    <section className="border-y-2 border-[var(--color-ink)] bg-[var(--color-yellow)] py-20 sm:py-28" id="video-testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-display text-sm font-bold tracking-[0.2em] text-[var(--color-orange)]">PROJECT STORIES</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Good work gets talked about.
            </h2>
          </div>
          <p className="max-w-xs text-sm font-medium leading-relaxed text-[var(--color-ink)]/65">
            A sample reel of the feedback we hear after launch, across websites, automation, and brand systems.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-ink)] shadow-[7px_7px_0_0_#141414] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative flex min-h-[360px] items-center overflow-hidden bg-[var(--color-orange)] p-6 sm:min-h-[430px] sm:p-10">
            <div className="absolute -right-16 -top-20 size-64 rounded-full border-[28px] border-[var(--color-yellow)]/35" />
            <div className="absolute -bottom-24 -left-20 size-72 rounded-full border-[36px] border-[var(--color-cream)]/15" />
            <div className="relative z-10 w-full">
              <div className="mb-8 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-cream)]/75">
                <span>Sample video testimonial</span>
                <span>{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
              </div>

              {story.videoUrl ? (
                <video className="aspect-video w-full rounded-xl border-2 border-[var(--color-ink)] object-cover" controls preload="metadata" src={story.videoUrl} />
              ) : (
                <button
                  type="button"
                  aria-label={isPlaying ? "Pause testimonial reel" : "Play testimonial reel"}
                  onClick={() => setIsPlaying((playing) => !playing)}
                  className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] text-left shadow-[5px_5px_0_0_#141414]"
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 25%, #141414 25%, #141414 27%, transparent 27%, transparent 50%, #141414 50%, #141414 52%, transparent 52%)", backgroundSize: "42px 42px" }} />
                  <div className="relative flex size-16 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-yellow)] transition-transform group-hover:scale-110 sm:size-20">
                    {isPlaying ? <Pause className="size-6 fill-current sm:size-8" /> : <Play className="ml-1 size-6 fill-current sm:size-8" />}
                  </div>
                  <span className="absolute bottom-4 left-4 font-display text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]/60">{isPlaying ? "Playing story reel" : "Play story reel"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between bg-[var(--color-ink)] p-6 text-[var(--color-cream)] sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={story.project} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-orange)]">{story.category}</span>
                  <Quote className="size-8 text-[var(--color-yellow)]" />
                </div>
                <h3 className="mt-7 font-display text-2xl font-black uppercase leading-tight sm:text-4xl">{story.project}</h3>
                <blockquote className="mt-6 text-lg leading-relaxed text-[var(--color-cream)]/85 sm:text-xl">&ldquo;{story.quote}&rdquo;</blockquote>
                <div className="mt-8 flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full border-2 border-[var(--color-cream)]/25 bg-[var(--color-orange)] text-xs font-bold">{story.initials}</span>
                  <div>
                    <strong className="block text-sm">{story.name}</strong>
                    <span className="text-xs text-[var(--color-cream)]/60">{story.role}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-2 border-t border-[var(--color-cream)]/15 pt-5">
              {items.map((item, index) => (
                <button key={item.project} type="button" aria-label={`Show ${item.project} testimonial`} onClick={() => { setActiveIndex(index); setIsPlaying(false); }} className={`h-2 flex-1 rounded-full transition-colors ${index === activeIndex ? "bg-[var(--color-orange)]" : "bg-[var(--color-cream)]/20"}`} />
              ))}
              <ArrowRight className="ml-2 size-4 shrink-0 text-[var(--color-yellow)]" />
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs font-medium text-[var(--color-ink)]/60">Demo reel shown until customer-recorded videos are connected in the admin dashboard.</p>
      </div>
    </section>
  );
}