"use client";
import "./carousel-track.css";
import { useCarouselMotion } from "./use-carousel-motion";
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
  const { ref, running } = useAutoAdvance(items.length, setIndex, index);
  useCarouselMotion(ref, index, items.length);
  const id = useId();
  const touch = useRef<{ x: number; y: number } | null>(null);
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
      ref={ref}
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
      <div className="pf-rail pf-track-viewport" id={id}
        onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchCancel={() => { touch.current = null; }}
        onTouchEnd={(e) => {
          if (touch.current) {
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
          }
          touch.current = null;
        }}>
        <div className="pf-stable-track" data-motion-track data-center="true">
          {Array.from({ length: items.length * 3 }, (_, slot) => {
            const itemIndex = slot % items.length;
            const item = items[itemIndex];
            const active = slot === items.length + index;
            const sameImage = itemIndex === index;
            return <div key={slot} className={`pf-slide pf-track-card ${active ? "pf-current" : ""}`}
              data-active={sameImage} inert={!active} aria-hidden={!active}
              role="group" aria-roledescription="slide" aria-label={`${itemIndex + 1} of ${items.length}`}>
              <div className="pf-slide-art">{artwork(item, active)}</div>
              {featured && <div className="pf-slide-caption">
                <div><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div>
                <div className="pf-actions">
                  {item.external && <a className="pf-button" href={item.external}>{item.externalLabel || "View project"}</a>}
                  {item.href && <Link className="pf-button" href={item.href}><Icon name="imgIconArrow" />Read More</Link>}
                </div>
              </div>}
            </div>;
          })}
        </div>
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
            aria-live={running ? "off" : "polite"}
          >
            {current.title || `${label} item ${index + 1}`}
          </span>
        </>
      )}
    </div>
  );
}
