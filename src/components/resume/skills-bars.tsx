"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Résumé skill bars — fill on scroll-into-view via IntersectionObserver.
 * Under reduced-motion (or without IO) they render full immediately, and
 * the global reduced-motion rule also flattens the width transition, so
 * there's no motion for users who opted out. Levels are illustrative —
 * seeded from the comp; the owner tunes them.
 */
const SKILLS = [
  { name: "Game design", level: 92 },
  { name: "Product design & UX", level: 86 },
  { name: "Unity + C#", level: 80 },
  { name: "Unreal Engine", level: 62 },
  { name: "Prototyping & playtesting", level: 88 },
];

export function SkillsBars() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-11"
    >
      {SKILLS.map((k, i) => (
        <div
          key={k.name}
          className="grid grid-cols-[minmax(130px,178px)_1fr] items-center gap-4 border-b border-pz-border py-3"
        >
          <span className="text-[13px] font-semibold text-pz-ink">{k.name}</span>
          <span className="block h-[3px] overflow-hidden rounded-[2px] bg-pz-surface">
            <span
              className="block h-full rounded-[2px] bg-pz-accent"
              style={{
                width: inView ? `${k.level}%` : "0%",
                transition: `width .9s var(--ease-out) ${(i * 0.09).toFixed(2)}s`,
              }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
