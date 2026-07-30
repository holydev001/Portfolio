"use client";

import { useEffect, useRef } from "react";

type Signal = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  glyph: string;
  size: number;
  alpha: number;
  phase: number;
};

const GLYPHS = [
  "</>",
  "{ }",
  "[ ]",
  "::",
  "=>",
  "01",
  "10",
  "//",
  "API",
  "TSX",
  "NODE",
  "NEXT",
  "λ",
  "&&",
  "++",
  "0x",
];

export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let signals: Signal[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let previous = performance.now();
    let start = previous;

    const createSignals = () => {
      const count = Math.min(150, Math.max(72, Math.round((width * height) / 11500)));
      signals = Array.from({ length: count }, (_, index) => ({
        x: ((index * 73.43) % 100) / 100 * width,
        y: ((index * 41.79 + 17) % 100) / 100 * height,
        speedX: 2.5 + (index % 7) * 0.72,
        speedY: -1.5 - (index % 5) * 0.48,
        glyph: GLYPHS[index % GLYPHS.length],
        size: index % 11 === 0 ? 12 : index % 4 === 0 ? 9 : 7,
        alpha: 0.12 + ((index * 13) % 18) / 100,
        phase: index * 0.71,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createSignals();
      draw(performance.now(), 0);
    };

    const draw = (now: number, delta: number) => {
      context.clearRect(0, 0, width, height);
      const dark = document.documentElement.classList.contains("dark");
      const elapsed = reducedMotion.matches ? 3.8 : (now - start) / 1000;
      const signalColor = dark ? "238, 185, 47" : "139, 76, 0";
      const inkColor = dark ? "235, 228, 208" : "28, 24, 18";

      context.save();
      context.font = '500 8px "JetBrains Mono", monospace';
      context.textBaseline = "middle";
      context.globalCompositeOperation = dark ? "lighter" : "source-over";

      for (const signal of signals) {
        if (!reducedMotion.matches) {
          signal.x += signal.speedX * delta;
          signal.y += signal.speedY * delta;
          if (signal.x > width + 50) signal.x = -50;
          if (signal.y < -30) signal.y = height + 30;
        }

        const flicker = 0.76 + Math.sin(elapsed * 1.8 + signal.phase) * 0.24;
        const alpha = signal.alpha * flicker;
        const highlight = Math.sin(elapsed * 0.55 + signal.phase * 1.7) > 0.9;

        context.font = `500 ${signal.size}px "JetBrains Mono", monospace`;
        context.fillStyle = highlight
          ? `rgba(${signalColor}, ${Math.min(0.52, alpha * 1.7)})`
          : `rgba(${inkColor}, ${alpha})`;
        context.fillText(signal.glyph, signal.x, signal.y);
      }

      context.font = '500 7px "JetBrains Mono", monospace';
      context.letterSpacing = "0.18em";
      context.fillStyle = `rgba(${inkColor}, 0.2)`;
      const laneCount = width < 700 ? 3 : 7;
      for (let lane = 0; lane < laneCount; lane += 1) {
        const x = ((lane + 0.5) / laneCount) * width;
        const y = ((elapsed * (10 + lane * 1.7) + lane * 113) % (height + 100)) - 50;
        context.fillText(
          `${String(lane + 1).padStart(2, "0")} / SIGNAL_${(lane * 17 + 31).toString(16).toUpperCase()}`,
          x,
          y,
        );
      }
      context.restore();
    };

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      draw(now, delta);
      raf = requestAnimationFrame(tick);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reducedMotion.matches) {
        previous = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onMotion = () => {
      cancelAnimationFrame(raf);
      draw(performance.now(), 0);
      if (!reducedMotion.matches) raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotion);
    if (!reducedMotion.matches) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotion);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="ambient-field" />;
}
