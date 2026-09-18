"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — a small orange dot with a trailing outlined ring that
 * follows with slight lag (spring-like easing via rAF lerp, not a CSS
 * transition, so it stays smooth at any speed). Scales up and switches
 * to a filled yellow ring when hovering anything clickable, matching
 * the reference site's playful energy — no cursor implementation shipped
 * in their source export, so this is an original design fit to the
 * same visual language (ink/orange/yellow, hard edges).
 *
 * Disabled entirely on touch devices and when the user prefers reduced
 * motion, and never renders on the server (avoids hydration mismatch
 * and doesn't block anything if JS is slow to load).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reducedMotion) return;
    setEnabled(true);
    document.documentElement.classList.add("nx-custom-cursor-active");
    return () => {
      document.documentElement.classList.remove("nx-custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]'));
    };

    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafId);
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}
      aria-hidden="true"
    >
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border-2 border-[var(--color-ink)] transition-[width,height,background-color,border-color] duration-200 ease-out"
        style={{
          width: hovering ? 52 : 30,
          height: hovering ? 52 : 30,
          backgroundColor: hovering ? "rgba(255, 199, 46, 0.35)" : "transparent",
        }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 rounded-full bg-[var(--color-orange)] transition-[width,height] duration-200 ease-out"
        style={{ width: hovering ? 6 : 8, height: hovering ? 6 : 8 }}
      />
    </div>
  );
}
