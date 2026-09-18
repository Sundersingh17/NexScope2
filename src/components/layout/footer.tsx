"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { XIcon, InstagramIcon, LinkedinIcon, GithubIcon } from "@/components/icons/social-icons";
import { siteConfig } from "@/lib/seo";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";

const footerLinks = {
  home: [
    { label: "Hero Section", href: "/#hero" },
    { label: "Services Overview", href: "/#services" },
    { label: "Why Choose Us", href: "/#why-choose-us" },
    { label: "Portfolio Preview", href: "/#portfolio" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "CTA", href: "/#cta" },
  ],
  about: [
    { label: "Company Story", href: "/about#story" },
    { label: "Mission & Vision", href: "/about#mission" },
    { label: "Team", href: "/about#team" },
    { label: "Values", href: "/about#values" },
    { label: "Why NexScope", href: "/about#why" },
  ],
  packages: [
    { label: "Starter Launch", href: "/packages#starter" },
    { label: "Growth Engine", href: "/packages#growth" },
    { label: "Scale Automation", href: "/packages#scale-automation" },
    { label: "Brand OS", href: "/packages#brand-os" },
    { label: "Enterprise OS", href: "/packages#enterprise" },
  ],
  services: [
    { label: "Digital Foundations", href: "/services/digital-foundations" },
    { label: "Brand & Experience Design", href: "/services/brand-experience" },
    { label: "Growth & Marketing Engine", href: "/services/growth-marketing" },
    { label: "Automation & Business Systems", href: "/services/automation-systems" },
    { label: "Custom Product Builds", href: "/services/custom-product-builds" },
  ],
};

function FooterColumn({ title, href, links }: { title: string; href: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <a href={href}>
        <h4 className="text-xs font-extrabold tracking-widest uppercase text-white/40 mb-6 hover:text-[var(--color-orange)] transition-colors">
          {title}
        </h4>
      </a>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] border-t-4 border-[var(--color-orange)] pt-20 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a href="/" className="flex items-center gap-2.5 mb-5" whileHover={{ x: 2 }}>
              <span className="w-9 h-9 rounded-lg bg-[var(--color-orange)] flex items-center justify-center overflow-hidden">
                <img src="/logo/nexscope-mark.png" alt="NexScope" className="h-7 w-7 object-contain" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">NexScope</span>
            </motion.a>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">
              Building, automating, and growing businesses through technology, brand strategy,
              and digital marketing. Based in India, serving the world.
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/70">
              <a href="mailto:hello@nexscope.in" className="flex items-center gap-2 hover:text-[var(--color-orange)] transition-colors">
                <Mail size={14} /> hello@nexscope.in
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-[var(--color-orange)] transition-colors">
                <Phone size={14} /> +91 98765 43210
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> India
              </span>
            </div>
          </div>

          <FooterColumn title="Home" href="/" links={footerLinks.home} />
          <FooterColumn title="About Us" href="/about" links={footerLinks.about} />
          <FooterColumn title="Packages" href="/packages" links={footerLinks.packages} />
          <FooterColumn title="Services" href="/services" links={footerLinks.services} />
        </div>

        {/* Legal — everything essential (privacy, terms, cookie prefs) plus
            the one and only admin entry point, consolidated here on purpose */}
        <div className="border-t border-white/10 pt-8 pb-16 sm:pb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="/privacy-policy" className="text-xs text-white/50 hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="text-xs text-white/50 hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="/cookie-policy" className="text-xs text-white/50 hover:text-white transition-colors">
            Cookie Policy
          </a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))}
            className="text-xs text-white/50 hover:text-white transition-colors underline underline-offset-4"
          >
            Cookie Settings
          </button>
          {/* Low-key staff entry point — not a security boundary, just a
              convenience so staff don't have to type /admin/login by hand.
              The route itself still requires real Firebase credentials;
              this link changes nothing about who can actually get in.
              This is the ONLY admin access point sitewide by design.
              Deliberately NOT pinned to the far edge with ml-auto — that
              corner is where the WhatsApp button and (on mobile) the
              quote-CTA bar and theme switcher live, and a fixed button
              sitting exactly on top of this link was swallowing the click. */}
          <a
            href="/admin/login"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Admin
          </a>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} NexScope &mdash; MADE WITH JUGAAD
          </p>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2 text-center md:text-right">
              Find Us Here
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: "Twitter", href: siteConfig.links.twitter, Icon: XIcon },
                { label: "Instagram", href: siteConfig.links.instagram, Icon: InstagramIcon },
                { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: LinkedinIcon },
                { label: "GitHub", href: siteConfig.links.github, Icon: GithubIcon },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border-2 border-white/20 flex items-center justify-center text-white/70 hover:text-[var(--color-orange)] hover:border-[var(--color-orange)] transition-all duration-300"
                >
                  <social.Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
