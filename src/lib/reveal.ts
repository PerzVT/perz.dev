"use client";

import { useSyncExternalStore } from "react";

/**
 * Cross-component hover state for the home hero's cover-art reveal.
 * The nav wordmark and the hero art live in different component
 * trees, so this tiny store bridges them without a provider. Setter
 * is a no-op on pages with no hero art layer.
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
