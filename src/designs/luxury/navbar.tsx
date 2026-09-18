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

// Fraunces/Inter are hardcoded directly here (not via the swappable
// --font-family-display/--sans vars) because a serif editorial voice is
// core to this design's identity, not something an unrelated Look preset
// should be able to override — see the note in luxury/index.ts.
export function LuxuryNavbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-ink)]/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo/nexscope-mark.png" alt="NexScope" className="h-6 w-6 object-contain opacity-90" />
          <span style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-lg font-semibold tracking-wide text-[var(--color-cream)]">
            NexScope
          </span>
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--color-cream)]/60 hover:text-[var(--color-yellow)] transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/get-quote"
          className="hidden border border-[var(--color-yellow)]/60 px-5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--color-yellow)] hover:bg-[var(--color-yellow)] hover:text-[var(--color-ink)] transition-colors lg:inline-block"
        >
          Enquire
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--color-cream)] lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 flex flex-col items-center justify-center gap-8 bg-[var(--color-ink)]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ fontFamily: "var(--font-fraunces), serif" }}
              className="text-3xl font-medium text-[var(--color-cream)] hover:text-[var(--color-yellow)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a href="/get-quote" onClick={() => setOpen(false)} className="mt-4 border border-[var(--color-yellow)] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-yellow)]">
            Enquire
          </a>
        </div>
      )}
    </header>
  );
}
