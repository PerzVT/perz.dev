import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * Editorial stat block. Sam-Will-style: number in display weight,
 * label in eyebrow caps, optional href to source. No background fill,
 * no border, no pill. The type does the work.
 *
 * Used in two contexts:
 *   1. Hero strip — 3 horizontal blocks under the tagline as a
 *      credentials-tier signal (Discord size, downloads, years).
 *   2. Project page Impact section — same component, just rendered
 *      inside a dark-treated container regardless of theme.
 *
 * The container choice ([StatBlocks] vs [ImpactStats]) is what
 * differentiates the two use sites visually; the leaf node here
 * is identical.
 */
export function StatBlocks({ children }: { children: ReactNode }) {
  // justify-center on mobile (single-column stack reads better centered)
  // flips to justify-start once the hero's text column is left-aligned
  // at md+. Previously the stats sat orphaned in the middle of an
  // otherwise left-aligned column.
  return (
    <div className="mt-10 flex flex-wrap items-stretch justify-center gap-x-10 gap-y-6 sm:gap-x-14 md:justify-start">
      {children}
    </div>
  );
}

/**
 * One stat. If `href` is supplied the whole block becomes a link with
 * a hover underline-sweep on the number (matching the gesture used by
 * project-grid and projects-index card titles); otherwise it renders
 * as static text. External hrefs open in a new tab.
 */
export function Stat({
  number,
  label,
  sub,
  href,
}: {
  number: string;
  label: string;
  sub?: string;
  href?: string;
}) {
  const numberClass = href
    ? // Linked: underline sweeps from 0 to 100% on hover. Same vocabulary
      // the grid card titles use, so a recruiter learns one gesture for
      // "this text leads somewhere" across the whole site.
      "font-display text-lg leading-none text-foreground sm:text-xl bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-[2px] transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]"
    : "font-display text-lg leading-none text-foreground sm:text-xl";

  const inner = (
    <span className="flex flex-col gap-1">
      <span className={numberClass}>{number}</span>
      <Eyebrow tone="muted">{label}</Eyebrow>
      {sub && (
        <span className="text-[11px] lowercase text-muted-foreground/70">
          {sub}
        </span>
      )}
    </span>
  );

  if (!href) return inner;

  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-sfx="click"
        className="group inline-flex"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} data-sfx="click" className="group inline-flex">
      {inner}
    </Link>
  );
}
