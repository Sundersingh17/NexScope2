import { Metadata } from "next";
import { FAQSection } from "@/components/sections/faq";
import { Button } from "@/components/ui/button";
import { getPublishedFAQs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about NexScope's AI automation, web development, branding, and digital marketing services, process, and pricing.",
  openGraph: {
    title: "FAQ | NexScope Agency — AI, Design & Growth",
    description:
      "Frequently asked questions about NexScope's AI automation, web development, branding, and digital marketing services, process, and pricing.",
  },
  twitter: {
    title: "FAQ | NexScope Agency — AI, Design & Growth",
    description:
      "Frequently asked questions about NexScope's AI automation, web development, branding, and digital marketing services, process, and pricing.",
  },
};

export default async function FAQPage() {
  const faqs = await getPublishedFAQs();

  return (
    <div className="pt-28">
      <section className="py-16 md:py-24 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
            Frequently Asked Questions
          </h1>
          <p className="text-[var(--color-gray)] text-lg max-w-2xl mx-auto">
            Everything you need to know about working with NexScope. Can't find what you're looking for? Get in touch.
          </p>
        </div>
      </section>
      <FAQSection items={faqs} />
      <section className="py-20 text-center bg-[var(--color-cream)]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">Still Have Questions?</h2>
          <p className="text-[var(--color-gray)] mb-8">We're here to help. Reach out and we'll get back to you within 24 hours.</p>
          <Button href="/contact" size="lg" pop>Contact Us</Button>
        </div>
      </section>
    </div>
  );
}