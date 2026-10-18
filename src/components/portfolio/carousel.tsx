"use client";
import { useLoopingCarousel } from "./use-looping-carousel";
import { RailNavigation } from "./rail-navigation";
import Link from "next/link";
import { useId, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { MediaImage } from "./media-image";
import type { Media } from "@/lib/portfolio";
import { AmbientVideo, SectionVideo, Icon } from "./controls";

const MediaViewer = dynamic(() => import("./media-viewer").then(module => module.MediaViewer));

export type Slide = Media & {
  title?: string; description?: string; href?: string;
  external?: string; externalLabel?: string;
};
export function Carousel({ items, label = "Gallery", initial = 0, compact = false }: {
  items: Slide[]; label?: string; initial?: number; compact?: boolean;
}) {
  const [viewer, setViewer] = useState(false);
  const { ref, viewportRef, index, running, previous, next, select } = useLoopingCarousel(items.length, initial);
  const id = useId();
  if (!items.length) return null;
  const current = items[index];
  const featured = !!current.title;
  const Video = featured ? AmbientVideo : SectionVideo;
  return <div ref={ref}
    className={`pf-carousel ${compact ? "pf-carousel-compact" : ""} ${featured ? "pf-carousel-featured" : ""}`}
    role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0}
    style={{ "--initial-slide": Math.max(0, Math.min(initial, items.length - 1)) } as CSSProperties}
    onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    }}>
    <div ref={viewportRef} className="pf-rail pf-track-viewport" id={id}>
      <div className="pf-stable-track">
        {items.map((item, itemIndex) => {
          const active = itemIndex === index;
          // Large presentation frames fill edge to edge. Compact technical
          // figures keep their authored framing; originals open on click.
          const media: Slide = compact ? item : { ...item, fit: "cover", crop: undefined };
          return <div key={`${item.src}-${itemIndex}`} className={`pf-slide pf-track-card ${active ? "pf-current" : ""}`}
            data-active={active} inert={!active} aria-hidden={!active}
            role="group" aria-roledescription="slide" aria-label={`${itemIndex + 1} of ${items.length}`}>
            <div className="pf-slide-art">
              {item.video && active ? <Video key={item.video} src={item.video} poster={item.src} alt={item.alt} fit={media.fit} background={item.background} /> :
                <button type="button" className="pf-full-art" aria-label={`View artwork: ${item.alt || item.title || label}`} onClick={() => setViewer(true)}>
                  <MediaImage media={media} alt={active ? item.alt : ""} />
                </button>}
            </div>
            {featured && <div className="pf-slide-caption">
              <div><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div>
              <div className="pf-actions">
                {item.external && <a className="pf-button" href={item.external}>{item.externalLabel || "View project"}</a>}
                {item.href && <Link className="pf-button" href={item.href} aria-label={`Read more about ${item.title}`}><Icon name="imgIconArrow" />Read more</Link>}
              </div>
            </div>}
          </div>;
        })}
      </div>
    </div>
    <RailNavigation count={items.length} index={index} label={label} controls={id} onPrevious={previous} onNext={next} onSelect={select} />
    {items.length > 1 && <span className="sr-only" aria-live={running ? "off" : "polite"}>{current.title || current.alt || label}, {index + 1} of {items.length}</span>}
    {viewer && <MediaViewer items={items} index={index} label={label} onSelect={select} onClose={() => setViewer(false)} />}
  </div>;
}
