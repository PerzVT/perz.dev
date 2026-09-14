"use client";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
const DWELL_MS = 7000;

export function useAutoAdvance(count: number, setIndex: Dispatch<SetStateAction<number>>, index: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || count < 2) return;
    const region = el.closest<HTMLElement>(".pf-recommendations") || el;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const bar = el.querySelector<HTMLElement>('.pf-dots [aria-current="true"] .pf-timer-fill');
    let visible = false, elapsed = 0, last = 0, frame = 0, disposed = false;
    let hovered = matchMedia("(hover: hover)").matches && region.matches(":hover");
    const paused = () => !visible || hovered || region.matches(":focus-visible") || !!region.querySelector(":focus-visible") || document.hidden || reduced.matches || [...el.querySelectorAll("video")].some(v => !v.paused && !v.ended);
    const update = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      const active = !paused();
      el.dataset.rotation = active ? "running" : "paused";
      setRunning(active);
      if (bar) bar.style.transform = `scaleX(${reduced.matches ? 1 : elapsed / DWELL_MS})`;
      last = performance.now();
      if (active) frame = requestAnimationFrame(tick);
    };
    const tick = (now: number) => {
      if (paused()) { update(); return; }
      elapsed += now - last; last = now;
      if (bar) bar.style.transform = `scaleX(${Math.min(elapsed / DWELL_MS, 1)})`;
      if (elapsed >= DWELL_MS) { setIndex(i => (i + 1) % count); return; }
      frame = requestAnimationFrame(tick);
    };
    const defer = () => queueMicrotask(update);
    const enter = (event: PointerEvent) => { if (event.pointerType !== "touch") { hovered = true; update(); } };
    const leave = () => { hovered = false; update(); };
    region.addEventListener("pointerenter", enter);
    region.addEventListener("pointerleave", leave);
    const observer = new IntersectionObserver(entries => { visible = entries[0].intersectionRatio >= 0.3; update(); }, { threshold: [0, 0.3] });
    observer.observe(el);
    for (const event of ["focusin", "focusout", "play", "pause", "ended"]) region.addEventListener(event, defer, true);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      region.removeEventListener("pointerenter", enter); region.removeEventListener("pointerleave", leave);
      for (const event of ["focusin", "focusout", "play", "pause", "ended"]) region.removeEventListener(event, defer, true);
      document.removeEventListener("visibilitychange", update); reduced.removeEventListener("change", update);
    };
  }, [count, index, setIndex]);
  return { ref, running };
}
