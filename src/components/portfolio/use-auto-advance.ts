"use client";
import {
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
export function useAutoAdvance(
  count: number,
  setIndex: Dispatch<SetStateAction<number>>,
) {
  const ref = useRef<HTMLDivElement>(null);
  const running = true;
  useEffect(() => {
    const el = ref.current;
    if (!el || count < 2 || !running) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setTimeout>;
    const stop = () => clearTimeout(timer);
    const schedule = () => {
      stop();
      if (
        !visible ||
        document.hidden ||
        reduced.matches ||
        el.matches(":hover") ||
        el.contains(document.activeElement) ||
        [...el.querySelectorAll("video")].some((v) => !v.paused)
      )
        return;
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % count);
        schedule();
      }, 12000);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        schedule();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    const resume = () => queueMicrotask(schedule);
    el.addEventListener("pointerenter", stop);
    el.addEventListener("pointerleave", schedule);
    el.addEventListener("focusin", stop);
    el.addEventListener("focusout", resume);
    el.addEventListener("play", stop, true);
    el.addEventListener("pause", schedule, true);
    el.addEventListener("ended", schedule, true);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      stop();
      observer.disconnect();
      el.removeEventListener("pointerenter", stop);
      el.removeEventListener("pointerleave", schedule);
      el.removeEventListener("focusin", stop);
      el.removeEventListener("focusout", resume);
      el.removeEventListener("play", stop, true);
      el.removeEventListener("pause", schedule, true);
      el.removeEventListener("ended", schedule, true);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [count, running, setIndex]);
  return { ref, running };
}
