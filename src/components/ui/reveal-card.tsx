"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps any card/block in the same fade-up scroll-reveal used across the
 * homepage sections (hero, services, why-us, portfolio). Lets server
 * components (which can't use framer-motion directly) get the same motion
 * language just by wrapping their existing markup — no page rewrite needed.
 *
 * Usage: <RevealCard delay={i * 0.08}><div className="...">...</div></RevealCard>
 */
export function RevealCard({
  children,
  delay = 0,
  className,
  hover = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Lift slightly on hover — appropriate for discrete cards, not for
   *  full-width content blocks. Defaults to true. */
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -4 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
