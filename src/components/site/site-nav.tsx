"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { setReveal } from "@/lib/reveal";
import { siteConfig } from "@/lib/config";
import { Sprite } from "@/components/sprite";
import { SpriteHint } from "@/components/site/sprite-hint";

/**
 * Sticky top nav. Solid background, not backdrop-blur (blur stalls
 * the Windows compositor and freezes fixed chrome). The wordmark
 * links home and drives the hero's cover-art reveal on hover/focus.
 * Fits 375px without overflow.
 */

const LINKS = [
  { href: "/projects", label: "Work", match: (p: string) => p.startsWith("/projects") },
  { href: "/resume", label: "Résumé", match: (p: string) => p === "/resume" },
  { href: "/#contact", label: "Contact", match: () => false },
] as const;

const HINT_KEY = "perz.spriteHinted";

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  // Starts hidden so server and first render match (no hydration
  // mismatch); the effect flips it on after load for anyone who
  // hasn't used the easter egg. Dismissing it retires it for good.
  const [hint, setHint] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_KEY)) return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => setHint(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  const dismissHint = () => {
    setHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      // storage unavailable: the hint just returns next visit
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-pz-border bg-pz-canvas transition-colors duration-[450ms]">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-[clamp(14px,2vw,24px)] px-[clamp(20px,4vw,32px)]">
        {/* Sprite is its own button, separate from the home link, so
            clicking the mascot never navigates. */}
        <div className="mr-auto flex items-center gap-2.5">
          <span className="group/sprite relative flex items-center">
            <Sprite size={30} cycleOnClick onCycle={dismissHint} />
            <SpriteHint show={hint} />
          </span>
          <Link
            href="/"
            onMouseEnter={() => setReveal(true)}
            onMouseLeave={() => setReveal(false)}
            onFocus={() => setReveal(true)}
            onBlur={() => setReveal(false)}
            aria-label="Home"
            className="pz-wordmark text-base leading-[22px] text-pz-ink"
          >
            {siteConfig.name}
          </Link>
        </div>

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
    </nav>
  );
}
