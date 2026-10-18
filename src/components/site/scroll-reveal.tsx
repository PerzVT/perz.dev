"use client";

import { useEffect, useRef } from "react";

/**
 * Fades and lifts children into place the first time they scroll into
 * view. The hidden start state is gated in CSS on
 * `html[data-pz-js]` + `prefers-reduced-motion: no-preference`, so
 * no-JS and reduced-motion users see the content with no motion applied.
 * Anything already in view on mount reveals at once, so the first
 * screen isn't blank while the observer spins up.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("pz-in");
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      el.classList.add("pz-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("pz-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`pz-reveal${className ? " " + className : ""}`}
    >
      {children}
    </div>
  );
}
