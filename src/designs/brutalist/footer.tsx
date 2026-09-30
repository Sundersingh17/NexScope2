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

export function BrutalistFooter() {
  return (
    <footer className="border-t-4 border-[var(--color-ink)] bg-[var(--color-ink)] pt-16 pb-8 text-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid gap-10 border-b-2 border-[var(--color-cream)]/15 pb-10 sm:grid-cols-[2fr_1fr]">
          <div>
            <a href="/" className="mb-4 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden border-2 border-[var(--color-cream)] bg-[var(--color-orange)]">
                <Image src="/logo/nexscope-mark.png" alt="NexScope" width={24} height={24} className="h-6 w-6 object-contain" />
              </span>
              <span className="font-display text-lg font-black uppercase tracking-tighter">NexScope</span>
            </a>
            <p className="font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">
              Let&apos;s build<br />something.
            </p>
            <a href="mailto:hello@nexscope.in" className="mt-4 inline-block font-display text-sm font-bold uppercase tracking-widest text-[var(--color-orange)] hover:underline">
              hello@nexscope.in
            </a>
          </div>
          <nav>
            <p className="mb-3 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-cream)]/60">Quick Links</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-[var(--color-cream)]/80 hover:text-[var(--color-orange)] transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Legal + the one admin entry point sitewide — identical set of
            links/behavior to the Signature footer, just restyled. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-6 text-xs text-[var(--color-cream)]/60">
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

        <p className="border-t-2 border-[var(--color-cream)]/15 pt-6 text-xs text-[var(--color-cream)]/60">
          &copy; {new Date().getFullYear()} NexScope
        </p>
      </div>
    </footer>
  );
}
