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

export function SwissFooter() {
  return (
    <footer className="border-t border-[var(--color-ink)]/15 bg-[var(--color-cream)] px-6 pt-16 pb-8 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 pb-12 sm:grid-cols-[2fr_3fr]">
          <div>
            <a href="/" className="mb-3 flex items-center gap-2.5">
              <Image src="/logo/nexscope-mark.png" alt="NexScope" width={24} height={24} className="h-6 w-6 object-contain" />
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-ink)]">NexScope</span>
            </a>
            <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-[var(--color-ink)]/60">
              A digital systems studio — branding, websites, AI automation, and growth marketing.
            </p>
            <a href="mailto:hello@nexscope.in" className="mt-3 inline-block text-xs font-medium text-[var(--color-ink)]/70 hover:text-[var(--color-ink)] transition-colors">
              hello@nexscope.in
            </a>
          </div>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {quickLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-xs font-medium text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] transition-colors">{link.label}</a>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--color-ink)]/10 py-6 text-xs font-light text-[var(--color-ink)]/60">
          <a href="/privacy-policy" className="hover:text-[var(--color-ink)] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[var(--color-ink)] transition-colors">Terms of Service</a>
          <a href="/cookie-policy" className="hover:text-[var(--color-ink)] transition-colors">Cookie Policy</a>
          <button onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))} className="underline underline-offset-4 hover:text-[var(--color-ink)] transition-colors">
            Cookie Settings
          </button>
          <a href="/admin/login" className="text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]/60 transition-colors">Admin</a>
        </div>

        <p className="text-xs font-light text-[var(--color-ink)]/60">&copy; {new Date().getFullYear()} NexScope</p>
      </div>
    </footer>
  );
}
