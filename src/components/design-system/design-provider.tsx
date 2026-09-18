"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getDesignPreset, DEFAULT_DESIGN_SLUG, DESIGN_LIST } from "@/designs/registry";
import type { DesignSystem } from "@/designs/types";
import { applyLook, THEME_STORAGE_KEY } from "@/lib/apply-look";

const STORAGE_KEY = "nx-design-slug";

interface DesignContextValue {
  design: DesignSystem;
  designSlug: string;
  setDesignSlug: (slug: string) => void;
  designs: DesignSystem[];
}

const DesignContext = createContext<DesignContextValue>({
  design: getDesignPreset(DEFAULT_DESIGN_SLUG),
  designSlug: DEFAULT_DESIGN_SLUG,
  setDesignSlug: () => {},
  designs: DESIGN_LIST,
});

export function useDesign() {
  return useContext(DesignContext);
}

export function DesignProvider({ children }: { children: React.ReactNode }) {
  // Server-rendered output always assumes the default (Signature) design,
  // so there's no hydration mismatch — the actual saved/URL choice is only
  // applied after mount, same pattern as the existing color ThemeSwitcher.
  const [designSlug, setDesignSlugState] = useState(DEFAULT_DESIGN_SLUG);

  useEffect(() => {
    // ?design=<slug> in the URL is for sharing/testing a specific design
    // and takes precedence for this page view, but — per the requirement
    // that it not silently override a visitor's saved choice — it does
    // NOT get written to localStorage here. A visitor's saved preference
    // is only changed by actually using the Design Studio picker. Read
    // directly from window.location rather than next/navigation's
    // useSearchParams so this stays a plain client-side-only effect and
    // never forces dynamic rendering on pages that would otherwise be
    // static.
    const urlDesign = new URLSearchParams(window.location.search).get("design");
    const resolvedSlug =
      urlDesign && DESIGN_LIST.some((d) => d.slug === urlDesign)
        ? urlDesign
        : (() => {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved && DESIGN_LIST.some((d) => d.slug === saved) ? saved : DEFAULT_DESIGN_SLUG;
          })();

    setDesignSlugState(resolvedSlug);
    // Apply this design's built-in look immediately on load. If the
    // visitor separately saved an explicit Look preset (see
    // theme-switcher.tsx), that preset's own async fetch resolves a moment
    // later and naturally overrides this — an explicit color choice always
    // wins over a design's default, it just doesn't need special
    // coordination here since it happens after this synchronous effect.
    applyLook(getDesignPreset(resolvedSlug).recommendedLook);
  }, []);

  const setDesignSlug = useCallback((slug: string) => {
    setDesignSlugState(slug);
    if (slug === DEFAULT_DESIGN_SLUG) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, slug);
    }
    // Switching the whole website experience also switches its look —
    // this is what makes a layout change feel complete rather than a
    // mismatched mix of new layout + old colors. Clearing the saved Look
    // preset means this design's own recommended look is what persists
    // going forward, until the visitor explicitly picks a Look swatch
    // again (which re-saves that choice on top).
    localStorage.removeItem(THEME_STORAGE_KEY);
    applyLook(getDesignPreset(slug).recommendedLook);
  }, []);

  const value: DesignContextValue = {
    design: getDesignPreset(designSlug),
    designSlug,
    setDesignSlug,
    designs: DESIGN_LIST,
  };

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}
