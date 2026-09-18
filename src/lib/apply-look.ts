// Shared between the Design Studio's "Look" swatches (admin-curated
// ThemePreset rows from /api/theme) and each design's own built-in
// recommendedLook (see src/designs/*/index.ts) — both are ultimately just
// "a set of 7 colors + a font pairing + a radius style + a mood" applied
// the same way, so the application logic lives in one place rather than
// being duplicated between theme-switcher.tsx and design-provider.tsx.

export const THEME_STORAGE_KEY = "nx-theme-slug";

// Must match ALLOWED_FONT_PAIRS in /api/admin/theme/route.ts and the fonts
// preloaded in layout.tsx. Each entry points at a next/font CSS variable
// that's already on the page, so switching is instant — no extra request.
export const FONT_PAIRS: Record<string, { label: string; display: string; sans: string }> = {
  "grotesk-archivo": { label: "Space Grotesk + Archivo (default)", display: "var(--font-space-grotesk), sans-serif", sans: "var(--font-archivo), sans-serif" },
  "fraunces-inter": { label: "Fraunces + Inter (editorial)", display: "var(--font-fraunces), serif", sans: "var(--font-inter), sans-serif" },
  "syne-manrope": { label: "Syne + Manrope (bold/tech)", display: "var(--font-syne), sans-serif", sans: "var(--font-manrope), sans-serif" },
};

export interface Look {
  colors: Record<string, string>;
  fontPair: string;
  design: string; // radius style: "signature" | "sharp" | "soft"
  mood: string; // "none" | "noir" | "vivid"
}

export function applyLook(look: Look) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(look.colors)) {
    root.style.setProperty(`--color-${key}`, value);
  }
  const fonts = FONT_PAIRS[look.fontPair] || FONT_PAIRS["grotesk-archivo"];
  root.style.setProperty("--font-family-display", fonts.display);
  root.style.setProperty("--font-family-sans", fonts.sans);
  // Corner-radius language — see html[data-design=...] rules in globals.css.
  root.setAttribute("data-design", look.design || "signature");
  // Full-page mood filter — see html[data-mood=...] rules in globals.css.
  root.setAttribute("data-mood", look.mood || "none");
}
