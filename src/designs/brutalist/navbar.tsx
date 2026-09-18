"use client";

import { useState, useEffect } from "react";

// Same destinations as the Signature navbar — only the composition changes,
// per the architecture's core rule: shared content, independent presentation.
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

export function BrutalistNavbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-4 border-[var(--color-ink)] bg-[var(--color-cream)]">
      <nav className="flex h-16 items-center justify-between px-4 sm:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-ink)]">
            <img src="/logo/nexscope-mark.png" alt="NexScope" className="h-6 w-6 object-contain" />
          </span>
          <span className="font-display text-xl font-black uppercase tracking-tighter text-[var(--color-ink)]">
            NexScope<span className="text-[var(--color-orange)]">.</span>
          </span>
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="border-2 border-[var(--color-ink)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-[var(--color-ink)] text-[var(--color-cream)]">
          <ul className="mx-auto flex max-w-3xl flex-col divide-y-2 divide-[var(--color-cream)]/15 px-6 py-4 sm:px-10">
            {navLinks.map((link, i) => (
              <li key={link.href} className="flex items-baseline gap-4 py-4">
                <span className="font-display text-xs font-bold text-[var(--color-orange)]">{String(i + 1).padStart(2, "0")}</span>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl font-black uppercase tracking-tight hover:text-[var(--color-orange)] transition-colors sm:text-5xl"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mx-auto flex max-w-3xl flex-col gap-3 border-t-2 border-[var(--color-cream)]/15 px-6 py-8 sm:flex-row sm:px-10">
            <a href="/portal/login" onClick={() => setOpen(false)} className="flex-1 border-2 border-[var(--color-cream)] px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-widest hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)] transition-colors">
              Client Portal
            </a>
            <a href="/get-quote" onClick={() => setOpen(false)} className="flex-1 border-2 border-[var(--color-orange)] bg-[var(--color-orange)] px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
              Start a Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
