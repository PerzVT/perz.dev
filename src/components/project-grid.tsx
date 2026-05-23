"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lightbox } from "@/components/lightbox";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { BentoProject } from "@/components/project-types";

/**
 * Projects grid — 2 columns on tablet/desktop, 1 column on mobile.
 *
 * Single card style: BACKDROP. A diffused bg-card surface holds the
 * image inset with a small margin, image has rounded corners, year
 * sits in the bottom-right corner of the backdrop. Tag + title live
 * BELOW the backdrop as editorial caption.
 *
 * Same shape for game projects AND design projects so the grid reads
 * as one coherent set.
 *
 * Hover plays the project video (resolved from `video ?? hero` when
 * hero is mp4/webm/mov). When not hovered, the cover image is shown
 * — the video element is opacity-0 and paused so the static cover
 * is always the at-rest state.
 *
 * Click behavior:
 *  - Real projects → /projects/[slug] detail route
 *  - mediaOnly projects → open Lightbox showing hero (or image)
 *
 * Lightbox state lives at the grid level so only one preview is open
 * at a time across the whole grid (matches the projects-index pattern).
 */
export function ProjectGrid({ projects }: { projects: BentoProject[] }) {
  const [lightbox, setLightbox] = useState<{
    src: string;
    type: "image" | "video";
    alt: string;
  } | null>(null);

  if (projects.length === 0) return null;

  const open = (project: BentoProject) => {
    const src = project.hero ?? project.image;
    if (!src) return;
    const type: "image" | "video" = /\.(mp4|webm|mov)$/i.test(src)
      ? "video"
      : "image";
    setLightbox({ src, type, alt: project.title });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} onOpen={() => open(p)} />
        ))}
      </div>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          type={lightbox.type}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function resolveHoverVideo(project: BentoProject): string | undefined {
  if (project.video) return project.video;
  if (project.hero && /\.(mp4|webm|mov)$/i.test(project.hero)) {
    return project.hero;
  }
  return undefined;
}

function primaryTag(project: BentoProject): string | undefined {
  const t = project.tags[0];
  return t ? t.replace(/-/g, " ") : undefined;
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: BentoProject;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  // Sticky flag: once the user has hovered the card once, the video
  // src stays attached. We don't want to clear src on hover-out — that
  // makes every subsequent hover refetch the moov atom and stalls the
  // first play. preload="none" on the element still prevents the
  // below-the-fold load on initial paint; the first hover is the
  // trigger that materializes the resource, and it stays from there.
  const [primed, setPrimed] = useState(false);
  const hoverVideo = resolveHoverVideo(project);
  const tag = primaryTag(project);

  const onEnter = () => {
    setHovered(true);
    if (!primed) setPrimed(true);
  };
  const onLeave = () => {
    setHovered(false);
  };

  // Play/pause runs in an effect so the video element is guaranteed
  // to have its `src` attribute mounted before .play() is called.
  // Doing both in the onMouseEnter callback hit a race: setPrimed
  // schedules a re-render asynchronously, so the same-tick .play()
  // ran against a sourceless <video> and silently failed.
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

  // The backdrop + image stack, plus the caption below.
  // Hover gesture: the card surface tints up one step and the title
  // gets an underline sweep. No whole-card scale — that gesture reads
  // as SaaS-template "this is interactive" rather than a designed
  // affordance. The image stays still; the chrome around it moves.
  const inner = (
    <div>
      <div className="relative rounded-md bg-card p-4 transition-colors duration-300 group-hover:bg-card/80 sm:p-5">
        <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg">
          {project.image && (
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-contain"
            />
          )}
          {hoverVideo && (
            <video
              ref={videoRef}
              // src attaches on first hover and stays attached. preload
              // remains "none" so the browser doesn't fetch metadata on
              // initial paint of the grid — the only trigger that pulls
              // the resource is the user actually hovering the card.
              src={primed ? hoverVideo : undefined}
              poster={project.image}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 m-auto max-h-full max-w-full object-contain transition-opacity duration-200"
              style={{ opacity: hovered ? 1 : 0 }}
            />
          )}
          {!project.image && !hoverVideo && (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.22em] text-muted-foreground/60">
              {project.title}
            </div>
          )}
        </div>

        <span className="absolute bottom-2 right-3 font-mono text-[10px] tabular-nums text-muted-foreground/60 sm:bottom-2.5 sm:right-4">
          {project.year}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        {tag && (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
            {tag}
          </span>
        )}
        <h3 className="min-w-0 flex-1 font-display text-base leading-tight text-foreground sm:text-lg">
          {/* Inline underline-sweep on hover. Same pattern used in
              ProjectsIndex — keeps the gesture-vocabulary consistent
              across the grid and the dense index list. */}
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-[2px] transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            {project.title}
          </span>
        </h3>
      </div>
    </div>
  );

  // mediaOnly cards open a Lightbox on click. Replaces the previous
  // <div onMouseEnter> which was keyboard- and screen-reader-invisible
  // — the new <button> is reachable via Tab, activatable with
  // Space/Enter, and announces "view <title>" to assistive tech.
  if (project.mediaOnly) {
    return (
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        data-sfx="click"
        aria-label={`view ${project.title}`}
        className="group block cursor-pointer text-left"
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      data-sfx="click"
      className="group block"
    >
      {inner}
    </Link>
  );
}
