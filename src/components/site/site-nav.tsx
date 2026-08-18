"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { setReveal } from "@/lib/reveal";
import { siteConfig } from "@/lib/config";
import { Sprite } from "@/components/sprite";
import { SpriteHint } from "@/components/site/sprite-hint";

/**
 * Shared sticky top nav. Solid canvas background + hairline border (no
 * backdrop-blur — it stalls the Windows compositor and freezes fixed
 * chrome). The wordmark links home and, on hover/focus, drives the home
 * hero's cover-art reveal via the reveal store. Work / Résumé / Contact;
 * the current route reads at full ink. Fits 375px without overflow.
 */

const LINKS = [
  { href: "/projects", label: "Work", match: (p: string) => p.startsWith("/projects") },
  { href: "/resume", label: "Résumé", match: (p: string) => p === "/resume" },
  { href: "/#contact", label: "Contact", match: () => false },
] as const;

const HINT_KEY = "perz.spriteHinted";

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  // The hint appears shortly after load for people who haven't used the
  // easter egg. Server and first client render both say "hidden" so
  // hydration agrees; the effect turns it on. Once clicked it's retired
  // permanently — a nudge that keeps nagging is just noise.
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
      // storage unavailable — the hint just returns next visit
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-pz-border bg-pz-canvas transition-colors duration-[450ms]">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-[clamp(14px,2vw,24px)] px-[clamp(20px,4vw,32px)]">
        {/* The sprite is its own button (click cycles the mascot) and sits
            outside the home link, so the easter egg never navigates. The
            hint bubble retires for good once it's been used. */}
        <div className="mr-auto flex items-center gap-2.5">
          <span className="relative flex items-center">
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
