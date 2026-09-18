import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl md:text-9xl font-bold tracking-tighter text-[var(--color-ink)]/10 mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">Page Not Found</h1>
        <p className="text-[var(--color-gray)] mb-8 max-w-md mx-auto">
          Oops! Looks like this page has moved to another dimension.
        </p>
        <Button href="/">Back to Home</Button>
      </div>
    </div>
  );
}