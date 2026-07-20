"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SlidersHorizontal, Sun, Moon, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/lib/theme";
import {
  isSfxMuted,
  onSfxMuteChange,
  setSfxMuted,
  sfxToggle,
} from "@/lib/sfx";

/**
 * Fixed bottom-right options FAB. Hovering (or clicking) the circular
 * button flies out two controls — theme (dark "dev" ⇄ light "design")
 * and UI sound — as the site's single switcher for both, on every page.
 * No backdrop-blur (Windows compositor stall). Keyboard: the trigger
 * toggles the flyout; Esc closes and restores focus; the actions are
 * only in the tab order while open. Motion is transform/opacity and is
 * flattened by the global reduced-motion rule.
 */

const subscribeMute = (cb: () => void) => onSfxMuteChange(cb);

export function SiteFab() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const muted = useSyncExternalStore(subscribeMute, isSfxMuted, () => true);
  const soundOn = !muted;

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleSound = () => {
    const next = !soundOn;
    setSfxMuted(!next);
    // Confirm chirp only when turning ON (context is unmuted by now).
    if (next) sfxToggle();
  };

  // Shared styling for the flyout rows (label chip + round action).
  const rowStyle = (delay: string): React.CSSProperties => ({
    opacity: open ? 1 : 0,
    visibility: open ? "visible" : "hidden",
    pointerEvents: open ? "auto" : "none",
    transform: open ? "translateY(0)" : "translateY(10px)",
    transition: `opacity .18s ease ${delay}, transform .22s var(--ease-out) ${delay}, visibility .18s`,
  });

  const actionBtn =
    "flex h-11 w-11 flex-none items-center justify-center rounded-full border border-pz-border2 bg-pz-raised shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-colors hover:border-pz-muted active:translate-y-px";
  const chip =
    "rounded-md border border-pz-border bg-pz-raised px-[9px] py-1 text-[11.5px] font-semibold text-pz-ink2 whitespace-nowrap";

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="fixed bottom-[clamp(16px,3vw,26px)] right-[clamp(16px,3vw,26px)] z-[90] flex flex-col-reverse items-end gap-2.5"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Site options — theme and sound"
        data-sfx="off"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-pz-border2 bg-pz-raised text-pz-ink shadow-[0_8px_26px_rgba(0,0,0,0.28)] transition-[border-color,transform] duration-200 hover:border-pz-muted active:scale-95"
      >
        <SlidersHorizontal className="h-[17px] w-[17px]" strokeWidth={2} />
      </button>

      {/* Sound */}
      <div className="flex items-center gap-[9px]" style={rowStyle("0s")}>
        <span className={chip}>{soundOn ? "Sound off" : "Sound on"}</span>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          data-sfx="off"
          tabIndex={open ? 0 : -1}
          className={actionBtn}
          style={{ color: soundOn ? "var(--pz-accent)" : "var(--pz-ink2)" }}
        >
          {soundOn ? (
            <Volume2 className="h-[15px] w-[15px]" strokeWidth={2.2} />
          ) : (
            <VolumeX className="h-[15px] w-[15px]" strokeWidth={2.2} />
          )}
        </button>
      </div>

      {/* Theme */}
      <div className="flex items-center gap-[9px]" style={rowStyle(".03s")}>
        <span className={chip}>{isDark ? "Light theme" : "Dark theme"}</span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          data-sfx="toggle"
          tabIndex={open ? 0 : -1}
          className={`${actionBtn} text-pz-ink2 hover:text-pz-ink`}
        >
          {isDark ? (
            <Sun className="h-[15px] w-[15px]" strokeWidth={2} />
          ) : (
            <Moon className="h-[15px] w-[15px]" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
