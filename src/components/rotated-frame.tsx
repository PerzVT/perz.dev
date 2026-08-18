"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * RotatedFrame: fixed-aspect frame with padding around the child,
 * tilting it on hover then reversing on hover-out. Rotation angle is
 * deterministic per `index` (±2.5deg, alternating sign). The child
 * should be a natural-sized <img> or <video>, not `fill`/absolute;
 * it sizes itself with max-w-full / max-h-full + object-contain.
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
  /** Tailwind padding class for breathing room inside the frame.
   *  Default 15% per side leaves room for the hover rotation to
   *  swing without clipping. */
  inset?: string;
}) {
  const sign = index % 2 === 0 ? 1 : -1;
  const magnitude = 1.05 + (index % 3) * 0.5;
  const rotateHover = sign * magnitude;

  const style: CSSProperties = {
    ["--rotate-hover" as string]: `${rotateHover}deg`,
  };

  return (
    <div
      className={[
        "group/frame relative overflow-hidden rounded-md bg-pz-surface",
        className,
      ].join(" ")}
      style={style}
    >
      <div
        className={[
          // inset (padding) reserves the empty area the rotation swings into.
          "absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover/frame:[transform:rotate(var(--rotate-hover))]",
          inset,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
