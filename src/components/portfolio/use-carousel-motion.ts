"use client";
import { useLayoutEffect, useRef, type RefObject } from "react";

/** A stable strip moves between items; duplicated end sets make wraps continuous. */
export function useCarouselMotion(ref: RefObject<HTMLDivElement | null>, index: number, count: number) {
  const previous = useRef(index);
  const position = useRef(count + index);
  const animation = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    const track = root?.querySelector<HTMLElement>("[data-motion-track]");
    if (!root || !track || !count) return;
    const viewport = track.parentElement!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const offset = (slot: number) => {
      const card = track.children[slot] as HTMLElement;
      if (!card) return 0;
      return -card.offsetLeft + (track.dataset.center === "true" ? (viewport.clientWidth - card.offsetWidth) / 2 : 0);
    };
    const canonical = count + index;
    let delta = index - previous.current;
    if (previous.current === count - 1 && index === 0) delta = 1;
    else if (previous.current === 0 && index === count - 1) delta = -1;
    previous.current = index;
    const from = getComputedStyle(track).transform;
    animation.current?.cancel();
    const settle = () => {
      animation.current?.cancel();
      animation.current = null;
      position.current = canonical;
      track.style.transform = `translateX(${offset(canonical)}px)`;
    };
    if (!delta || reduced.matches) settle();
    else {
      position.current = Math.max(0, Math.min(count * 3 - 1, position.current + delta));
      const to = `translateX(${offset(position.current)}px)`;
      track.style.transform = to;
      const current = track.animate([{ transform: from === "none" ? `translateX(${offset(canonical - delta)}px)` : from }, { transform: to }], {
        duration: Math.min(900, 420 + Math.max(0, Math.abs(delta) - 1) * 90), easing: "cubic-bezier(0.22,1,0.36,1)", fill: "both",
      });
      animation.current = current;
      current.finished.then(() => { if (animation.current === current) settle(); }).catch(() => {});
    }
    // ResizeObserver's first delivery must not cancel a newly started movement.
    let width = viewport.clientWidth;
    const resize = new ResizeObserver(() => { if (viewport.clientWidth !== width) { width = viewport.clientWidth; settle(); } });
    resize.observe(viewport);
    const preference = () => { if (reduced.matches) settle(); };
    reduced.addEventListener("change", preference);
    return () => { resize.disconnect(); reduced.removeEventListener("change", preference); };
  }, [index, count, ref]);
  useLayoutEffect(() => () => animation.current?.cancel(), []);
}
