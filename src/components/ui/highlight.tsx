import type { ReactNode } from "react";

/**
 * Renders `text` as plain copy, except for any phrase in `words` — those
 * are rendered bigger, bold, and in the lime accent color so a client
 * skimming the page can immediately see what the work actually delivers.
 *
 * Matching is case-insensitive and matches whole phrases (not just single
 * words), so multi-word keywords like "digital infrastructure" work too.
 */
export function Highlight({ text, words }: { text: string; words: string[] }): ReactNode {
  if (!words || words.length === 0) return text;

  // Longest phrases first, so a longer match wins over a shorter substring.
  const sorted = [...words].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const isMatch = sorted.some((w) => w.toLowerCase() === part.toLowerCase());
    if (!isMatch) return part;
    return (
      <mark key={i} className="nx-highlight">
        {part}
      </mark>
    );
  });
}
