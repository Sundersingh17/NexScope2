import { Metadata } from "next";
import { LeadCaptureSection } from "@/components/sections/lead-capture";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free quote for your next project. NexScope responds within 24 hours. AI automation, web development, branding, and digital marketing — get a custom proposal.",
  openGraph: {
    title: "Get a Free Quote | NexScope Agency — AI, Design & Growth",
    description:
      "Request a free quote for your next project. NexScope responds within 24 hours. AI automation, web development, branding, and digital marketing — get a custom proposal.",
  },
  twitter: {
    title: "Get a Free Quote | NexScope Agency — AI, Design & Growth",
    description:
      "Request a free quote for your next project. NexScope responds within 24 hours. AI automation, web development, branding, and digital marketing — get a custom proposal.",
  },
};

export default function GetQuotePage() {
  return (
    <div className="pt-28">
      <LeadCaptureSection />
    </div>
  );
}