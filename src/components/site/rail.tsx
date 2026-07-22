"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal rail — a seamless infinite carousel. The items render in
 * three identical copies; the scroll position is quietly nudged back by
 * one copy-width whenever it drifts out of the middle band, so scrolling
 * (touch, trackpad, mouse drag, or the arrow buttons) never dead-ends and
 * the last item flows straight into the first. A jump of exactly one
 * copy-width is invisible because the copies are identical.
 *
 * The flanking copies are hidden from assistive tech and removed from the
 * tab order, so nothing is announced or focused three times. Optional
 * gentle auto-advance pauses on hover/focus and is disabled under
 * prefers-reduced-motion. A drag past a few pixels suppresses the click
 * that follows, so dragging never opens a card. The edges fade so a
 * partial card reads as "more", not "chopped".
 */
export function Rail({
  children,
  ariaLabel,
  autoAdvanceMs,
  mediaFadeHeight,
}: {
  children: ReactNode;
  ariaLabel: string;
  autoAdvanceMs?: number;
  /** When set (a CSS length matching the card's media height, e.g.
   *  "min(123vw,510px)"), soft edge fades cover only that top band, so
   *  card text never fades. Omit for rails whose cards have no fixed
   *  media height (e.g. the recommendations quotes). */
  mediaFadeHeight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const periodRef = useRef(0);

  const items = useMemo(() => Children.toArray(children), [children]);
  const count = items.length;

  // Three identical copies. Copy 1 (the middle) is the accessible one;
  // the clones are hidden from AT and taken out of the tab order.
  const track = useMemo(
    () =>
      [0, 1, 2].flatMap((copy) =>
        items.map((child, i) => {
          if (!isValidElement(child)) return child;
          const hidden = copy === 1 ? {} : { "aria-hidden": true, tabIndex: -1 };
          return cloneElement(child as ReactElement<Record<string, unknown>>, {
            key: `c${copy}-${i}`,
            ...hidden,
          });
        }),
      ),
    [items],
  );

  // One copy's width = distance between the same item in adjacent copies.
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el || el.children.length <= count) return 0;
    const first = el.children[0] as HTMLElement;
    const nextCopy = el.children[count] as HTMLElement;
    const p = nextCopy.offsetLeft - first.offsetLeft;
    periodRef.current = p;
    return p;
  }, [count]);

  // Start centred on the middle copy; re-centre on resize.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const centre = () => {
      const p = measure();
      if (p > 0) el.scrollLeft = p;
    };
    centre();
    const ro = new ResizeObserver(centre);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // Keep the scroll position inside the middle band [0.5p, 1.5p].
  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const p = periodRef.current || measure();
    // Only loop when a copy is wider than the viewport (enough content).
    if (p <= 0 || p <= el.clientWidth) return;
    if (el.scrollLeft < p * 0.5) el.scrollLeft += p;
    else if (el.scrollLeft > p * 1.5) el.scrollLeft -= p;
  }, [measure]);

  // Mouse drag to scroll, with click-suppression after a real drag, plus
  // the loop-repositioning scroll listener.
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
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  // Gentle auto-advance; the reposition handles the wrap.
  useEffect(() => {
    if (!autoAdvanceMs) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (paused) return;
      el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [autoAdvanceMs, paused]);

  const nudge = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrowBtn =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-pz-border2 bg-pz-raised text-pz-ink shadow-[0_6px_20px_rgba(0,0,0,0.28)] transition-colors hover:border-pz-muted sm:flex";

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
        className="flex cursor-grab select-none gap-4 overflow-x-auto pb-4 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {track}
      </div>

      {mediaFadeHeight && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-[2] w-8"
            style={{
              height: mediaFadeHeight,
              background:
                "linear-gradient(to right, var(--pz-canvas), transparent)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 z-[2] w-8"
            style={{
              height: mediaFadeHeight,
              background:
                "linear-gradient(to left, var(--pz-canvas), transparent)",
            }}
          />
        </>
      )}

      <button
        type="button"
        aria-label="Previous"
        onClick={() => nudge(-1)}
        className={`${arrowBtn} left-[-8px]`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => nudge(1)}
        className={`${arrowBtn} right-[-8px]`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
