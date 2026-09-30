"use client";
import Image from "next/image";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Pricing", href: "/pricing" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function FuturisticFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-cream)]/10 bg-[var(--color-ink)] px-4 pt-16 pb-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--color-orange), transparent)" }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 pb-10 sm:grid-cols-[2fr_1fr]">
          <div>
            <a href="/" className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-1 ring-[var(--color-orange)]/50">
                <Image src="/logo/nexscope-mark.png" alt="NexScope" width={20} height={20} className="h-5 w-5 object-contain" />
              </span>
              <span className="font-display text-sm font-bold text-[var(--color-cream)]">NexScope</span>
            </a>
            <p className="max-w-xs text-sm font-light leading-relaxed text-[var(--color-cream)]/60">
              A digital systems studio, engineered for what&apos;s next.
            </p>
            <a href="mailto:hello@nexscope.in" className="mt-3 inline-block text-xs font-bold text-[var(--color-orange)] hover:text-[var(--color-yellow)] transition-colors">
              hello@nexscope.in
            </a>
          </div>
          <nav>
            <p className="mb-3 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--color-cream)]/60">Quick Links</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm font-light text-[var(--color-cream)]/60 hover:text-[var(--color-orange)] transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--color-cream)]/10 py-6 text-xs font-light text-[var(--color-cream)]/60">
          <a href="/privacy-policy" className="hover:text-[var(--color-cream)] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[var(--color-cream)] transition-colors">Terms of Service</a>
          <a href="/cookie-policy" className="hover:text-[var(--color-cream)] transition-colors">Cookie Policy</a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))}
            className="underline underline-offset-4 hover:text-[var(--color-cream)] transition-colors"
          >
            Cookie Settings
          </button>
          <a href="/admin/login" className="text-[var(--color-cream)]/60 hover:text-[var(--color-cream)]/60 transition-colors">Admin</a>
        </div>

        <p className="text-xs font-light text-[var(--color-cream)]/60">&copy; {new Date().getFullYear()} NexScope</p>
      </div>
    </footer>
  );
}
