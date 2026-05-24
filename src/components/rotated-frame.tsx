"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * RotatedFrame — a fixed-aspect frame with padding around the child,
 * tilting the child on hover.
 *
 * Rest state: child centered inside padded frame. No rotation. Reads
 * as "piece of art laid flat on a desk." The padding (controlled by
 * the `inset` prop) gives margin for the rotation to swing without
 * clipping out at the corners.
 *
 * Hover: child rotates by a deterministic per-slot angle (seeded by
 * `index`, ±2.5deg, alternating sign so adjacent items lean opposite
 * ways). Reverses on hover-out.
 *
 * The child should be a natural-sized <img>, <video>, or the like —
 * not a `fill`/absolute-positioned element. RotatedFrame provides
 * the rotating padded container; the child decides its own sizing
 * via max-w-full / max-h-full + object-contain.
 */
export function RotatedFrame({
  children,
  index = 0,
  className = "",
  inset = "p-[15%]",
}: {
  children: ReactNode;
  /** Seed for the per-slot rotation. Same index = same angle. */
  index?: number;
  className?: string;
  /** Tailwind padding class controlling how much breathing room the
   *  child gets inside the frame. Default leaves 15% on each side
   *  (~70% content width on a square frame) so the rotation has
   *  room to swing without clipping. */
  inset?: string;
}) {
  // Deterministic per-slot rotation magnitude/sign.
  const sign = index % 2 === 0 ? 1 : -1;
  const magnitude = 1.05 + (index % 3) * 0.5;
  const rotateHover = sign * magnitude;

  const style: CSSProperties = {
    ["--rotate-hover" as string]: `${rotateHover}deg`,
  };

  return (
    <div
      className={[
        "group/frame relative overflow-hidden rounded-md bg-card",
        className,
      ].join(" ")}
      style={style}
    >
      <div
        className={[
          // Full-size inner flex. Padding (inset) reserves the
          // empty area around the content. transition-transform
          // hooks the hover rotation.
          "absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover/frame:[transform:rotate(var(--rotate-hover))]",
          inset,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
