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

export function ExperimentalFooter() {
  return (
    <footer className="border-t border-[var(--color-ink)]/15 bg-[var(--color-ink)] px-6 pt-16 pb-8 text-[var(--color-cream)]">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="mb-6 flex items-center gap-2.5">
          <Image src="/logo/nexscope-mark.png" alt="NexScope" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-display text-sm font-bold uppercase tracking-widest">NexScope</span>
        </a>
        <p className="-rotate-1 inline-block font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          Let&apos;s make<br />something<span className="text-[var(--color-orange)]">.</span>
        </p>
        <a href="mailto:hello@nexscope.in" className="mt-4 block font-display text-sm font-bold uppercase tracking-widest text-[var(--color-orange)] hover:underline">
          hello@nexscope.in
        </a>

        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--color-cream)]/15 pt-8">
          {quickLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-xs font-bold uppercase tracking-wider text-[var(--color-cream)]/70 hover:text-[var(--color-orange)] transition-colors">{link.label}</a>
          ))}
        </nav>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--color-cream)]/15 pt-6 text-xs text-[var(--color-cream)]/60">
          <a href="/privacy-policy" className="hover:text-[var(--color-cream)] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[var(--color-cream)] transition-colors">Terms of Service</a>
          <a href="/cookie-policy" className="hover:text-[var(--color-cream)] transition-colors">Cookie Policy</a>
          <button onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))} className="underline underline-offset-4 hover:text-[var(--color-cream)] transition-colors">
            Cookie Settings
          </button>
          <a href="/admin/login" className="text-[var(--color-cream)]/60 hover:text-[var(--color-cream)]/60 transition-colors">Admin</a>
        </div>

        <p className="mt-6 text-xs text-[var(--color-cream)]/60">&copy; {new Date().getFullYear()} NexScope</p>
      </div>
    </footer>
  );
}
