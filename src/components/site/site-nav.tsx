"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setReveal } from "@/lib/reveal";
import { siteConfig } from "@/lib/config";
import { Sprite } from "@/components/sprite";
import {
  isSfxMuted,
  onSfxMuteChange,
  setSfxMuted,
  sfxToggle,
} from "@/lib/sfx";

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

const subscribeMute = (cb: () => void) => onSfxMuteChange(cb);

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const muted = useSyncExternalStore(subscribeMute, isSfxMuted, () => true);
  const soundOn = !muted;

  const toggleSound = () => {
    const next = !soundOn;
    setSfxMuted(!next);
    // Confirm chirp only when switching on (audio is unmuted by now).
    if (next) sfxToggle();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-pz-border bg-pz-canvas transition-colors duration-[450ms]">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-[clamp(14px,2vw,24px)] px-[clamp(20px,4vw,32px)]">
        <Link
          href="/"
          onMouseEnter={() => setReveal(true)}
          onMouseLeave={() => setReveal(false)}
          onFocus={() => setReveal(true)}
          onBlur={() => setReveal(false)}
          aria-label="Home"
          className="mr-auto flex items-center gap-2.5 text-pz-ink"
        >
          <Sprite size={30} />
          <span className="pz-wordmark text-base leading-[22px]">
            {siteConfig.name}
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

        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Turn UI sound off" : "Turn UI sound on"}
          title={soundOn ? "Sound on" : "Sound off"}
          data-sfx="off"
          className={`-mr-1 ml-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md transition-colors hover:bg-pz-raised ${
            soundOn ? "text-pz-accent" : "text-pz-ink2 hover:text-pz-ink"
          }`}
        >
          {soundOn ? (
            <Volume2 className="h-[15px] w-[15px]" strokeWidth={2.2} />
          ) : (
            <VolumeX className="h-[15px] w-[15px]" strokeWidth={2.2} />
          )}
        </button>
      </div>
    </nav>
  );
}
