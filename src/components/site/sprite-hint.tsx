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
    <span
      aria-hidden
      className={`pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-20 hidden -translate-y-1/2 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sprite:opacity-100 sm:block ${
        show ? "opacity-100" : ""
      }`}
    >
      <span className="relative inline-flex items-center rounded-[10px] bg-pz-ink px-2.5 py-1 text-[12.5px] font-bold leading-none text-pz-canvas">
        {/* Tail, pointing back at the sprite. */}
        <span className="absolute left-[-4px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] bg-pz-ink" />
        change me
        {/* Sparkle — the bit that makes it feel hand-made, not a tooltip. */}
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
