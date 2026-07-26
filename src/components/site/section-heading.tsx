"use client";

import { LetterCascade } from "@/components/ui/letter-cascade";

/**
 * Section heading with a per-letter cascade on hover. Renders a real
 * <h2> for structure; the cascade span inside carries an aria-label so
 * assistive tech reads the phrase rather than spelling it out letter by
 * letter. Reduced-motion users get a plain heading (the cascade bails
 * out inside the component).
 *
 * `sizeClass` replaces the default type scale rather than appending to
 * it — two arbitrary `text-[…]` utilities have equal specificity, so
 * appending would leave the winner up to stylesheet order.
 */
export function SectionHeading({
  children,
  sizeClass = "text-[22px] font-bold tracking-[-0.018em]",
  className = "",
}: {
  children: string;
  sizeClass?: string;
  className?: string;
}) {
  return (
    <h2 className={`${sizeClass} text-pz-ink ${className}`}>
      <LetterCascade text={children} />
    </h2>
  );
}
