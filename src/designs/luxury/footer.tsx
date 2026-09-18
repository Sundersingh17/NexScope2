"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";

const columns = [
  { title: "Studio", links: [{ label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/contact" }] },
  { title: "Work", links: [{ label: "Portfolio", href: "/portfolio" }, { label: "Testimonials", href: "/testimonials" }, { label: "Packages", href: "/packages" }, { label: "Pricing", href: "/pricing" }] },
];

export function LuxuryFooter() {
  return (
    <footer className="border-t border-[var(--color-yellow)]/25 bg-[var(--color-ink)] px-6 pt-16 pb-8 text-[var(--color-cream)] sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 pb-12 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <a href="/" className="mb-4 flex items-center gap-2.5">
              <img src="/logo/nexscope-mark.png" alt="NexScope" className="h-6 w-6 object-contain opacity-90" />
              <span style={{ fontFamily: "var(--font-fraunces), serif" }} className="text-lg font-medium">NexScope</span>
            </a>
            <p style={{ fontFamily: "var(--font-inter), sans-serif" }} className="max-w-xs text-sm font-light leading-relaxed text-[var(--color-cream)]/50">
              A digital systems studio — branding, websites, AI automation, and growth marketing, crafted with care.
            </p>
            <a href="mailto:hello@nexscope.in" className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-yellow)]/80 hover:text-[var(--color-yellow)] transition-colors">
              hello@nexscope.in
            </a>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[var(--color-cream)]/35">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm font-light text-[var(--color-cream)]/70 hover:text-[var(--color-yellow)] transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal + the one admin entry point sitewide — identical links to
            every other design's footer. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--color-cream)]/10 py-6 text-xs font-light text-[var(--color-cream)]/40">
          <a href="/privacy-policy" className="hover:text-[var(--color-cream)] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[var(--color-cream)] transition-colors">Terms of Service</a>
          <a href="/cookie-policy" className="hover:text-[var(--color-cream)] transition-colors">Cookie Policy</a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))}
            className="underline underline-offset-4 hover:text-[var(--color-cream)] transition-colors"
          >
            Cookie Settings
          </button>
          <a href="/admin/login" className="text-[var(--color-cream)]/25 hover:text-[var(--color-cream)]/50 transition-colors">Admin</a>
        </div>

        <p className="text-xs font-light text-[var(--color-cream)]/30">&copy; {new Date().getFullYear()} NexScope</p>
      </div>
    </footer>
  );
}
