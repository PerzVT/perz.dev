"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * IntersectionObserver-gated autoplay <video>. Avoids the worst-case
 * of mounting 4 below-the-fold videos that all start decoding on page
 * load — videos here only set their `src` and start `.play()` when
 * within the viewport (+ ~200px), and pause when scrolled out.
 *
 * Respects `prefers-reduced-motion`: under reduced motion, the video
 * does not autoplay; instead it renders with `controls` and remains
 * paused until the user explicitly plays it.
 *
 * Drop-in replacement for autoplay+loop+muted+playsInline `<video>`
 * elements that lived inline before.
 */

// useSyncExternalStore plumbing for prefers-reduced-motion. The
// MediaQueryList is the external store; subscribing wires its change
// event into React. Server snapshot returns false (no media query
// on the server), so SSR matches a "no reduced motion" first render.
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotionClient = () =>
  typeof window !== "undefined" &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionServer = () => false;

export function LazyVideo({
  src,
  poster,
  className,
  loop = true,
  muted = true,
  // Wider rootMargin than the previous 200px so the metadata fetch
  // kicks off before the viewport actually reaches the video — this
  // hides the buffer wait on scroll-into-view. 600px on either side
  // catches anything within ~one screen of the current scroll
  // position on a typical desktop.
  rootMargin = "600px",
}: {
  src: string;
  poster?: string;
  className?: string;
  loop?: boolean;
  muted?: boolean;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionClient,
    getReducedMotionServer,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) return; // no autoplay under reduced motion

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) {
          setActive(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion, rootMargin]);

  return (
    <video
      ref={ref}
      // src attaches once IntersectionObserver fires (or immediately
      // under reduced motion so the rendered controls have a target).
      // preload="metadata" fetches the moov atom + header (a few KB)
      // so .play() resolves immediately when the video enters view;
      // the alternative preload="none" forced a 1-3s buffer wait at
      // the moment the user actually saw the player. The rootMargin
      // gives this a head start so the wait is invisible in the
      // common case.
      src={active || reducedMotion ? src : undefined}
      poster={poster}
      loop={loop}
      muted={muted}
      playsInline
      controls={reducedMotion}
      autoPlay={false}
      preload={active || reducedMotion ? "metadata" : "none"}
      className={className}
    />
  );
}
