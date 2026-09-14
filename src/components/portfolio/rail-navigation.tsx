"use client";
import { useSyncExternalStore } from "react";
import { Icon } from "./controls";
const subscribeWidth = (notify: () => void) => { const q = matchMedia("(max-width: 800px)"); q.addEventListener("change", notify); return () => q.removeEventListener("change", notify); };
export function RailNavigation({
  count,
  index,
  label,
  controls,
  onSelect,
}: {
  count: number;
  index: number;
  label: string;
  controls?: string;
  onSelect: (index: number) => void;
}) {
  const mobile = useSyncExternalStore(subscribeWidth, () => matchMedia("(max-width: 800px)").matches, () => false);
  const limit = mobile ? 5 : 7;
  if (count < 2) return null;
  const start = count > limit ? Math.min(Math.max(index - Math.floor(limit / 2), 0), count - limit) : 0;
  const positions = Array.from(
    { length: Math.min(count, limit) },
    (_, i) => start + i,
  );
  return (
    <div className="pf-rail-navigation">
      <button
        className="pf-carousel-arrow pf-prev"
        aria-label={`Previous ${label.toLowerCase()} item`}
        aria-controls={controls}
        onClick={() => onSelect((index - 1 + count) % count)}
      >
        <Icon name="imgIconLeft" />
      </button>
      <div className="pf-dots">
        {positions.map((i) => (
          <button
            key={i}
            aria-label={`Show ${label.toLowerCase()} item ${i + 1} of ${count}`}
            aria-current={index === i ? "true" : undefined}
            aria-controls={controls}
            onClick={() => onSelect(i)}
          >
            <span className="pf-timer-track">
              <i className="pf-timer-fill" />
            </span>
          </button>
        ))}
      </div>
      <button
        className="pf-carousel-arrow pf-next"
        aria-label={`Next ${label.toLowerCase()} item`}
        aria-controls={controls}
        onClick={() => onSelect((index + 1) % count)}
      >
        <Icon name="imgIconRight" />
      </button>
    </div>
  );
}
