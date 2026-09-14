"use client";
import { Icon } from "./controls";
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
  if (count < 2) return null;
  const start = count > 7 ? Math.min(Math.max(index - 3, 0), count - 7) : 0;
  const positions = Array.from(
    { length: Math.min(count, 7) },
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
