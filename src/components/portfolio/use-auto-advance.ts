"use client";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
export function useAutoAdvance(
  count: number,
  setIndex: Dispatch<SetStateAction<number>>,
  index: number,
) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || count < 2) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false,
      hovered = el.matches(":hover"),
      focused = el.contains(document.activeElement),
      playing = false;
    let elapsed = 0,
      last = performance.now(),
      frame = 0;
    const fill = () =>
      el.querySelector<HTMLElement>(
        '.pf-dots [aria-current="true"] .pf-timer-fill',
      );
    const tick = (now: number) => {
      const paused =
        !visible ||
        hovered ||
        focused ||
        playing ||
        document.hidden ||
        reduced.matches;
      if (!paused) elapsed += Math.min(now - last, 100);
      last = now;
      const bar = fill();
      if (bar)
        bar.style.transform = `scaleX(${reduced.matches ? 1 : Math.min(elapsed / 12000, 1)})`;
      el.dataset.rotation = paused ? "paused" : "running";
      if (elapsed >= 12000) {
        setIndex((i) => (i + 1) % count);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    const enter = () => {
      hovered = true;
    };
    const leave = () => {
      hovered = false;
    };
    const focus = () => {
      focused = true;
    };
    const blur = () =>
      queueMicrotask(() => {
        focused = el.contains(document.activeElement);
      });
    const video = () => {
      playing = [...el.querySelectorAll("video")].some((v) => !v.paused);
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", focus);
    el.addEventListener("focusout", blur);
    el.addEventListener("play", video, true);
    el.addEventListener("pause", video, true);
    el.addEventListener("ended", video, true);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", focus);
      el.removeEventListener("focusout", blur);
      el.removeEventListener("play", video, true);
      el.removeEventListener("pause", video, true);
      el.removeEventListener("ended", video, true);
    };
  }, [count, index, setIndex]);
  return { ref, running: true };
}
