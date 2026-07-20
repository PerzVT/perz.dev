"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Résumé skill bars — fill on scroll-into-view via IntersectionObserver.
 * A row reveals (0 → level%) when it enters the viewport; rows already on
 * screen reveal immediately. The global reduced-motion rule flattens the
 * width transition, so users who opted out get the final state with no
 * motion. Levels are illustrative — seeded from the comp; the owner tunes
 * them.
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
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
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
