"use client";
import { useAutoAdvance } from "./use-auto-advance";
import { RailNavigation } from "./rail-navigation";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { MediaImage } from "./media-image";
import type { Media } from "@/lib/portfolio";
import { AmbientVideo, Icon } from "./controls";

export type Slide = Media & {
  title?: string;
  description?: string;
  href?: string;
  external?: string;
  externalLabel?: string;
};
export function Carousel({
  items,
  label = "Gallery",
  initial = 0,
  compact = false,
}: {
  items: Slide[];
  label?: string;
  initial?: number;
  compact?: boolean;
}) {
  const [index, setIndex] = useState(Math.min(initial, items.length - 1));
  const rotation = useAutoAdvance(items.length, setIndex);
  const id = useId();
  const touch = useRef<number | null>(null);
  if (!items.length) return null;
  const current = items[index];
  const move = (delta: number) =>
    setIndex((i) => (i + delta + items.length) % items.length);
  const featured = !!current.title;
  function artwork(item: Slide, active: boolean) {
    return item.video && active ? (
      <AmbientVideo
        key={item.video}
        src={item.video}
        poster={item.src}
        alt={item.alt}
        fit={item.fit}
        background={item.background}
      />
    ) : (
      <MediaImage media={item} alt={active ? item.alt : ""} />
    );
  }
  return (
    <div
      ref={rotation.ref}
      className={`pf-carousel ${compact ? "pf-carousel-compact" : ""} ${featured ? "pf-carousel-featured" : ""}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          move(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          move(1);
        }
      }}
      tabIndex={0}
    >
      <div
        className="pf-rail"
        onTouchStart={(e) => {
          touch.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touch.current !== null) {
            const d = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(d) > 45) move(d < 0 ? 1 : -1);
            touch.current = null;
          }
        }}
      >
        {!compact && items.length > 1 && (
          <div
            className="pf-slide pf-neighbour pf-neighbour-left"
            aria-hidden="true"
          >
            <div className="pf-slide-art">
              {artwork(items[(index - 1 + items.length) % items.length], false)}
            </div>
          </div>
        )}
        <div
          className="pf-slide pf-current"
          id={id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${items.length}`}
        >
          <div className="pf-slide-art">{artwork(current, true)}</div>
          {featured && (
            <div className="pf-slide-caption">
              <div>
                <h3>{current.title}</h3>
                {current.description && <p>{current.description}</p>}
              </div>
              <div className="pf-actions">
                {current.external && (
                  <a className="pf-button" href={current.external}>
                    {current.externalLabel || "View project"}
                  </a>
                )}
                {current.href && (
                  <Link className="pf-button" href={current.href}>
                    <Icon name="imgIconArrow" />
                    Read More
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
        {!compact && items.length > 1 && (
          <div
            className="pf-slide pf-neighbour pf-neighbour-right"
            aria-hidden="true"
          >
            <div className="pf-slide-art">
              {artwork(items[(index + 1) % items.length], false)}
            </div>
          </div>
        )}
      </div>
      {items.length > 1 && (
        <>
          <RailNavigation
            count={items.length}
            index={index}
            label={label}
            controls={id}
            onSelect={setIndex}
          />
          <span
            className="sr-only"
            aria-live={rotation.running ? "off" : "polite"}
          >
            {current.title || `${label} item ${index + 1}`}
          </span>
        </>
      )}
    </div>
  );
}
