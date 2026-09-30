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

export function FuturisticNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-2xl border border-[var(--color-cream)]/10 bg-[var(--color-ink)]/70 px-5 py-3 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-[0_0_30px_-5px_var(--color-orange)]" : ""}`}
      >
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-1 ring-[var(--color-orange)]/50">
            <Image src="/logo/nexscope-mark.png" alt="NexScope" width={20} height={20} className="h-5 w-5 object-contain" />
          </span>
          <span className="font-display text-sm font-bold tracking-wide text-[var(--color-cream)]">NexScope</span>
        </a>

        <ul className="hidden items-center gap-4 xl:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-xs font-medium text-[var(--color-cream)]/60 hover:text-[var(--color-orange)] transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/get-quote"
          className="hidden rounded-full bg-[var(--color-orange)] px-4 py-2 text-xs font-bold text-[var(--color-ink)] shadow-[0_0_20px_-2px_var(--color-orange)] hover:shadow-[0_0_28px_0px_var(--color-orange)] transition-shadow xl:inline-block"
        >
          Start a Project
        </a>

        <button onClick={() => setOpen(!open)} className="text-xs font-medium text-[var(--color-cream)] xl:hidden">
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 top-20 z-40 flex flex-col items-center justify-center gap-6 bg-[var(--color-ink)]/95 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-display text-2xl font-bold text-[var(--color-cream)] hover:text-[var(--color-orange)] transition-colors">
              {link.label}
            </a>
          ))}
          <a href="/get-quote" onClick={() => setOpen(false)} className="mt-4 rounded-full bg-[var(--color-orange)] px-6 py-3 text-sm font-bold text-[var(--color-ink)]">
            Start a Project
          </a>
        </div>
      )}
    </header>
  );
}
