"use client";

import { motion } from "framer-motion";
import { Badge } from "./badge";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
  /** Set true when this header sits on a dark section background
   *  (e.g. a section with bg-[var(--color-ink)]) so text renders in
   *  cream instead of ink. Defaults to false (light/cream background). */
  dark?: boolean;
}

export function SectionHeader({
  label,
  title,
  description,
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`text-center mb-16 ${className || ""}`}
    >
      <Badge dark={dark} className="mb-4">{label}</Badge>
      <h2
        className={`font-display text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight ${
          dark ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${
            dark ? "text-[var(--color-cream)]/70" : "text-[var(--color-gray)]"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
