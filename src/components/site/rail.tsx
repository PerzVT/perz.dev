"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal rail — one row, scrollable by touch, trackpad, mouse drag, or
 * arrow buttons. Optional gentle auto-advance that pauses on hover, focus,
 * or drag, and is disabled under prefers-reduced-motion. A drag past a few
 * pixels suppresses the click that follows, so dragging never opens a card.
 */
export function Rail({
  children,
  ariaLabel,
  autoAdvanceMs,
}: {
  children: ReactNode;
  ariaLabel: string;
  autoAdvanceMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  // Mouse drag to scroll, with click-suppression after a real drag.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;
    let dragged = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      dragged = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragged = true;
      el.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      down = false;
      if (dragged) {
        const kill = (ev: Event) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        el.addEventListener("click", kill, { capture: true, once: true });
        setTimeout(
          () => el.removeEventListener("click", kill, { capture: true }),
          0,
        );
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("scroll", updateArrows);
    };
  }, [updateArrows]);

  // Auto-advance.
  useEffect(() => {
    if (!autoAdvanceMs) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (paused) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [autoAdvanceMs, paused]);

  const nudge = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrowBtn =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-pz-border2 bg-pz-raised text-pz-ink shadow-[0_6px_20px_rgba(0,0,0,0.28)] transition-colors hover:border-pz-muted disabled:pointer-events-none disabled:opacity-0 sm:flex";

  return (
    <div
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={ref}
        role="list"
        aria-label={ariaLabel}
        className="flex cursor-grab select-none gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => nudge(-1)}
        disabled={!canLeft}
        className={`${arrowBtn} left-[-8px]`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => nudge(1)}
        disabled={!canRight}
        className={`${arrowBtn} right-[-8px]`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
