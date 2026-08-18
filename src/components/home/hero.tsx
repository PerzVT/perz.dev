"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/config";
import { useReveal } from "@/lib/reveal";

/**
 * Positioning line over a looping, low-opacity background video
 * (public/port.mp4). Autoplay is gated on prefers-reduced-motion, paused
 * on the first frame when reduced motion is on. Hovering or focusing the
 * nav wordmark brightens the reel via the reveal store.
 */
export function Hero() {
  const revealed = useReveal();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, []);

  return (
    <header className="relative flex min-h-[62vh] items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: revealed ? 0.5 : 0.22,
          transition: "opacity .55s var(--ease-out)",
        }}
      >
        <video
          ref={videoRef}
          src="/port.mp4"
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--pz-canvas) 6%, color-mix(in srgb, var(--pz-canvas) 55%, transparent) 48%, transparent 82%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px]"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--pz-canvas))",
          }}
        />
      </div>

      <div className="pointer-events-none relative z-[1] mx-auto w-full max-w-[1160px] px-[clamp(20px,4vw,32px)] py-[clamp(48px,9vh,96px)]">
        <p className="m-0 max-w-[34ch] text-[clamp(22px,2.4vw,27px)] font-medium leading-[1.5] tracking-[-0.02em] text-pz-ink [animation:perzRise_.5s_var(--ease-out)_.05s_both] [text-wrap:pretty]">
          {siteConfig.positioning}
        </p>
      </div>
    </header>
  );
}
