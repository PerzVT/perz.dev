"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BLUR_DATA_URL } from "@/lib/blur";

/**
 * The 2:3 cover frame for a project card. Renders the cover image and,
 * when a `hoverVideo` is set, a muted clip that fades in and plays while
 * the pointer is over the card (desktop nicety). The clip is only loaded
 * on first hover, and reduced-motion users never trigger it — they keep
 * the still cover. Covers are authored at 2:3; a `cardFocus` retargets
 * the crop when a source isn't natively 2:3.
 */
export function CardMedia({
  image,
  hoverVideo,
  alt,
  cardFocus,
  priority,
  sizes,
}: {
  image: string | null;
  hoverVideo: string | null;
  alt: string;
  cardFocus?: string;
  priority?: boolean;
  sizes: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const onEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    v.currentTime = 0;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  };
  const onLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  };

  return (
    <div
      className="relative aspect-[2/3] w-full overflow-hidden rounded-[var(--r-media)] bg-pz-raised shadow-[var(--pz-ring)]"
      onPointerEnter={hoverVideo ? onEnter : undefined}
      onPointerLeave={hoverVideo ? onLeave : undefined}
    >
      {image && (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
          style={{ objectPosition: cardFocus ?? "center" }}
        />
      )}
      {hoverVideo && (
        <video
          ref={videoRef}
          src={hoverVideo}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
