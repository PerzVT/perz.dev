import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Site button. Variants: `primary` (filled accent), `secondary`
 * (hairline outline), `ghost` (underline on hover). Renders a next/link
 * for internal hrefs, a plain anchor for external ones, a <button> when
 * given `onClick` instead of `href`. `accent` overrides the fill for
 * partner CTAs (Meta blue, Discord blurple).
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";

const SIZES = {
  sm: "px-3.5 py-2 text-[13px] gap-1.5 rounded-lg",
  md: "px-[18px] py-[11px] text-[13.5px] gap-2 rounded-lg",
  lg: "px-[22px] py-[13px] text-[15px] gap-2.5 rounded-xl",
} as const;

const VARIANTS: Record<ButtonVariant, string> = {
  // Accent-fill text is never white and never thin.
  primary: "pz-btn pz-btn-primary text-[var(--pz-on-accent)] font-semibold",
  // No fill, no border utility: the ring is an inset shadow, so a
  // scroll container can't clip it.
  secondary: "pz-btn pz-btn-secondary text-pz-ink2 font-semibold hover:text-pz-ink",
  // For in-card actions like "Read more".
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
  accentBg,
  accentFg = "#ffffff",
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
  /** Trailing icon, for arrows placed after the label. */
  iconAfter?: ReactNode;
  /** Partner CTA fill override, e.g. Meta blue "#0064e0". Two plain
   *  strings, not one object: MDX drops object-literal props, so a
   *  <Banner accent={{...}}> would silently lose it. */
  accentBg?: string;
  accentFg?: string;
  external?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pz-accent focus-visible:ring-offset-2 focus-visible:ring-offset-pz-canvas";
  const cls = `${base} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;
  // accentBg sets --pz-btn-bg, which drives the gradient and shadow
  // colour instead of the site accent.
  const style = accentBg
    ? ({ "--pz-btn-bg": accentBg, color: accentFg } as React.CSSProperties)
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
