"use client";

import { useSyncExternalStore } from "react";
import { Signature } from "@/components/ui/signature";

/**
 * The "perz" signature that sits large and low-opacity behind the footer,
 * clipped by the footer edge. Decorative only — hidden from assistive
 * tech and non-interactive.
 *
 * Two things the raw registry component doesn't handle for us:
 * reduced-motion (it always animates the stroke, and framer-motion draws
 * via JS so our global CSS rule can't stop it — we pass duration 0 so it
 * appears already drawn), and the font, which we self-host. Left to its
 * own devices the component falls back to fetching a font from
 * componentry.fun at runtime; `fontUrl` keeps that request on our origin.
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
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-[14%] right-[-4%] select-none opacity-[0.07] [mask-image:linear-gradient(to_left,#000_55%,transparent)]"
    >
      <Signature
        text="perz"
        fontUrl="/fonts/caveat.ttf"
        fontSize={190}
        color="var(--pz-accent)"
        duration={reduced ? 0 : 1.6}
        inView
        once
      />
    </div>
  );
}
