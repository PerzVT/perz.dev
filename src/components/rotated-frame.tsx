"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * RotatedFrame — a fixed-aspect frame that holds a child contained
 * (not cropped) at a comfortable inset, then tilts the child on hover.
 *
 * Rest state: child is centered at ~70% of the frame's smaller axis,
 * sitting on a bg-card surface. No rotation. Reads as "piece of art
 * laid flat on a desk."
 *
 * Hover: the child rotates by a deterministic per-slot angle (seeded
 * by `index`, ±2.5deg, alternating sign so adjacent items lean
 * opposite ways). Reads as "lift the piece up at an angle to look at
 * it." Reverses on hover-out.
 *
 * The rotation lives on the inner wrapper, not the outer frame, so
 * the surrounding layout never shifts.
 */
export function RotatedFrame({
  children,
  index = 0,
  className = "",
  inset = "70%",
}: {
  children: ReactNode;
  /** Seed for the per-slot rotation. Same index = same angle every
   *  render, so React reordering won't make slides leap around. */
  index?: number;
  className?: string;
  /** How much of the frame's smaller axis the content fills at rest.
   *  '70%' (default) leaves comfortable margin so the rotation has
   *  room to swing without clipping the corners of the content. */
  inset?: string;
}) {
  // Deterministic small rotation for hover. Alternates sign by index
  // parity, magnitude varies by index. Stays inside ±2.5deg so the
  // gesture reads as a deliberate tilt, not crooked-on-purpose.
  const sign = index % 2 === 0 ? 1 : -1;
  const magnitude = 1.05 + (index % 3) * 0.5;
  const rotateHover = sign * magnitude;

  const innerStyle: CSSProperties = {
    width: inset,
    maxHeight: inset,
    ["--rotate-hover" as string]: `${rotateHover}deg`,
  };

  return (
    <div
      className={[
        // Frame surface. Centered content via flex. group/frame so
        // the inner can hook the parent hover state.
        "group/frame relative flex items-center justify-center overflow-hidden rounded-md bg-card",
        className,
      ].join(" ")}
    >
      {/* Inner wrapper applies the rotation on hover. Width is capped
          to `inset` so the content never reaches the frame edges. */}
      <div
        className="flex items-center justify-center transition-transform duration-500 ease-out [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain [&_video]:max-w-full [&_video]:max-h-full [&_video]:object-contain group-hover/frame:[transform:rotate(var(--rotate-hover))]"
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}
