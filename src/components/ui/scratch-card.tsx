"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScratchCardProps {
  onDone?: () => void;
}

const CONFETTI_COLORS = ["#FF4D00", "#FFC72E", "#141414", "#FFFCF5"];

/**
 * Real canvas-based scratch-to-reveal card — draws "SCRATCH ME" on an
 * orange striped background, then erases pixels as the user drags their
 * finger/mouse across it (via canvas destination-out compositing).
 * Once ~14% of the canvas is cleared, it fades out entirely and fires
 * a confetti burst. Ported directly from the reference implementation;
 * this is genuinely interactive, not a hover effect.
 *
 * Usage: place this as an absolutely-positioned overlay (inset-0) on
 * top of the content it should reveal — see the Services section.
 */
export function ScratchCard({ onDone }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const stateRef = useRef({
    drawing: false,
    x: 0,
    y: 0,
    moves: 0,
    started: false,
    finished: false,
  });

  const burstConfetti = useCallback(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const height = container.clientHeight + 80;
    for (let i = 0; i < 90; i++) {
      const span = document.createElement("span");
      const size = 6 + 7 * Math.random();
      const xOffset = -60 + 120 * Math.random();
      const rotation = (Math.random() < 0.5 ? -1 : 1) * (360 + 540 * Math.random());

      span.style.cssText = `position:absolute;left:${100 * Math.random()}%;top:${
        -30 - 150 * Math.random()
      }px;width:${size}px;height:${size * (0.6 + Math.random())}px;background:${
        CONFETTI_COLORS[i % CONFETTI_COLORS.length]
      };border-radius:${Math.random() < 0.25 ? "999px" : "2px"};pointer-events:none;z-index:40;`;

      container.appendChild(span);

      span
        .animate(
          [
            { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(${0.6 * xOffset}px, ${0.6 * height}px) rotate(${0.6 * rotation}deg)`,
              opacity: 1,
              offset: 0.7,
            },
            {
              transform: `translate(${xOffset}px, ${height}px) rotate(${rotation}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: 1300 + 900 * Math.random(),
            easing: "cubic-bezier(.2,.6,.3,1)",
          }
        ).onfinish = () => span.remove();
    }
  }, []);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;

    // Background fill
    ctx.fillStyle = "#FF4D00";
    ctx.fillRect(0, 0, w, h);

    // Diagonal stripes
    ctx.strokeStyle = "rgba(255, 252, 245, 0.12)";
    ctx.lineWidth = 12;
    for (let x = -h; x < w + h; x += 44) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }

    // Typography
    const fontSize = Math.max(30, Math.min(0.08 * w, 66));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFFCF5";
    ctx.font = `900 ${fontSize}px "Space Grotesk", "Archivo", Arial, sans-serif`;
    ctx.fillText("SCRATCH ME", w / 2, h / 2 - 0.72 * fontSize);

    ctx.fillStyle = "#FFC72E";
    ctx.font = `900 ${Math.max(15, 0.4 * fontSize)}px "Space Grotesk", "Archivo", Arial, sans-serif`;
    ctx.fillText("TO SEE WHAT WE DO", w / 2, h / 2 + 0.42 * fontSize);

    // Hint pill
    const pillFontSize = Math.max(10, 0.2 * fontSize);
    const pillText = "SWIPE HERE — FINGER OR MOUSE";
    ctx.font = `700 ${pillFontSize}px "Space Grotesk", "Archivo", Arial, sans-serif`;
    const pillWidth = ctx.measureText(pillText).width + 2.6 * pillFontSize;
    const pillHeight = 2.6 * pillFontSize;
    const pillY = h / 2 + 1.5 * fontSize;

    ctx.fillStyle = "rgba(20, 20, 20, 0.9)";
    ctx.beginPath();
    if (typeof (ctx as unknown as { roundRect?: (...args: number[]) => void }).roundRect === "function") {
      (ctx as unknown as { roundRect: (...args: number[]) => void }).roundRect(
        w / 2 - pillWidth / 2,
        pillY - pillHeight / 2,
        pillWidth,
        pillHeight,
        999
      );
    } else {
      ctx.rect(w / 2 - pillWidth / 2, pillY - pillHeight / 2, pillWidth, pillHeight);
    }
    ctx.fill();

    ctx.fillStyle = "#FAF3E5";
    ctx.fillText(pillText, w / 2, pillY + 1);
  }, []);

  useEffect(() => {
    drawCard();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!stateRef.current.started) drawCard();
      });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      if (!stateRef.current.started) drawCard();
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawCard]);

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, w: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      w: rect.width,
    };
  };

  const scratch = (startX: number, startY: number, endX: number, endY: number, width: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const radius = Math.max(34, 0.075 * width);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 2 * radius;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || stateRef.current.finished) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const totalPixels = canvas.width * canvas.height;
    if (totalPixels === 0) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const step = Math.max(1, Math.floor(totalPixels / 4000));
    let cleared = 0;
    let counted = 0;

    for (let i = 0; i < totalPixels; i += step) {
      counted++;
      if (data[4 * i + 3] < 128) cleared++;
    }

    if (cleared / counted > 0.14 && !stateRef.current.finished) {
      stateRef.current.finished = true;
      setIsFinished(true);
      burstConfetti();
      onDone?.();
    }
  };

  return (
    <>
      <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden" />
      <AnimatePresence>
        {!isFinished && (
          <motion.div
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-20 overflow-hidden rounded-2xl border-2 border-[var(--color-ink)] shadow-[5px_5px_0_0_#141414]"
          >
            <canvas
              ref={canvasRef}
              className="h-full w-full touch-none select-none cursor-crosshair"
              aria-label="Scratch card — swipe to reveal our services"
              onPointerDown={(e) => {
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                  /* pointer capture unsupported — scratching still works without it */
                }
                stateRef.current.drawing = true;
                stateRef.current.started = true;
                const pos = getPos(e);
                scratch(pos.x, pos.y, pos.x, pos.y, pos.w);
                stateRef.current.x = pos.x;
                stateRef.current.y = pos.y;
              }}
              onPointerMove={(e) => {
                if (!stateRef.current.drawing) return;
                const pos = getPos(e);
                scratch(stateRef.current.x, stateRef.current.y, pos.x, pos.y, pos.w);
                stateRef.current.x = pos.x;
                stateRef.current.y = pos.y;
                if (++stateRef.current.moves % 5 === 0) checkProgress();
              }}
              onPointerUp={() => {
                stateRef.current.drawing = false;
                checkProgress();
              }}
              onPointerCancel={() => {
                stateRef.current.drawing = false;
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
