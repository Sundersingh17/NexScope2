"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { SparkIcon } from "@/components/icons/spark-icon";
import { useRotatingHeadline, AnimatedLine } from "@/components/shared/rotating-headline";

const HERO_STICKERS = [
  { label: "BRANDING", pos: "left-[3%] top-24 md:top-[22%]", look: "bg-[var(--color-yellow)] text-[var(--color-ink)]", rotate: -8 },
  { label: "WEBSITES", pos: "right-[3%] top-36 md:top-[18%]", look: "bg-[var(--color-orange)] text-[var(--color-cream)]", rotate: 7 },
  { label: "AI AUTOMATION", pos: "right-[4%] bottom-16 md:right-auto md:left-[5%] md:bottom-[22%]", look: "bg-[var(--color-ink)] text-[var(--color-cream)]", rotate: -6 },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentHeadline = useRotatingHeadline();

  return (
    <section
      id="hero"
      ref={containerRef}
      className="dot-grid relative flex min-h-[72svh] flex-col justify-center overflow-hidden pt-40 md:min-h-[92svh] md:pt-32"
    >
      {/* Draggable stickers */}
      {HERO_STICKERS.map((sticker, idx) => (
        <motion.div
          key={sticker.label}
          drag
          dragConstraints={containerRef}
          dragMomentum={false}
          whileDrag={{ scale: 1.12 }}
          whileHover={{ scale: 1.06 }}
          initial={{ rotate: 4 * sticker.rotate }}
          animate={{ rotate: sticker.rotate }}
          transition={{
            delay: 0.45 + 0.16 * idx,
            type: "spring",
            bounce: 0.52,
            duration: 1.35,
          }}
          className={`sticker-drop-in absolute z-20 max-w-[42vw] cursor-grab touch-none select-none active:cursor-grabbing ${sticker.pos}`}
          style={{ animationDelay: `${0.45 + 0.16 * idx}s` }}
        >
          <div
            className={`animate-sticker-float flex items-center justify-center rounded-full border-2 border-[var(--color-ink)] px-3 py-2 text-center font-display text-xs font-black leading-tight tracking-tight shadow-[4px_4px_0_0_#141414] sm:px-6 sm:py-3 sm:text-lg sm:shadow-[5px_5px_0_0_#141414] ${sticker.look}`}
            style={{ animationDuration: `${2.4 + 0.35 * idx}s`, animationDelay: `${2 + 0.2 * idx}s` }}
          >
            {sticker.label}
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <h1 className="font-display text-[clamp(2.1rem,9.6vw,6.2rem)] font-black uppercase leading-[1.02] tracking-tight">
          <AnimatedLine text={currentHeadline.who} />
          <AnimatedLine text={currentHeadline.what} className="text-outline" delay={0.08} />
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="block text-[var(--color-orange)]"
          >
            and more.
          </motion.span>
        </h1>

        <div className="mt-4 flex flex-col gap-8 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-xl"
          >
            <p className="text-sm font-medium leading-relaxed sm:text-lg text-[var(--color-ink)]/85">
              Brand identity, websites and AI automation — built for real businesses, not design awards.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 sm:mt-7">
              <a
                href="/get-quote"
                className="rounded-full bg-[var(--color-ink)] px-5 py-3 font-display text-xs font-bold text-[var(--color-cream)] shadow-[5px_5px_0_0_#ff4d00] transition-transform hover:-translate-y-0.5 sm:px-7 sm:py-3.5 sm:text-base active:translate-y-0"
              >
                START A PROJECT
              </a>
              <a
                href="/services"
                className="rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-5 py-3 font-display text-xs font-bold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-yellow)] sm:px-7 sm:py-3.5 sm:text-base active:translate-y-0"
              >
                SEE OUR WORK
              </a>
            </div>
          </motion.div>

          {/* Rotating circular badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="hidden shrink-0 sm:block"
          >
            <div className="relative grid size-28 place-items-center sm:size-32">
              <svg viewBox="0 0 120 120" className="absolute inset-0 animate-rot">
                <defs>
                  <path id="nx-badge-circle" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
                </defs>
                <text className="fill-[var(--color-ink)] font-display text-[12.5px] font-bold tracking-[0.18em]">
                  <textPath href="#nx-badge-circle">DESIGN &#8226; BUILD &#8226; AUTOMATE &#8226; REPEAT &#8226;</textPath>
                </text>
              </svg>
              <span className="grid size-12 place-items-center rounded-full bg-[var(--color-orange)]">
                <SparkIcon className="size-6 text-[var(--color-cream)]" />
              </span>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-5 font-display text-[0.55rem] font-bold tracking-[0.2em] text-[var(--color-ink)]/50 sm:mt-10 sm:text-xs"
        >
          PSST — THE STICKERS ARE DRAGGABLE
        </motion.p>
      </div>
    </section>
  );
}
