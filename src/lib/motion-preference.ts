"use client";
import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const eventName = "perz-motion";

function subscribe(notify: () => void) {
  const media = matchMedia(query);
  const sync = () => {
    document.documentElement.dataset.motion = isMotionPaused() ? "paused" : "running";
    notify();
  };
  media.addEventListener("change", sync);
  window.addEventListener(eventName, sync);
  window.addEventListener("storage", sync);
  return () => {
    media.removeEventListener("change", sync);
    window.removeEventListener(eventName, sync);
    window.removeEventListener("storage", sync);
  };
}

export function isMotionPaused() {
  return matchMedia(query).matches;
}

export function useMotionPaused() {
  return useSyncExternalStore(subscribe, isMotionPaused, () => true);
}

export function useSystemReducedMotion() {
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false);
}
