"use client";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
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
    const paused = () => !visible || region.matches(":hover") || region.contains(document.activeElement) || document.hidden || reduced.matches || [...el.querySelectorAll("video")].some(v => !v.paused && !v.ended);
    const update = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      const active = !paused();
      el.dataset.rotation = active ? "running" : "paused";
      setRunning(active);
      if (bar) bar.style.transform = `scaleX(${reduced.matches ? 1 : elapsed / 12000})`;
      last = performance.now();
      if (active) frame = requestAnimationFrame(tick);
    };
    const tick = (now: number) => {
      if (paused()) { update(); return; }
      elapsed += Math.min(now - last, 100); last = now;
      if (bar) bar.style.transform = `scaleX(${Math.min(elapsed / 12000, 1)})`;
      if (elapsed >= 12000) { setIndex(i => (i + 1) % count); return; }
      frame = requestAnimationFrame(tick);
    };
    const defer = () => queueMicrotask(update);
    const observer = new IntersectionObserver(entries => { visible = entries[0].intersectionRatio >= 0.3; update(); }, { threshold: [0, 0.3] });
    observer.observe(el);
    for (const event of ["pointerenter", "pointerleave", "focusin", "focusout", "play", "pause", "ended"]) region.addEventListener(event, defer, true);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      for (const event of ["pointerenter", "pointerleave", "focusin", "focusout", "play", "pause", "ended"]) region.removeEventListener(event, defer, true);
      document.removeEventListener("visibilitychange", update); reduced.removeEventListener("change", update);
    };
  }, [count, index, setIndex]);
  return { ref, running };
}
