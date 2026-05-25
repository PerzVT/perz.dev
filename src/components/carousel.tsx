"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LazyVideo } from "@/components/lazy-video";
import { RotatedFrame } from "@/components/rotated-frame";

/**
 * Image / video carousel for project pages.
 *
 * Editorial layout — controls live below the frame, not floating on top
 * of it. Counter on the left, arrow pair on the right, both subtle.
 *
 * Each slide is rendered into an absolutely-positioned slot inside a
 * height-tracking container. On slide change, the container animates
 * its height to match the new slide's natural height, so mixed-aspect
 * content (a 5:4 schematic next to a 16:9 screenshot) doesn't leave
 * the carousel reserving the tallest slide's height across the whole
 * row.
 *
 * Two MDX-friendly props:
 *   srcs="..."   comma-separated paths. An entry like
 *                "/poster.png | /hover.mp4" becomes a poster image
 *                that plays the video on hover.
 *   items={...}  programmatic alternative for code-side consumers.
 *
 * `framed` wraps each slide in a RotatedFrame for mixed-aspect
 * scrapbook layouts (banner headers, etc).
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
  srcs?: string;
  framed?: boolean;
}) {
  const safeItems = useParsedItems(items, srcs);
  const [active, setActive] = useState(0);

  // Track height of each rendered slide so the container can animate
  // to the active slide's natural height. Slide indices map to pixel
  // heights; 0 until measured.
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [heights, setHeights] = useState<number[]>([]);

  // Measure on mount + on resize. ResizeObserver fires when any slide
  // changes intrinsic size (e.g. an image decoded, a font swapped in).
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const measure = () => {
      setHeights(
        slideRefs.current.map((el) =>
          el ? Math.round(el.getBoundingClientRect().height) : 0,
        ),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    slideRefs.current.forEach((el) => {
      if (el) ro.observe(el);
    });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [safeItems.length]);

  const activeHeight = heights[active] || 0;
  const single = safeItems.length === 1;

  const prev = useCallback(
    () => setActive((i) => Math.max(0, i - 1)),
    [],
  );
  const next = useCallback(
    () => setActive((i) => Math.min(safeItems.length - 1, i + 1)),
    [safeItems.length],
  );

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

  const pad = String(safeItems.length).length;
  const fmt = (n: number) => String(n).padStart(pad, "0");

  return (
    <figure
      className="my-8 outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      tabIndex={single ? -1 : 0}
      onKeyDown={onKeyDown}
      aria-roledescription={single ? undefined : "carousel"}
    >
      <div
        // The frame. overflow-hidden clips inactive slides. Height
        // animates between slides; 500ms is slow enough to read,
        // fast enough not to drag. Min-height stops a flash-of-zero
        // before measurement lands.
        className="relative overflow-hidden rounded-lg transition-[height] duration-500 ease-out"
        style={{
          height: activeHeight ? `${activeHeight}px` : undefined,
          minHeight: activeHeight ? undefined : "12rem",
        }}
      >
        {safeItems.map((item, i) => {
          const key = typeof item === "string" ? item : item.src;
          const isActive = i === active;
          return (
            <div
              key={key + i}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-slide
              aria-hidden={!isActive}
              // Inactive slides remain in the DOM so their height can
              // be measured at any time (lets us animate to them on
              // change without a flash of unmeasured content). They're
              // shifted off the active slot via translateX and have
              // pointer events off so they can't capture clicks.
              className={[
                "absolute inset-x-0 top-0 w-full transition-[opacity,transform] duration-500 ease-out",
                isActive
                  ? "pointer-events-auto translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-2 opacity-0",
              ].join(" ")}
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

      {!single && (
        <figcaption className="mt-3 flex items-center justify-between text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
          <span
            className="font-mono tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="text-foreground">{fmt(active + 1)}</span>{" "}
            <span className="text-muted-foreground/40">/</span>{" "}
            <span className="text-muted-foreground/60">
              {fmt(safeItems.length)}
            </span>
          </span>
          {/* Hairline progress bar. Shows position visually across
              the row, complements the tabular counter for readers
              who scan visually rather than reading numbers. */}
          <span
            aria-hidden
            className="mx-4 hidden h-px flex-1 bg-foreground/10 sm:block"
          >
            <span
              className="block h-full bg-foreground/60 transition-[width] duration-500 ease-out"
              style={{
                width: `${((active + 1) / safeItems.length) * 100}%`,
              }}
            />
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

/** Parse the comma-separated srcs string. Each entry can either be
 *  a plain path ("/foo.png") or a poster+hover-video pair joined with
 *  " | " — "/poster.png | /trailer.mp4". MDX's string-prop parser
 *  doesn't accept JS expressions, so all the carousel content lives
 *  inside one string. */
function useParsedItems(
  items?: CarouselItem[],
  srcs?: string,
): CarouselItem[] {
  if (items) return items;
  if (!srcs) return [];
  return srcs
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((part) => {
      if (part.includes("|")) {
        const [src, hoverVideo] = part.split("|").map((p) => p.trim());
        if (src && hoverVideo) return { src, hoverVideo };
      }
      return part;
    });
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
      className="group/nav inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground/60 transition-[color,background-color] hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:text-foreground/15"
    >
      <span className="transition-transform duration-200 ease-out group-hover/nav:scale-110">
        {children}
      </span>
    </button>
  );
}

function Media({ item }: { item: CarouselItem }) {
  if (typeof item !== "string") {
    return <HoverPosterVideo poster={item.src} video={item.hoverVideo} />;
  }
  const isVideo = /\.(mp4|webm|mov)$/i.test(item);
  if (isVideo) {
    return (
      <LazyVideo
        src={item}
        className="block w-full"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item}
      alt=""
      className="block w-full"
    />
  );
}

/**
 * Poster image at rest, video plays on hover. Used for slides where
 * the cover image is the at-rest deliverable and the trailer should
 * play only when the user actively engages.
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
      className="relative w-full"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="block w-full" />
      <video
        ref={videoRef}
        src={primed ? video : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </div>
  );
}
