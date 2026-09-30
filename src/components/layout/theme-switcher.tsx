"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, LayoutTemplate } from "lucide-react";
import { useDesign } from "@/components/design-system/design-provider";
import { applyLook, THEME_STORAGE_KEY } from "@/lib/apply-look";

interface ThemePreset {
  slug: string;
  name: string;
  colors: Record<string, string>;
  fontPair: string;
  design: string;
  mood: string;
  isDefault: boolean;
}

const STORAGE_KEY = THEME_STORAGE_KEY;

// Re-exported for any code still importing FONT_PAIRS from this module;
// the canonical definition now lives in @/lib/apply-look.
export { FONT_PAIRS } from "@/lib/apply-look";

export function ThemeSwitcher() {
  const [presets, setPresets] = useState<ThemePreset[]>([]);
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const { designSlug, setDesignSlug, designs } = useDesign();

  useEffect(() => {
    fetch("/api/theme")
      .then((res) => res.json())
      .then((data) => {
        const list: ThemePreset[] = data.presets || [];
        setPresets(list);

        // Every fresh session starts on the brand default — a visitor's
        // pick is remembered only in their own browser, never written back
        // to the site, so it can never affect what anyone else (or Google)
        // sees.
        const saved = localStorage.getItem(STORAGE_KEY);
        const savedPreset = saved && list.find((p) => p.slug === saved);
        if (savedPreset) {
          applyLook(savedPreset);
          setActiveSlug(savedPreset.slug);
        }
      })
      .catch(() => {});
  }, []);

  // Only hide the button entirely if there's truly nothing to switch —
  // no color/font presets AND only one layout design exists.
  if (presets.length === 0 && designs.length <= 1) return null;

  const handlePick = (preset: ThemePreset) => {
    applyLook(preset);
    setActiveSlug(preset.slug);
    if (preset.isDefault) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, preset.slug);
    }
  };

  return (
    <div className="fixed bottom-24 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-72 max-h-[70vh] overflow-y-auto rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream)] p-4 shadow-lg shadow-black/10 sm:w-80"
          >
            {/* Layout — the big lever. Each tile mounts a completely
                different Navbar/Hero/Services/Portfolio/etc. composition
                (see src/designs/registry.ts), not just different colors. */}
            {designs.length > 1 && (
              <div className="mb-4">
                <p className="mb-2 flex items-center gap-1.5 font-display text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-ink)]/60">
                  <LayoutTemplate size={12} /> Website Experience
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {designs.map((d) => (
                    <button
                      key={d.slug}
                      onClick={() => setDesignSlug(d.slug)}
                      className={`rounded-xl border-2 p-2.5 text-left transition-colors ${
                        designSlug === d.slug ? "border-[var(--color-ink)]" : "border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30"
                      }`}
                      style={{ background: d.previewColors.bg }}
                    >
                      <span
                        className="mb-1.5 block h-6 w-full rounded-md"
                        style={{ background: `linear-gradient(135deg, ${d.previewColors.accent}, ${d.previewColors.ink})` }}
                      />
                      <span className="block font-display text-xs font-bold" style={{ color: d.previewColors.ink }}>{d.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Look — color + font + shape + mood presets, unchanged from
                before. Independent of the Layout choice above: any color
                preset can be combined with any layout design. */}
            {presets.length > 0 && (
              <div>
                <p className="mb-2 font-display text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-ink)]/60">Look</p>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.slug}
                      onClick={() => handlePick(preset)}
                      title={preset.name}
                      aria-label={`Switch to ${preset.name} theme`}
                      className={`h-8 w-8 shrink-0 transition-transform hover:scale-110 ${
                        preset.design === "sharp" ? "rounded-none" : preset.design === "soft" ? "rounded-2xl" : "rounded-full"
                      } ${
                        activeSlug === preset.slug || (!activeSlug && preset.isDefault)
                          ? "ring-2 ring-offset-2 ring-[var(--color-ink)] ring-offset-[var(--color-cream)]"
                          : ""
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${preset.colors.orange || "#FF4D00"}, ${preset.colors.yellow || "#FFC72E"})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Design Studio" : "Try a different website experience"}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-shadow"
      >
        {open ? <X size={18} /> : <Palette size={18} />}
      </motion.button>
    </div>
  );
}
