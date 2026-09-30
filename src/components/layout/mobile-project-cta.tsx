"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function MobileProjectCta({ hidden = false }: { hidden?: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hidden) return;
    const updateVisibility = () => setVisible(window.scrollY > 520);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [hidden]);

  if (hidden || !visible) return null;

  return (
    <a
      href="/get-quote"
      className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-yellow)] px-5 py-3 text-sm font-bold text-[var(--color-ink)] shadow-[4px_4px_0_0_#141414] sm:hidden"
      aria-label="Start a project"
    >
      <span className="font-display">Start a project</span>
      <ArrowUpRight className="size-5" />
    </a>
  );
}
