"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal — fades and lifts its children into place the first time they
 * scroll into view. The hidden start state lives in CSS gated on
 * `html[data-pz-js]` + `prefers-reduced-motion: no-preference`, so
 * no-JS and reduced-motion users always see the content with no motion.
 * Anything already in view on mount (above the fold) reveals at once, so
 * the first screen never sits blank waiting on the observer.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
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
      className={`pz-reveal${shown ? " pz-in" : ""}${className ? " " + className : ""}`}
    >
      {children}
    </div>
  );
}
