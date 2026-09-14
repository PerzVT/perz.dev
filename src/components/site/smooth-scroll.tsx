"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling, mounted once in the root layout.
 *
 * Skipped under prefers-reduced-motion, since Lenis would otherwise
 * fight the global reduced-motion CSS. Loaded dynamically so it never
 * lands in the first-paint bundle.
 *
 * In-page anchors (#work, #contact) are handled explicitly: Lenis owns
 * the scroll position, so a native hash jump would fight it.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const onAnchorClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('a[href*="#"]');
      if (
        !el ||
        !lenis ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      )
        return;
      const href = el.getAttribute("href") ?? "";
      const hash = href.startsWith("#") ? href : href.match(/#[\w-]+$/)?.[0];
      if (!hash || hash === "#") return;
      // Only intercept same-page anchors.
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname)
        return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
      history.pushState(null, "", hash);
    };

    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return;
      lenis = new Lenis({
        duration: 0.85,
        smoothWheel: true,
        syncTouch: false,
        prevent: (node) => !!node.closest("textarea,[data-lenis-prevent]"),
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      document.addEventListener("click", onAnchorClick);
    })();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchorClick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
