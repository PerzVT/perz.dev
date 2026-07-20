"use client";

import { useSyncExternalStore } from "react";

/**
 * Cross-component hover state for the home hero's cover-art reveal.
 * Hovering (or focusing) the nav wordmark fades/unblurs a full-bleed
 * art layer behind the hero — a placeholder for a future gameplay reel.
 * The wordmark lives in the shared nav while the art lives in the home
 * hero, so this tiny store bridges the two without a provider. On pages
 * with no hero art layer the setter is simply unobserved.
 */

let revealed = false;
const listeners = new Set<() => void>();

export function setReveal(v: boolean) {
  if (revealed === v) return;
  revealed = v;
  listeners.forEach((cb) => cb());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Reactive read of the reveal state. Server + first client render
 *  return false (art hidden) so hydration agrees. */
export function useReveal() {
  return useSyncExternalStore(
    subscribe,
    () => revealed,
    () => false,
  );
}
