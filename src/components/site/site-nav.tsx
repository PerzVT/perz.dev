"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { setReveal } from "@/lib/reveal";
import { siteConfig } from "@/lib/config";
import { Sprite } from "@/components/sprite";
import { SpriteHint } from "@/components/site/sprite-hint";

/**
 * Sticky top nav. Logo box, wordmark and links sit together on the
 * left; the sprite is the right-hand corner. The pane is
 * `.pz-nav-surface`: semi-transparent canvas, no blur, because a
 * blurred fixed strip over the looping hero reel is what stalled the
 * Windows compositor. Fits 375px without overflow.
 */

const LINKS = [
  { href: "/projects", label: "Work", match: (p: string) => p.startsWith("/projects") },
  { href: "/resume", label: "Résumé", match: (p: string) => p === "/resume" },
  { href: "/#contact", label: "Contact", match: () => false },
] as const;

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="pz-nav-surface sticky top-0 z-50 border-b border-pz-border">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center px-[clamp(20px,4vw,32px)]">
        <Link
          href="/"
          onMouseEnter={() => setReveal(true)}
          onMouseLeave={() => setReveal(false)}
          onFocus={() => setReveal(true)}
          onBlur={() => setReveal(false)}
          aria-label="Home"
          className="mr-[clamp(28px,5vw,56px)] flex flex-none items-center gap-2.5"
        >
          {/* Square logo plate. Placeholder until the real mark lands. */}
          <span
            aria-hidden
            className="h-8 w-8 flex-none rounded-[var(--r-icon)] bg-pz-tint-hi ring-1 ring-inset ring-pz-border2"
          />
          <span className="pz-wordmark text-base leading-[22px] text-pz-ink">
            {siteConfig.name}
          </span>
        </Link>

        {/* Links own their own gap. The brand's right margin carries a
            wider break, so the lockup and the nav read as two groups
            rather than one evenly spaced row of five. */}
        <div className="flex items-center gap-[clamp(14px,2vw,24px)]">
          {LINKS.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`text-[13.5px] transition-colors hover:text-pz-ink ${
                  active ? "text-pz-ink" : "text-pz-ink2"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Sprite owns the right corner. Its own button, never a link,
            so clicking the mascot doesn't navigate. */}
        <span className="group/sprite relative ml-auto flex flex-none items-center">
          <Sprite size={30} cycleOnClick />
          <SpriteHint />
        </span>
      </div>
    </nav>
  );
}
