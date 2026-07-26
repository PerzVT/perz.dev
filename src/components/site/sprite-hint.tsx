"use client";

/**
 * "change me" bubble pointing at the nav mascot — the nudge that makes
 * the easter egg findable, since a small pixel sprite reads as a logo
 * otherwise.
 *
 * Two ways in: it shows on hover at any time (CSS, via the `group/sprite`
 * wrapper), and it shows unprompted on a first visit until the sprite has
 * been clicked once. Absolutely positioned so it can never shift the nav
 * layout, and hidden from assistive tech — the sprite button already
 * carries a real label and this is decoration on top of it.
 */
export function SpriteHint({ show }: { show: boolean }) {
  return (
    // Centred with `inset-y-0` + flex rather than `top-1/2` and a
    // -50% translate: translating by half an odd pixel height put the
    // whole bubble on a fractional offset, which is what made the text
    // and the star render soft.
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 left-[calc(100%+10px)] z-20 hidden items-center whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sprite:opacity-100 sm:flex ${
        show ? "opacity-100" : ""
      }`}
    >
      {/* Fixed 84 x 24. Both dimensions are pinned on purpose: left to
          itself the capsule sized to its text (83.66px wide, 22.5px tall),
          and those fractions put the text and the right-anchored star on
          half pixels, which is what made them render soft. 84px is the
          natural width rounded up, so nothing clips. */}
      <span className="relative inline-flex h-6 w-[84px] items-center justify-center rounded-[10px] bg-pz-ink text-[12.5px] font-bold leading-none text-pz-canvas">
        {/* Tail. Tucked 3px under the capsule and drawn behind it, so the
            rotated corner can't leave a seam where the two meet. */}
        <span className="absolute left-[-3px] top-1/2 -z-10 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] bg-pz-ink" />
        change me
        {/* Sparkle — the bit that makes it feel hand-made, not a tooltip.
            Safe to anchor right now that the capsule has a fixed width, so
            its right edge lands on a whole pixel. */}
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
