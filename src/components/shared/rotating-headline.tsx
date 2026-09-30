"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// The headline phrases themselves are shared content — every design's Hero
// rotates through the same messages, only the typography/layout around
// them differs. Keeping this in one place means a new headline only needs
// to be added once, not once per design.
export const HERO_HEADLINES = [
  { who: "We build brands", what: "that get remembered" },
  { who: "We ship products", what: "that actually convert" },
  { who: "We automate work", what: "so you don't have to" },
  { who: "We are engineers", what: "we are designers" },
];

/** Cycles through HERO_HEADLINES on an interval, paused entirely under
 *  prefers-reduced-motion. Any design's Hero can call this to get the
 *  same auto-changing headline behavior. */
export function useRotatingHeadline(intervalMs = 2700) {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HERO_HEADLINES.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return HERO_HEADLINES[headlineIndex];
}

interface AnimatedLineProps {
  text: string;
  className?: string;
  delay?: number;
  /** How many lines of height to reserve for this line, so a design using
   *  a much larger font size (where a long headline phrase wraps to 2
   *  lines) doesn't get its second line clipped by the default single-line
   *  height. Signature's font size was tuned to always fit on one line, so
   *  it doesn't need this; Brutalist's much larger type does. */
  lines?: number;
}

/** Slides the current headline phrase up and out, next one sliding in
 *  from below — the "pop up" effect. Shared so every design's Hero
 *  renders the rotation identically; only surrounding font-size/weight
 *  classes need to differ per design. */
export function AnimatedLine({ text, className = "", delay = 0, lines = 1 }: AnimatedLineProps) {
  return (
    <span className="block overflow-hidden" style={{ height: `${1.02 * lines}em` }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={text}
          initial={{ y: "115%", rotate: 3, opacity: 0 }}
          animate={{ y: "0%", rotate: 0, opacity: 1 }}
          exit={{ y: "-115%", rotate: -3, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
          className={`block ${className}`}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
