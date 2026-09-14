"use client";
import { useLayoutEffect, useRef, type RefObject } from "react";
export function useCarouselMotion(
  ref: RefObject<HTMLDivElement | null>,
  index: number,
  count: number,
) {
  const previous = useRef<{ index: number; node: HTMLElement } | null>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    const rail = root?.querySelector<HTMLElement>("[data-motion-rail]");
    if (!root || !rail) return;
    const old = previous.current;
    previous.current = { index, node: rail.cloneNode(true) as HTMLElement };
    if (
      !old ||
      old.index === index ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const direction =
      index === 0 && old.index === count - 1
        ? 1
        : index === count - 1 && old.index === 0
          ? -1
          : index > old.index
            ? 1
            : -1;
    const card = rail.querySelector<HTMLElement>(".pf-current,.pf-quote");
    const distance =
      (card?.getBoundingClientRect().width || rail.clientWidth) + (parseFloat(getComputedStyle(rail).columnGap) || 32);
    const ghost = old.node;
    ghost.removeAttribute("id");
    ghost.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    ghost.inert = true;
    ghost.setAttribute("aria-hidden", "true");
    ghost.dataset.motionGhost = "true";
    Object.assign(ghost.style, {
      position: "absolute",
      left: `${rail.offsetLeft}px`,
      top: `${rail.offsetTop}px`,
      width: `${rail.offsetWidth}px`,
      height: `${rail.offsetHeight}px`,
      pointerEvents: "none",
      zIndex: "3",
      margin: "0",
    });
    (rail.parentElement?.classList.contains("pf-motion-viewport") ? rail.parentElement : root).appendChild(ghost);
    const options = {
      duration: 380,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both" as const,
    };
    const outgoing = ghost.animate(
      [
        { transform: "translateX(0)", opacity: 1 },
        { transform: `translateX(${-direction * distance}px)`, opacity: 0 },
      ],
      options,
    );
    const incoming = rail.animate(
      [
        { transform: `translateX(${direction * distance}px)`, opacity: 0 },
        { transform: "translateX(0)", opacity: 1 },
      ],
      options,
    );
    outgoing.finished.then(() => ghost.remove()).catch(() => {});
    incoming.finished.then(() => incoming.cancel()).catch(() => {});
    return () => {
      ghost.remove();
      outgoing.cancel();
      incoming.cancel();
    };
  }, [index, count, ref]);
}
