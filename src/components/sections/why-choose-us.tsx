"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Highlight } from "@/components/ui/highlight";
import { Zap, UserCheck, Infinity, Receipt, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Zap, stat: "~2x", title: "Fast Delivery", desc: "We accelerate timelines without compromising quality, launching in weeks not months.", highlights: ["weeks not months"] },
  { icon: UserCheck, stat: "01", title: "Dedicated PM", desc: "Every project gets a single point of contact who owns your success from start to finish.", highlights: ["single point of contact"] },
  { icon: Infinity, stat: "\u221e", title: "Scalable Solutions", desc: "Built to grow with you — our architecture evolves as your business scales.", highlights: ["grow with you"] },
  { icon: Receipt, stat: "0", title: "Transparent Pricing", desc: "No surprises. Clear quotes, fixed scopes, and honest communication always.", highlights: ["No surprises"] },
  { icon: HeadphonesIcon, stat: "24/7", title: "Round-the-Clock Support", desc: "Our team is always available. We respond within hours, not days.", highlights: ["hours, not days"] },
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-[var(--color-cream)] py-20 sm:py-28" id="why-choose-us">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          label="Why NexScope"
          title="Built for Excellence"
          description="We combine strategy, design, and technology to deliver measurable outcomes."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 text-center shadow-neo-sm transition-shadow hover:shadow-neo-md"
            >
              <div className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-1 text-[var(--color-orange)]">
                {feature.stat}
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] flex items-center justify-center mx-auto mb-3">
                <feature.icon size={15} className="text-[var(--color-ink)]" />
              </div>
              <h4 className="font-display text-sm font-bold mb-1">{feature.title}</h4>
              <p className="text-[0.7rem] leading-relaxed text-[var(--color-gray)]">
                <Highlight text={feature.desc} words={feature.highlights} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
