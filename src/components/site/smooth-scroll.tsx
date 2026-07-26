"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling, mounted once in the root layout.
 *
 * Skipped entirely under prefers-reduced-motion — smoothed scrolling is
 * exactly the kind of motion that setting exists to turn off, and Lenis
 * would otherwise fight the global reduced-motion CSS. Loaded dynamically
 * so it never lands in the first-paint bundle.
 *
 * In-page anchors (#work, #contact) are handled explicitly: Lenis takes
 * over the scroll position, so a native hash jump would fight it.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const onAnchorClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('a[href*="#"]');
      if (!el || !lenis) return;
      const href = el.getAttribute("href") ?? "";
      const hash = href.startsWith("#") ? href : href.match(/#[\w-]+$/)?.[0];
      if (!hash || hash === "#") return;
      // Only intercept same-page anchors.
      if (!href.startsWith("#") && !href.startsWith(location.pathname)) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
      history.pushState(null, "", hash);
    };

    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
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
