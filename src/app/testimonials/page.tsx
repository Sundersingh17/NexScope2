import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DesignTestimonialsPage } from "@/components/design-system/design-renderer";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Hear from our clients — real reviews from businesses we've helped build, automate, and grow with AI, design, and digital solutions.",
  openGraph: {
    title: "Testimonials | NexScope Agency — AI, Design & Growth",
    description:
      "Hear from our clients — real reviews from businesses we've helped build, automate, and grow with AI, design, and digital solutions.",
  },
  twitter: {
    title: "Testimonials | NexScope Agency — AI, Design & Growth",
    description:
      "Hear from our clients — real reviews from businesses we've helped build, automate, and grow with AI, design, and digital solutions.",
  },
};

// Fallback shown only if the database has no testimonials yet — keeps the
// page from looking broken before the first ones are added in /admin.
const FALLBACK: Array<{
  name: string;
  company: string;
  role: string | null;
  content: string;
  rating: number;
  videoUrl?: string | null;
  featured: boolean;
}> = [
  { name: "Rahul Sharma", company: "TechFlow Solutions", role: "CEO", content: "NexScope transformed our entire digital presence. From an outdated website to a high-converting platform — the results speak for themselves.", rating: 5, featured: true },
  { name: "Priya Patel", company: "Bloom Ventures", role: "Marketing Director", content: "The AI automation workflows they built saved us 40+ hours per week. What used to take our team days now happens automatically.", rating: 5, featured: true },
  { name: "Arjun Mehta", company: "Elevate Brands", role: "Founder", content: "Working with NexScope on our brand identity was a revelation. They built a complete brand system we use across every touchpoint.", rating: 5, featured: true },
];

// Data fetching stays here, server-side, exactly as before — this page
// just hands the result to DesignTestimonialsPage instead of rendering the
// Signature markup directly, so whichever design is active renders its own
// Testimonials page composition with the same real testimonial data.
export default async function TestimonialsPage() {
  let all = FALLBACK;
  try {
    const rows = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    if (rows.length > 0) {
      all = rows.map((t) => ({
        name: t.name,
        company: t.company,
        role: t.role,
        content: t.content,
        rating: t.rating,
        videoUrl: t.videoUrl,
        featured: t.featured,
      }));
    }
  } catch (error) {
    console.error("Failed to load testimonials, using fallback:", error);
  }

  return <DesignTestimonialsPage testimonials={all} />;
}
