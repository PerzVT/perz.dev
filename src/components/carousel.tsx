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
 *     { src: '/poster.png', hoverVideo: '/trailer.mp4' },
 *   ]} />
 */

/** A carousel slide can be a plain string path, or an object that
 *  pairs a poster image with a hover-play video. */
export type CarouselItem = string | { src: string; hoverVideo: string };

export function Carousel({
  items,
  srcs,
  framed,
}: {
  items?: CarouselItem[];
  // MDX-friendly alternative: comma-separated list of paths
  srcs?: string;
  /** When true, each slide renders through RotatedFrame — content is
   *  contained at ~70% of the frame, hover tilts the slot slightly.
   *  Use for mixed-aspect content (banner headers, scrapbook
   *  galleries) where letterbox bars would read worse than a
   *  deliberate inset + tilt. */
  framed?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const safeItems: CarouselItem[] =
    items ??
    (srcs
      ? srcs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []);

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
          {safeItems.map((item, i) => {
            const key = typeof item === "string" ? item : item.src;
            return (
              <div
                key={key + i}
                data-slide
                className="relative w-full shrink-0 snap-center"
              >
                {framed ? (
                  <RotatedFrame index={i} className="aspect-video">
                    <Media item={item} />
                  </RotatedFrame>
                ) : (
                  <Media item={item} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!single && (
        <figcaption className="mt-3 flex items-center justify-between text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
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

function Media({ item }: { item: CarouselItem }) {
  // Object form: poster image + hover-video. Used for projects where
  // the cover image is the at-rest "this is the deliverable" and the
  // trailer should only play when the user actively engages.
  if (typeof item !== "string") {
    return <HoverPosterVideo poster={item.src} video={item.hoverVideo} />;
  }
  const isVideo = /\.(mp4|webm|mov)$/i.test(item);
  if (isVideo) {
    return (
      <LazyVideo
        src={item}
        className="block max-h-full max-w-full object-contain"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item}
      alt=""
      className="block max-h-full max-w-full object-contain"
    />
  );
}

/**
 * Poster image at rest, video plays on hover. Same pattern the home-
 * grid project cards use. Source is attached on first hover (primed
 * flag) so below-the-fold slides don't fetch the video on initial
 * paint of the page.
 */
function HoverPosterVideo({
  poster,
  video,
}: {
  poster: string;
  video: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [primed, setPrimed] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered && primed) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hovered, primed]);

  const onEnter = () => {
    setHovered(true);
    if (!primed) setPrimed(true);
  };
  const onLeave = () => setHovered(false);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="block max-h-full max-w-full object-contain"
      />
      <video
        ref={videoRef}
        src={primed ? video : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 m-auto max-h-full max-w-full object-contain transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </div>
  );
}
