"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { useReveal } from "@/lib/reveal";

/**
 * Home hero — the positioning line over a looping, low-opacity background
 * reel (public/port.mp4). The video is muted + looped; autoplay is gated
 * on prefers-reduced-motion (paused first frame for users who opted out).
 * Hovering or focusing the nav wordmark brightens the reel via the reveal
 * store. Canvas gradients keep the copy readable over the footage. The
 * band holds a min height so the reel has room and the copy isn't cramped.
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
        className="absolute inset-0 z-0"
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
        <p className="m-0 max-w-[34ch] text-[clamp(22px,2.4vw,27px)] font-medium leading-[1.5] tracking-[-0.011em] text-pz-ink [animation:perzRise_.5s_var(--ease-out)_.05s_both] [text-wrap:pretty]">
          {siteConfig.positioning}
        </p>
        <div className="mt-[26px] flex items-center gap-[26px] [animation:perzRise_.5s_var(--ease-out)_.14s_both]">
          <a
            href="#work"
            className="pointer-events-auto text-[14.5px] font-semibold text-pz-accent"
          >
            See my work ↓
          </a>
          <Link
            href="/resume"
            className="pointer-events-auto border-b border-pz-border2 pb-px text-[14.5px] text-pz-ink2 transition-colors hover:text-pz-ink"
          >
            Résumé
          </Link>
        </div>
      </div>
    </header>
  );
}
