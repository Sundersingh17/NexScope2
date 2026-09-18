"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Pricing", href: "/pricing" },
  { label: "Work", href: "/portfolio" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// No horizontal bar at all — a small logo pinned top-left, a single round
// menu button top-right that opens a fullscreen, oversized link list. The
// "unconventional" part is structural (no traditional nav row), not
// motion-based, so it stays fully usable and calm under reduced-motion.
export function ExperimentalNavbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
        <a href="/" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--color-ink)] bg-[var(--color-cream)]">
          <img src="/logo/nexscope-mark.png" alt="NexScope" className="h-6 w-6 object-contain" />
        </a>
      </div>

      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="fixed top-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-ink)] bg-[var(--color-orange)] text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-transform hover:scale-105"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-cream)]">
          <ul className="grid gap-1 text-center">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline justify-center gap-3 py-1.5 font-display text-3xl font-black uppercase tracking-tight text-[var(--color-ink)] hover:text-[var(--color-orange)] transition-colors sm:text-5xl"
                >
                  <span className="text-xs font-medium text-[var(--color-ink)]/30 group-hover:text-[var(--color-orange)]/60">{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
