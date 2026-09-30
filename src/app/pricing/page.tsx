import { Metadata } from "next";
import { DesignPricingPage } from "@/components/design-system/design-renderer";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for NexScope's digital services. Choose from Starter, Growth, or Enterprise plans — or build your own custom package.",
  openGraph: {
    title: "Pricing | NexScope Agency — AI, Design & Growth",
    description:
      "Transparent pricing for NexScope's digital services. Choose from Starter, Growth, or Enterprise plans tailored to your business stage.",
  },
  twitter: {
    title: "Pricing | NexScope Agency — AI, Design & Growth",
    description:
      "Transparent pricing for NexScope's digital services. Choose from Starter, Growth, or Enterprise plans.",
  },
};

export default function PricingPage() {
  return <DesignPricingPage />;
}
