import { Marquee } from "@/components/ui/marquee";
import { StatsSection } from "@/components/sections/stats";
import { OutcomesSection } from "@/components/sections/outcomes";
import { ServiceExplorer } from "@/components/sections/service-explorer";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us";
import { VideoTestimonialShowcase } from "@/components/sections/video-testimonial";
import {
  DesignHero, DesignServices, DesignProcess, DesignLeadCapture,
  DesignPortfolio, DesignTestimonials, DesignFAQ,
} from "@/components/design-system/design-renderer";
import { getFeaturedTestimonials, getPublishedPortfolio, getPublishedFAQs } from "@/lib/content";

export const dynamic = "force-dynamic";

const MARQUEE_ITEMS = [
  "LOGO DESIGN",
  "WEBSITES",
  "AI AUTOMATION",
  "BRANDING",
  "E-COMMERCE",
  "GROWTH MARKETING",
];

export default async function HomePage() {
  const [testimonials, portfolio, faqs] = await Promise.all([
    getFeaturedTestimonials(3),
    getPublishedPortfolio(4),
    getPublishedFAQs(),
  ]);

  const videoStories = testimonials.map((testimonial) => ({
    project: testimonial.company || testimonial.name,
    category: "Client story",
    quote: testimonial.content,
    name: testimonial.name,
    role: testimonial.role,
    initials: testimonial.initials,
    videoUrl: testimonial.videoUrl,
  }));

  return (
    <>
      {/* DesignHero/Services/Portfolio/Process/Testimonials/FAQ/LeadCapture
          mount whichever design is active (see src/designs/registry.ts) —
          Signature by default, or whatever a visitor picked in the Design
          Studio. All the data below is still fetched here, server-side,
          exactly as before; the design-aware components below just decide
          which composition renders it. Marquee/Stats/Outcomes/Service
          Explorer/Why Choose Us/Video Testimonials aren't part of the
          per-design contract yet — they render the same way regardless of
          active design for now. Extending the registry to cover these too
          is the same pattern as everything else here, just more of it. */}
      <DesignHero />
      <Marquee items={MARQUEE_ITEMS} />
      <StatsSection />
      <OutcomesSection />
      <DesignServices />
      <ServiceExplorer />
      <WhyChooseUsSection />
      <DesignPortfolio items={portfolio} />
      <DesignProcess />
      <DesignTestimonials items={testimonials} />
      <VideoTestimonialShowcase items={videoStories.length > 0 ? videoStories : undefined} />
      <DesignFAQ items={faqs} />
      <DesignLeadCapture />
    </>
  );
}