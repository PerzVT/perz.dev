"use client";

import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import { siteConfig } from "@/lib/config";
import { useReveal } from "@/lib/reveal";

/**
 * Home hero — the positioning line over a hidden full-bleed cover-art
 * layer that fades and unblurs in when the nav wordmark is hovered or
 * focused (pixel-stepped, per the comp). The art is a placeholder for a
 * future gameplay-footage reel; interim it shows the Highstreet key art.
 * Reduced-motion flattens the reveal to an instant swap.
 */
export function Hero() {
  const revealed = useReveal();

  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          opacity: revealed ? 0.9 : 0,
          filter: revealed
            ? "blur(0px) saturate(1)"
            : "blur(26px) saturate(1.4)",
          transition: "opacity .55s steps(7), filter .55s steps(7)",
        }}
      >
        {/* Interim asset — swap for the footage-reel poster when ready. */}
        <Image
          src="/projects/highstreet-calamity-vr/cover.png"
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--pz-canvas) 10%, color-mix(in srgb, var(--pz-canvas) 55%, transparent) 48%, transparent 80%)",
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

      <div className="pointer-events-none relative z-[1] mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(64px,10vh,110px)]">
        <p
          className="m-0 max-w-[34ch] text-[clamp(22px,2.4vw,27px)] font-medium leading-[1.5] tracking-[-0.011em] text-pz-ink [animation:perzRise_.5s_var(--ease-out)_.05s_both] [text-wrap:pretty]"
        >
          {siteConfig.positioning}
        </p>
        <div className="mt-[26px] flex items-center gap-[26px] [animation:perzRise_.5s_var(--ease-out)_.14s_both]">
          <a
            href="#work"
            className="pointer-events-auto text-[14.5px] font-semibold text-pz-accent"
          >
            Selected work ↓
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
