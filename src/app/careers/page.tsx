import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the NexScope team. Explore career opportunities in AI, design, development, and marketing. Work remotely from anywhere in India.",
  openGraph: {
    title: "Careers | NexScope Agency — AI, Design & Growth",
    description:
      "Join the NexScope team. Explore career opportunities in AI, design, development, and marketing. Work remotely from anywhere in India.",
  },
  twitter: {
    title: "Careers | NexScope Agency — AI, Design & Growth",
    description:
      "Join the NexScope team. Explore career opportunities in AI, design, development, and marketing. Work remotely from anywhere in India.",
  },
};

const positions = [
  { title: "Senior React / Next.js Developer", type: "Full-time", location: "Remote (India)", department: "Engineering" },
  { title: "UI/UX Designer", type: "Full-time", location: "Remote (India)", department: "Design" },
  { title: "Digital Marketing Specialist", type: "Full-time", location: "Remote (India)", department: "Marketing" },
  { title: "AI / ML Engineer", type: "Full-time", location: "Remote (India)", department: "Engineering" },
];

const dontCareAbout = ["Your college name", "Your CGPA", "Your marksheets", "A fancy resume"];
const careAbout = ["Optimistic by default", "Passionate about something. Anything.", "Raw and real", "Ready to take a challenge"];

export default function CareersPage() {
  return (
    <div className="pt-28 pb-0">
      {/* Hero */}
      <section className="dot-grid py-16 md:py-24 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Badge className="mb-4">Not a job post. An open door.</Badge>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
            Hello, Champ.
          </h1>
          <p className="text-[var(--color-gray)] text-lg max-w-2xl mx-auto">
            Cool, smart people never need a vacancy — if you have the spark, we'll make the room.
            We're looking for passionate people who want to build the future of digital.
          </p>
        </div>
      </section>

      {/* Care about / don't care about */}
      <section className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-7 shadow-neo-sm">
            <h3 className="font-display text-lg font-black uppercase tracking-tight mb-4 text-[var(--color-gray)]">
              We Do Not Care About
            </h3>
            <ul className="space-y-3">
              {dontCareAbout.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[var(--color-gray)] line-through decoration-2">
                  <XCircle size={14} className="text-[var(--color-gray)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-yellow)] p-7 shadow-neo-sm">
            <h3 className="font-display text-lg font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">
              We Care About
            </h3>
            <ul className="space-y-3">
              {careAbout.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink)]">
                  <CheckCircle size={14} className="text-[var(--color-ink)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl font-black uppercase tracking-tight mb-8 text-[var(--color-ink)]">Open Positions</h2>
          <div className="space-y-4">
            {positions.map((position) => (
              <div
                key={position.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-neo-sm transition-shadow hover:shadow-neo-md"
              >
                <div>
                  <h3 className="font-display font-bold mb-1 text-[var(--color-ink)]">{position.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-[var(--color-gray)]">
                    <span>{position.department}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-gray)]" />
                    <span>{position.type}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-gray)]" />
                    <span>{position.location}</span>
                  </div>
                </div>
                <Button href="/contact" size="sm" variant="secondary">
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
          <p className="text-[var(--color-gray)] text-sm mt-8 text-center">
            Don't see a role that fits?{" "}
            <a href="mailto:careers@nexscope.in" className="text-[var(--color-ink)] font-bold underline">Send us your resume</a>.
          </p>
        </div>
      </section>

      {/* Why work here */}
      <section className="py-20 bg-[var(--color-ink)] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl font-black uppercase tracking-tight mb-4 text-[var(--color-cream)]">Why Work at NexScope?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { n: "01", title: "Remote First", desc: "Work from anywhere in India. Flexible hours, results-driven culture." },
              { n: "02", title: "Growth Mindset", desc: "Learning budget, conferences, and mentorship to level up your skills." },
              { n: "03", title: "Impactful Work", desc: "Build products and campaigns used by real businesses across the globe." },
            ].map((item) => (
              <div key={item.n}>
                <div className="w-12 h-12 rounded-full border-2 border-[var(--color-cream)]/20 bg-[var(--color-cream)]/[0.06] flex items-center justify-center mx-auto mb-4 font-display text-xl font-black text-[var(--color-orange)]">
                  {item.n}
                </div>
                <h4 className="font-display font-bold mb-2 text-[var(--color-cream)]">{item.title}</h4>
                <p className="text-sm text-[var(--color-cream)]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
