"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LazyVideo } from "@/components/lazy-video";
import { RotatedFrame } from "@/components/rotated-frame";

/**
 * Image / video carousel for project pages.
 *
 * Editorial layout — controls live below the frame, not floating on top
 * of it. Earlier version pinned frosted-glass circle buttons over the
 * image (the iOS-template carousel) plus an expanding-pill dot
 * indicator (the Linear-clone "you're on slide 2" pattern). Both are
 * AI-generated marketing-site visuals; neither belongs on a write-up
 * page where the image is the content.
 *
 * What's here instead: tabular-numeral counter ("01 / 04"), two flat
 * arrow buttons, and arrow-key navigation when the carousel has focus.
 * Buttons stay visible even at the ends — they just go muted-disabled
 * — so the user can always see "I can move from here." The frame
 * itself is a borderless container so the photograph is the figure,
 * not a UI surface.
 *
 * Usage inside MDX:
 *   <Carousel items={[
 *     "/projects/slug/a.avif",
 *     "/projects/slug/b.mp4",
 *   ]} />
 */
export function Carousel({
  items,
  srcs,
  framed,
}: {
  items?: string[];
  // MDX-friendly alternative: comma-separated list of paths
  srcs?: string;
  /** When true, each slide renders through RotatedFrame — a fixed
   *  aspect frame that crops and slightly rotates the child. Use for
   *  mixed-aspect content (banner headers, scrapbook galleries) where
   *  letterbox bars would read worse than a deliberate tilt. */
  framed?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const safeItems: string[] =
    items ??
    (srcs
      ? srcs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []);

  // Track which slide is centered so the counter and prev/next stay in
  // sync as the user scrolls manually. One IntersectionObserver on the
  // slides, picking whichever has the highest visible ratio.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(
      track.querySelectorAll<HTMLElement>("[data-slide]"),
    );
    if (slides.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) {
          const idx = slides.indexOf(best.target as HTMLElement);
          if (idx !== -1) setActive(idx);
        }
      },
      { root: track, threshold: [0.5, 0.75, 1] },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [safeItems.length]);

  const scrollTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelectorAll<HTMLElement>("[data-slide]")[idx];
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const prev = () => scrollTo(Math.max(0, active - 1));
  const next = () => scrollTo(Math.min(safeItems.length - 1, active + 1));

  // Arrow-key navigation when the carousel container has focus. Scoped
  // to the outer wrapper via tabIndex so it doesn't hijack page-level
  // arrow scrolling unless the user has explicitly focused this widget.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  if (safeItems.length === 0) return null;

  const single = safeItems.length === 1;
  // tabular-nums + zero-pad so 1 / 8 doesn't shift width as the active
  // index changes from 9 to 10. The total digit count drives the pad.
  const pad = String(safeItems.length).length;
  const fmt = (n: number) => String(n).padStart(pad, "0");

  return (
    <figure
      className="my-8 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      tabIndex={single ? -1 : 0}
      onKeyDown={onKeyDown}
      aria-roledescription={single ? undefined : "carousel"}
    >
      <div className="overflow-hidden rounded-lg">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {safeItems.map((src, i) => (
            <div
              key={src + i}
              data-slide
              className="relative w-full shrink-0 snap-center"
            >
              {framed ? (
                <RotatedFrame index={i} className="aspect-video">
                  <Media src={src} cover />
                </RotatedFrame>
              ) : (
                <Media src={src} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Caption strip: counter on the left, arrows on the right.
          Sits underneath the frame as a hairline-separated meta row.
          Single-item carousels render no controls (no need). */}
      {!single && (
        <figcaption className="mt-3 flex items-center justify-between text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
          {/* aria-live=polite so screen-reader users hear the slide
              index change as they navigate. atomic so the full
              "01 / 04" string reads as one announcement, not three
              separate tokens. */}
          <span
            className="font-mono tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {fmt(active + 1)}{" "}
            <span className="text-muted-foreground/40">/</span>{" "}
            <span className="text-muted-foreground/60">
              {fmt(safeItems.length)}
            </span>
          </span>
          <div className="flex items-center gap-1">
            <NavButton
              onClick={prev}
              disabled={active === 0}
              label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4" />
            </NavButton>
            <NavButton
              onClick={next}
              disabled={active === safeItems.length - 1}
              label="Next slide"
            >
              <ArrowRight className="h-4 w-4" />
            </NavButton>
          </div>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Prev/next button. Pulled out so the two buttons can't drift apart
 * via copy-paste tweaking — they're visually identical except for the
 * icon and the disabled boundary.
 */
function NavButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      data-sfx="click"
      className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground/70 transition-[color,background-color] hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:text-foreground/20"
    >
      {children}
    </button>
  );
}

function Media({ src, cover }: { src: string; cover?: boolean }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  // In `cover` mode (used inside RotatedFrame) the media fills its
  // parent's bounds — the parent owns the aspect ratio, the media
  // just covers. In default mode the media imposes its own aspect-
  // video ratio on the slot.
  const className = cover
    ? "block h-full w-full object-cover"
    : "block aspect-video w-full object-cover";
  if (isVideo) {
    return <LazyVideo src={src} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} />
  );
}
