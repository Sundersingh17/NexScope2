"use client";
import Image from "next/image";

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

export function SwissNavbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-ink)]/15 bg-[var(--color-cream)]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
        <a href="/" className="flex items-center gap-2.5">
          <Image src="/logo/nexscope-mark.png" alt="NexScope" width={24} height={24} className="h-6 w-6 object-contain" />
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-ink)]">
            NexScope
          </span>
        </a>
        <ul className="hidden items-center gap-8 xl:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="border-b border-transparent text-xs font-medium uppercase tracking-wider text-[var(--color-ink)]/70 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/get-quote" className="hidden border border-[var(--color-ink)] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors xl:inline-block">
          Start a Project
        </a>
        <button onClick={() => setOpen(!open)} className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink)] xl:hidden">
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-[var(--color-cream)]">
          <ul className="mx-auto flex max-w-2xl flex-col divide-y divide-[var(--color-ink)]/10 px-6 py-4 sm:px-10">
            {navLinks.map((link) => (
              <li key={link.href} className="py-4">
                <a href={link.href} onClick={() => setOpen(false)} className="text-2xl font-medium text-[var(--color-ink)] hover:text-[var(--color-ink)]/60 transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
