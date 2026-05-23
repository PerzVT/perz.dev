"use client";

import { useEffect } from "react";
import {
  sfxClick,
  sfxHover,
  sfxToggle,
  hydrateSfxFromStorage,
} from "@/lib/sfx";

const INTERACTIVE =
  "button, a, [role='button'], [role='tab'], summary, kbd";

function isInteractive(el: Element | null): HTMLElement | null {
  if (!el) return null;
  const match = (el as HTMLElement).closest?.(INTERACTIVE);
  return match instanceof HTMLElement ? match : null;
}

function optedOut(el: HTMLElement) {
  return el.closest("[data-sfx='off']") !== null;
}

/**
 * Global UI-sound listener. Attaches a single pair of listeners on document
 * and plays sounds via event delegation — no need to touch individual
 * components. Opt out any subtree with `data-sfx="off"`. Choose the toggle
 * sound explicitly with `data-sfx="toggle"`.
 */
export function SfxProvider() {
  useEffect(() => {
    // Read the persisted opt-in once on mount. The synth itself
    // remains default-muted on first visit; this lifts the flag if
    // the user opted in on a prior session.
    hydrateSfxFromStorage();

    // Track last hovered target so we don't spam blips on sub-element moves
    let lastHover: HTMLElement | null = null;

    const onOver = (e: MouseEvent) => {
      const target = isInteractive(e.target as Element);
      if (!target || optedOut(target)) return;
      if (target === lastHover) return;
      lastHover = target;
      sfxHover();
    };

    const onOut = (e: MouseEvent) => {
      const target = isInteractive(e.target as Element);
      if (!target) return;
      // If we're leaving the tracked element entirely, reset.
      const related = e.relatedTarget as Element | null;
      if (!target.contains(related as Node | null)) {
        if (lastHover === target) lastHover = null;
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = isInteractive(e.target as Element);
      if (!target || optedOut(target)) return;
      const kind = target.getAttribute("data-sfx");
      if (kind === "toggle") sfxToggle();
      else sfxClick();
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
