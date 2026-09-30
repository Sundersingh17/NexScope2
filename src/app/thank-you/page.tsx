import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for reaching out to NexScope. We'll get back to you within 24 hours.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-20">
      <div className="max-w-lg mx-auto px-4 text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          Thank You!
        </h1>
        <p className="text-[var(--color-gray)] text-lg mb-8">
          We've received your message and will get back to you within 24 hours.
          In the meantime, feel free to explore our portfolio or read our blog.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/portfolio" size="lg">
            View Our Work
          </Button>
          <Button href="/" variant="secondary" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}