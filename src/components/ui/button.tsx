"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  href?: string;
  /** Opt-in "sticker pop" style (offset color shadow, press-down on
   *  click) used by the AI Jugaad-inspired redesign. Doesn't change
   *  anything else about the button. */
  pop?: boolean;
  /** Set true when this button sits on a dark section background
   *  (e.g. bg-[var(--color-ink)]) so text/borders render in cream
   *  instead of ink. Defaults to false (light/cream background),
   *  which is the dominant background across the site post-redesign. */
  dark?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  icon,
  href,
  pop = false,
  dark = false,
  children,
  ...props
}: ButtonProps) {
  // Every variant uses explicit ink/cream colors — never a bare "white"
  // or "zinc-*" class that only worked against the old dark body.
  const variants = dark
    ? {
        primary: "bg-[var(--color-cream)] text-[var(--color-ink)] border-2 border-[var(--color-cream)] hover:opacity-90",
        secondary: "bg-transparent text-[var(--color-cream)] border-2 border-[var(--color-cream)]/40 hover:border-[var(--color-cream)] hover:bg-[var(--color-cream)]/10",
        ghost: "bg-transparent text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] hover:bg-[var(--color-cream)]/10",
        outline: "bg-transparent text-[var(--color-cream)] border-2 border-[var(--color-cream)]/30 hover:border-[var(--color-cream)]",
      }
    : {
        primary: "bg-[var(--color-ink)] text-[var(--color-cream)] border-2 border-[var(--color-ink)] hover:opacity-90",
        secondary: "bg-[var(--color-cream)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] hover:bg-[var(--color-yellow)]",
        ghost: "bg-transparent text-[var(--color-ink)]/70 border-2 border-transparent hover:text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5",
        outline: "bg-transparent text-[var(--color-ink)] border-2 border-[var(--color-ink)]/30 hover:border-[var(--color-ink)]",
      };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const content = (
    <motion.span
      className="inline-flex items-center gap-2 font-display"
      whileHover={{ x: variant === "primary" ? 2 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
      {icon || (variant === "primary" && !loading ? (
        <ArrowUpRight className="h-4 w-4" />
      ) : null)}
    </motion.span>
  );

  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange)]/40",
    "disabled:opacity-50 disabled:pointer-events-none",
    pop
      ? cn(
          "neo-button border-2 border-[var(--color-ink)] shadow-neo-orange",
          variant === "primary"
            ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
            : "bg-[var(--color-cream)] text-[var(--color-ink)]"
        )
      : variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={loading} {...props}>
      {content}
    </button>
  );
}
