"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-20">
      <div className="max-w-lg mx-auto px-4 text-center">
        <AlertTriangle size={64} className="text-amber-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          Server Error
        </h1>
        <p className="text-[var(--color-gray)] text-lg mb-8">
          Something went wrong on our end. We've been notified and are working on a fix.
          Please try again in a few minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" size="lg">
            Back to Home
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}