"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Kerberus dual theme: "dev" (near-black + teal) and "design"
 * (warm paper + ember). The active mode lives on `<html data-pz-mode>`,
 * set pre-paint by the no-flash script in the root layout, and mirrored
 * to localStorage under `perz.mode`. This module is a tiny external
 * store so the FAB and any other control read/write mode without a
 * context provider; the CSS in globals.css does the actual theming off
 * the html attribute.
 */

export type ThemeMode = "dev" | "design";

const STORAGE_KEY = "perz.mode";
const listeners = new Set<() => void>();

function readMode(): ThemeMode {
  if (typeof document === "undefined") return "dev";
  const m = document.documentElement.dataset.pzMode;
  return m === "design" ? "design" : "dev";
}

function writeMode(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.pzMode = mode;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // storage unavailable (private mode / quota) — attr still applies
  }
  listeners.forEach((cb) => cb());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Read the active mode reactively + a toggle. Server snapshot is
 *  "dev" so SSR matches the layout's default `data-pz-mode="dev"`. */
export function useTheme() {
  const mode = useSyncExternalStore(subscribe, readMode, () => "dev" as const);
  const toggle = useCallback(() => {
    writeMode(readMode() === "dev" ? "design" : "dev");
  }, []);
  return { mode, isDark: mode === "dev", toggle };
}
