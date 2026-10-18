"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useLoopingCarousel(count: number, initial = 0, align: "center" | "start" = "center") {
  const start = Math.max(0, Math.min(initial, count - 1));
  const [index, setIndex] = useState(start);
  const [viewportRef, api] = useEmblaCarousel({
    loop: count > 1,
    align,
    startIndex: start,
    duration: 25,
    containScroll: false,
    // Navigation stays outside the viewport; artwork links remain draggable.
    watchDrag: (_api, event) => !(event.target instanceof Element && event.target.closest("button, input, textarea, select")),
  });
  const previous = useCallback(() => api?.scrollPrev(reduceMotion()), [api]);
  const next = useCallback(() => api?.scrollNext(reduceMotion()), [api]);
  const select = useCallback((item: number) => api?.scrollTo(item, reduceMotion()), [api]);
  const ref = useRef<HTMLDivElement>(null);
  // Drives aria-live: silent while the track is in motion, polite once it
  // settles, so a drag announces the slide it lands on rather than every
  // frame it passes through.
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!api) return;
    const element = ref.current;
    const notify = () => element?.dispatchEvent(new Event("carouselmotion"));
    const sync = () => {
      const selected = api.selectedScrollSnap();
      setIndex(selected);
      if (element) element.dataset.selected = String(selected);
    };
    const down = () => { if (element) element.dataset.dragging = "true"; setRunning(true); notify(); };
    const up = () => { if (element) element.dataset.dragging = "false"; notify(); };
    const moving = () => { if (element?.dataset.moving === "true") return; if (element) element.dataset.moving = "true"; setRunning(true); notify(); };
    const settle = () => { if (element) element.dataset.moving = "false"; setRunning(false); notify(); };
    const reset = () => { sync(); up(); settle(); };
    sync();
    api.on("select", sync).on("reInit", reset).on("pointerDown", down)
      .on("pointerUp", up).on("scroll", moving).on("settle", settle);
    return () => {
      api.off("select", sync).off("reInit", reset).off("pointerDown", down)
        .off("pointerUp", up).off("scroll", moving).off("settle", settle);
    };
  }, [api, ref]);
  return { ref, viewportRef, index, running, previous, next, select };
}
