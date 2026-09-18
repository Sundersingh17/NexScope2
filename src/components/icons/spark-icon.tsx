interface SparkIconProps {
  className?: string;
  strokeWidth?: number;
}

/**
 * The brand mark — a proper three-line asterisk SVG, not a text "*"
 * character. Ported exactly from the reference implementation. Used as
 * the logo mark, bullet points, and marquee separators throughout.
 */
export function SparkIcon({ className = "size-5 text-orange", strokeWidth = 9 }: SparkIconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        <line x1="32" y1="10" x2="32" y2="54" />
        <line x1="12.9" y1="21" x2="51.1" y2="43" />
        <line x1="12.9" y1="43" x2="51.1" y2="21" />
      </g>
    </svg>
  );
}
