"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * IntersectionObserver-gated autoplay <video> with progressive
 * controls.
 *
 * Default state: autoplays muted when scrolled into view, no chrome.
 * Reads as motion-as-illustration alongside the case study.
 *
 * On hover / focus / first user interaction: native browser controls
 * fade in. Once the user has interacted, controls stay visible for
 * the rest of the session so they can scrub/replay without
 * re-hovering.
 *
 * Respects prefers-reduced-motion: under reduced motion the video
 * does not autoplay, controls render immediately, and the user
 * presses play themselves.
 */

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionClient,
    getReducedMotionServer,
  );

  // IntersectionObserver lives on the wrapper, not the video itself,
  // so the video can be repositioned (e.g. inside the carousel's
  // absolute slot) without breaking observation.
  useEffect(() => {
    const wrap = wrapRef.current;
    const el = ref.current;
    if (!wrap || !el) return;
    if (reducedMotion) return;

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
    io.observe(wrap);
    return () => io.disconnect();
  }, [reducedMotion, rootMargin]);

  // Listen for actual user interaction with the video element so
  // touched stays true once the user pressed play/pause/scrubbed.
  // After that controls remain visible even when hover ends.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onInteract = () => setTouched(true);
    el.addEventListener("play", onInteract);
    el.addEventListener("pause", onInteract);
    el.addEventListener("seeking", onInteract);
    el.addEventListener("volumechange", onInteract);
    return () => {
      el.removeEventListener("play", onInteract);
      el.removeEventListener("pause", onInteract);
      el.removeEventListener("seeking", onInteract);
      el.removeEventListener("volumechange", onInteract);
    };
  }, []);

  // Controls render any time: the user has actually interacted, the
  // user is currently hovering, or reduced-motion is in effect.
  const showControls = reducedMotion || hovered || touched;

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <video
        ref={ref}
        src={active || reducedMotion ? src : undefined}
        poster={poster}
        loop={loop}
        muted={muted}
        playsInline
        controls={showControls}
        autoPlay={false}
        preload={active || reducedMotion ? "metadata" : "none"}
        className={className}
      />
    </div>
  );
}
