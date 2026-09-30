import { Metadata } from "next";
import { getPublishedTeamMembers } from "@/lib/content";
import { DesignAboutPage } from "@/components/design-system/design-renderer";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NexScope — the full-stack digital agency in India behind AI automation, web development, branding, and growth solutions for modern businesses.",
  openGraph: {
    title: "About NexScope — AI, Design & Growth Solutions Agency",
    description:
      "Learn about NexScope — the full-stack digital agency in India behind AI automation, web development, branding, and growth solutions for modern businesses.",
  },
  twitter: {
    title: "About NexScope — AI, Design & Growth Solutions Agency",
    description:
      "Learn about NexScope — the full-stack digital agency in India behind AI automation, web development, branding, and growth solutions for modern businesses.",
  },
};

// Shown only if the database has no published team members yet.
const FALLBACK_TEAM = [
  { name: "Niranjan Epili", role: "Founder & CEO", bio: "Building NexScope to help businesses leverage AI, design, and automation. Passionate about creating systems that scale.", image: null },
  { name: "Priya Sharma", role: "Head of Design", bio: "10+ years crafting brand identities and digital experiences that convert. Believes every pixel has a purpose.", image: null },
  { name: "Arun Kumar", role: "Lead Engineer", bio: "Full-stack developer specializing in Next.js, AI integrations, and scalable architectures. Code is his craft.", image: null },
  { name: "Sneha Patel", role: "Marketing Director", bio: "Data-driven marketer who built 7-figure growth engines. Turns clicks into customers with precision.", image: null },
];

// Data fetching stays here, server-side, exactly as before — this page
// just hands the result to DesignAboutPage instead of rendering the
// Signature markup directly, so whichever design is active (see
// src/designs/registry.ts) renders its own About page composition with
// the same real team data.
export default async function AboutPage() {
  const dbTeam = await getPublishedTeamMembers();
  const team = dbTeam.length > 0 ? dbTeam : FALLBACK_TEAM;

  return <DesignAboutPage team={team} />;
}
