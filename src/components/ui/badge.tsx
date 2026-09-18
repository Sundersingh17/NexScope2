import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dot";
  /** Set true on dark section backgrounds so border/text render in
   *  cream instead of ink. Defaults to false (light background). */
  dark?: boolean;
}

export function Badge({ children, className, variant = "default", dark = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-xs font-bold tracking-widest uppercase",
        "border-2 px-4 py-1.5 rounded-full",
        dark
          ? "text-[var(--color-cream)] border-[var(--color-cream)]/40"
          : "text-[var(--color-ink)] border-[var(--color-ink)]/70",
        variant === "dot" && "pl-3",
        className
      )}
    >
      {variant === "dot" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-orange)] animate-pulse" />
      )}
      {children}
    </span>
  );
}
