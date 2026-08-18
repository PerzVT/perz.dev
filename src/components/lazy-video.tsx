"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Autoplays muted when scrolled into view (IntersectionObserver), with
 * no controls until hover/focus/first interaction, after which controls
 * stay visible for the session. Under prefers-reduced-motion, autoplay
 * is skipped and controls render immediately.
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

  // Observer targets the wrapper, not the video, so repositioning the
  // video (e.g. inside the carousel's absolute slot) doesn't break it.
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

  // Marks touched once the user actually interacts (play/pause/seek/
  // volume), so controls stay visible after hover ends.
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
