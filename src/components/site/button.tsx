import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The site's one button. Before this, CTA styling was copy-pasted into
 * five files and the hero shipped a bare text-plus-arrow link, which read
 * as unstyled rather than restrained.
 *
 * Variants: `primary` (filled accent), `secondary` (hairline outline),
 * `ghost` (text with an underline on hover). Renders a next/link for
 * internal hrefs, a plain anchor for external ones (new tab + rel), and
 * a <button> when given `onClick` instead of `href`.
 *
 * `accent` overrides the fill for partner CTAs (Meta blue, Discord
 * blurple) — pass a colour and a readable foreground comes with it.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";

const SIZES = {
  sm: "px-3.5 py-2 text-[13px] gap-1.5 rounded-lg",
  md: "px-[18px] py-[11px] text-[13.5px] gap-2 rounded-lg",
  lg: "px-[22px] py-[13px] text-[15px] gap-2.5 rounded-xl",
} as const;

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "pz-btn pz-btn-primary text-pz-canvas font-bold",
  secondary:
    "pz-btn pz-btn-secondary border border-pz-border2 text-pz-ink font-semibold hover:border-pz-muted",
  // Text-weight action for in-card affordances (card "Read more"). Same
  // family, lower rung — a filled button on every card would shout.
  ghost:
    "font-semibold text-pz-accent px-0 py-0 [&_.pz-btn-label]:underline-offset-4 hover:[&_.pz-btn-label]:underline",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  iconAfter,
  accent,
  external,
  className = "",
  ...rest
}: {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: keyof typeof SIZES;
  /** Leading icon (a lucide element or an <img> for partner marks). */
  icon?: ReactNode;
  /** Trailing icon — use for arrows so they sit after the label. */
  iconAfter?: ReactNode;
  /** Override the primary fill, e.g. Meta blue or Discord blurple. */
  accent?: { bg: string; fg: string };
  external?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pz-accent focus-visible:ring-offset-2 focus-visible:ring-offset-pz-canvas";
  const cls = `${base} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;
  // Partner CTAs (Meta blue, Discord blurple) drive the gradient and the
  // tinted shadow through --pz-btn-bg, so the depth treatment follows the
  // colour instead of being hardcoded to the site accent.
  const style = accent
    ? ({ "--pz-btn-bg": accent.bg, color: accent.fg } as React.CSSProperties)
    : undefined;

  const inner = (
    <>
      {icon}
      <span className="pz-btn-label">{children}</span>
      {iconAfter}
    </>
  );

  if (href) {
    const isExternal = external ?? /^https?:\/\//i.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          style={style}
          data-sfx="click"
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} style={style} data-sfx="click">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} style={style} {...rest}>
      {inner}
    </button>
  );
}
