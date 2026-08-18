"use client";

import { useSyncExternalStore } from "react";
import { Signature } from "@/components/ui/signature";

/**
 * "perz" signature behind the footer, clipped at the edge. Decorative:
 * aria-hidden, non-interactive.
 *
 * Two fixes over the raw registry component: reduced motion (it animates
 * via JS, so CSS can't stop it; duration 0 skips the animation), and
 * self-hosting the font via `fontUrl` instead of its default runtime
 * fetch from componentry.fun.
 */
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function FooterSignature() {
  const reduced = useSyncExternalStore(
    subscribe,
    () => typeof window !== "undefined" && window.matchMedia(REDUCED).matches,
    () => false,
  );

  return (
    // SVG pads to 3x font size with glyphs sitting high, so the lower
    // ~40% is empty. Anchoring the box's midpoint at the footer's
    // midpoint (translateY as a share of its own height) keeps the
    // glyph band on screen regardless of font size.
    <div
      aria-hidden
      className="pointer-events-none absolute right-[-6%] top-1/2 -translate-y-[47%] select-none opacity-[0.1] [mask-image:linear-gradient(to_left,#000_45%,transparent)]"
    >
      <Signature
        text="perz"
        fontUrl="/fonts/caveat.ttf"
        fontSize={300}
        color="var(--pz-accent)"
        duration={reduced ? 0 : 1.6}
        inView
        once
      />
    </div>
  );
}
