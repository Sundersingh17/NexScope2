import { Metadata } from "next";
import { DesignFAQ, DesignLeadCapture } from "@/components/design-system/design-renderer";
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
      <DesignFAQ items={faqs} />
      <DesignLeadCapture />
    </div>
  );
}
