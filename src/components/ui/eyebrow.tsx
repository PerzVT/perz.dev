import type { ReactNode } from "react";

/**
 * Editorial eyebrow label — the uppercase + tracked micro-text that
 * sits above section titles, CTA cards, and in sidebar sublines.
 *
 * Consolidates what used to be a dozen inline copies of
 *   className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
 * Every instance had drifted slightly (9px vs 10px vs 11px; 0.2em vs
 * 0.25em vs 0.3em), which in aggregate read as AI-template chrome
 * rather than an intentional typographic system.
 *
 * One component, one decision: 11px / tracking-0.18em / medium weight.
 * Slightly larger and tighter than the old pattern so it feels like a
 * publication masthead rather than a form-field label.
 *
 * Tones:
 * - `muted` (default) — sits above body content on a neutral surface.
 * - `foreground` — when you need more presence (e.g. first-touch nav).
 * - `on-color` — for use on a saturated coloured button/card.
 * - `accent` — inherit colour from an external className override.
 */
export function Eyebrow({
  children,
  tone = "muted",
  as: Tag = "span",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "foreground" | "on-color" | "accent";
  as?: "span" | "div" | "p";
  className?: string;
}) {
  const toneCls =
    tone === "foreground"
      ? "text-foreground/80"
      : tone === "on-color"
        ? "text-white/80"
        : tone === "accent"
          ? ""
          : "text-muted-foreground";
  return (
    <Tag
      className={[
        // Mono eyebrow — matches the Sam Will / Jesse Warren
        // pattern where small caps labels sit in a technical
        // mono font, giving them a different visual register from
        // the body sans. JetBrains Mono is already loaded as
        // --font-mono.
        "font-mono text-[11px] font-medium uppercase tracking-[0.18em]",
        toneCls,
        className ?? "",
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
