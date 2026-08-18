"use client";

/**
 * "change me" bubble pointing at the nav mascot, so the easter egg is
 * findable (a small pixel sprite reads as a logo otherwise).
 *
 * Shows on hover at any time via the `group/sprite` wrapper, and
 * unprompted on first visit until the sprite is clicked once.
 * Absolutely positioned so it never shifts the nav layout; hidden from
 * assistive tech since the sprite button already carries a real label.
 */
export function SpriteHint({ show }: { show: boolean }) {
  return (
    // `inset-y-0` + flex instead of `top-1/2` with a -50% translate: an
    // odd pixel height put the translate on a fractional offset,
    // rendering the text and star soft.
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 left-[calc(100%+10px)] z-20 hidden items-center whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sprite:opacity-100 sm:flex ${
        show ? "opacity-100" : ""
      }`}
    >
      {/* Fixed 84 x 24: sized to content it lands on fractional pixels
          (83.66 x 22.5), rendering the text and star soft. 84px rounds
          the natural width up so nothing clips. */}
      <span className="relative inline-flex h-6 w-[84px] items-center justify-center rounded-[10px] bg-pz-ink text-[12.5px] font-bold leading-none text-pz-canvas">
        {/* Tail: tucked 3px under the capsule, drawn behind it, so the
            rotated corner leaves no seam. */}
        <span className="absolute left-[-3px] top-1/2 -z-10 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] bg-pz-ink" />
        change me
        {/* Sparkle. Anchored right now that the capsule has a fixed
            width, so the edge lands on a whole pixel. */}
        <svg
          viewBox="0 0 24 24"
          className="absolute -right-2 -top-2.5 h-[14px] w-[14px] text-pz-accent"
          fill="currentColor"
        >
          <path d="M12 0l1.9 8.1L22 10l-8.1 1.9L12 20l-1.9-8.1L2 10l8.1-1.9z" />
        </svg>
      </span>
    </span>
  );
}
