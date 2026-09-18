import { SparkIcon } from "@/components/icons/spark-icon";

interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Infinite-scroll ticker band, ported exactly from the reference —
 * solid orange background, bold cream text, SparkIcon (asterisk)
 * separators between items. Pure CSS animation (.animate-marquee in
 * globals.css). Renders the item list twice, each pass duplicated once
 * more internally, so the loop is seamless regardless of viewport width.
 */
export function Marquee({ items, className = "" }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={`relative w-full border-y-2 border-[var(--color-ink)] bg-[var(--color-orange)] py-3.5 sm:py-4 ${className}`}>
      <div className="nx-marquee-clip w-full overflow-hidden">
        <div className="animate-marquee flex items-center">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={pass === 1}>
              {doubled.map((item, idx) => (
                <span
                  key={`${pass}-${idx}`}
                  className="flex shrink-0 items-center gap-8 whitespace-nowrap font-display text-xl font-black tracking-tight text-[var(--color-cream)] sm:text-2xl"
                >
                  {item}
                  <SparkIcon className="size-4 text-[var(--color-yellow)]" strokeWidth={10} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
