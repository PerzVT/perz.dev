"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * RotatedFrame — a fixed-aspect frame that holds a child slightly
 * rotated and slightly oversized. The child is clipped to the frame
 * (overflow:hidden), so even when the child's natural aspect doesn't
 * match the frame's, the visible region reads as "image placed on a
 * desk at a slight angle" instead of "image with letterbox bars."
 *
 * The rotation is deterministic per-slot (seeded by `index`) so the
 * page composes the same way on every render — no jumpy reshuffles
 * on re-mount, but the gallery still reads as a scrapbook stack
 * rather than a regimented grid.
 *
 * Hover gently bumps the rotation toward zero — implies "lift the
 * photo up to look at it straight on." Reverses to the slot rotation
 * on hover-out.
 */
export function RotatedFrame({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  /** Seed for the per-slot rotation. Same index = same angle every
   *  render, so React reordering won't make slides leap around. */
  index?: number;
  className?: string;
}) {
  // Deterministic small rotation: alternates sign by index parity,
  // magnitude varies by index. Range stays inside ±2.5deg so the
  // composition reads as a deliberate tilt, not crooked-on-purpose.
  // (1.05 + (index % 3) * 0.5) → 1.05, 1.55, 2.05, cycling.
  const sign = index % 2 === 0 ? 1 : -1;
  const magnitude = 1.05 + (index % 3) * 0.5;
  const rotateRest = sign * magnitude;

  const style: CSSProperties = {
    // Custom property so the inner img/video can read it for a
    // matching counter-rotation on hover via Tailwind arbitrary
    // variants if needed later.
    ["--rotate-rest" as string]: `${rotateRest}deg`,
  };

  return (
    <div
      className={[
        // The frame itself. overflow-hidden clips the rotated child
        // so the corners get cropped instead of poking outside.
        "group/frame relative overflow-hidden rounded-md bg-card",
        className,
      ].join(" ")}
      style={style}
    >
      {/* Inner wrapper applies the rotation. scale > 1 so the rotated
          rectangle's corners still cover the frame (otherwise the
          frame's corners would show empty bg-card where the rotated
          child no longer reaches). 1.12 covers up to ~3.5deg of
          rotation; we stay under ±2.5deg so this has margin. */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover/frame:[transform:rotate(0deg)_scale(1.04)]"
        style={{ transform: `rotate(${rotateRest}deg) scale(1.12)` }}
      >
        {children}
      </div>
    </div>
  );
}
