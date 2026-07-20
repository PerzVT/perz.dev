"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { setReveal } from "@/lib/reveal";
import { siteConfig } from "@/lib/config";

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

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-pz-border bg-pz-canvas transition-colors duration-[450ms]">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-[clamp(14px,2vw,24px)] px-[clamp(20px,4vw,32px)]">
        <Link
          href="/"
          onMouseEnter={() => setReveal(true)}
          onMouseLeave={() => setReveal(false)}
          onFocus={() => setReveal(true)}
          onBlur={() => setReveal(false)}
          className="mr-auto flex items-center gap-3 text-pz-ink"
        >
          <span className="pz-wordmark text-base leading-[22px]">
            {siteConfig.name}
          </span>
          <span className="whitespace-nowrap text-[12.5px] font-normal text-pz-muted">
            {siteConfig.role}
          </span>
        </Link>

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
