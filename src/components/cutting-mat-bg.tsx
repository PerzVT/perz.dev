"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed cutting-mat background — a faint grid + radial mask behind
 * the hero, fading away by the time the user reaches the projects
 * section. Pure dev-mode treatment: transparent base over the
 * near-black page with low-opacity white grid lines.
 *
 * Opacity drives the fade; the listener mutates the element style
 * directly (rAF-throttled) instead of touching React state so scroll
 * stays cheap.
 */
export function CuttingMatBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const t = window.scrollY;
      const h = window.innerHeight;
      // Start fading at 20% of viewport, fully gone by 70%.
      const k = Math.max(0, Math.min(1, 1 - (t - h * 0.2) / (h * 0.5)));
      el.style.opacity = String(k);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mask =
    "radial-gradient(ellipse 80% 70% at 50% 50%, #000 20%, transparent 85%)";

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden sm:block"
      style={{ transition: "opacity 120ms linear" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "32px 32px, 32px 32px, 160px 160px, 160px 160px",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      />
    </div>
  );
}
