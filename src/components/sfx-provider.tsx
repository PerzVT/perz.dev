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
 * Global UI-sound listener: one pair of document listeners, sounds
 * played via event delegation. Opt out a subtree with
 * `data-sfx="off"`; force the toggle sound with `data-sfx="toggle"`.
 */
export function SfxProvider() {
  useEffect(() => {
    // Reads persisted opt-in once on mount; synth defaults to muted
    // until this lifts the flag from a prior session.
    hydrateSfxFromStorage();

    // Tracks the last hovered target so nested pointer moves don't
    // retrigger the hover blip.
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
      // Reset only when leaving the element entirely (not into a child).
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
