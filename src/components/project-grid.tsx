"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";
import { RotatedFrame } from "@/components/rotated-frame";
import type { BentoProject } from "@/components/project-types";

/**
 * Projects grid — 2 columns on tablet/desktop, 1 column on mobile.
 *
 * Card variants:
 *  - Real projects (case-study slug) → linked card, hover plays the
 *    trailer video, click navigates to /projects/[slug].
 *  - mediaOnly projects → inert visual tile. RotatedFrame wraps the
 *    image with a slight tilt so the card reads as a piece-of-work
 *    placed on the page rather than a clickable affordance. No
 *    lightbox, no navigation — the image IS the deliverable.
 *
 * Same backdrop + caption shape for both so the grid stays
 * visually unified.
 */
export function ProjectGrid({ projects }: { projects: BentoProject[] }) {
  if (projects.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={i} />
      ))}
    </div>
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
  index,
}: {
  project: BentoProject;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
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

  // The image/video stack rendered inside the card backdrop.
  // For mediaOnly cards the stack lives inside a RotatedFrame so the
  // card reads as a placed piece. Linked cards use the straight frame
  // because the rotation would compete with the hover affordance.
  const mediaStack = (
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
  );

  const inner = (
    <div>
      <div className="relative rounded-md bg-card p-4 transition-colors duration-300 group-hover:bg-card/80 sm:p-5">
        {project.mediaOnly ? (
          <RotatedFrame index={index} className="aspect-[16/10] rounded-lg">
            {/* mediaOnly image renders as a natural-sized child of
                the rotated frame so the contain + inset logic owned
                by RotatedFrame applies. next/image with fill needs
                a positioned ancestor with a known size; rather than
                fight that, just use a plain <img> + object-contain
                here. The trade-off (no next/image optimization on
                this one image) is fine because mediaOnly cards are
                already the lightest entries on the grid. */}
            {project.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            )}
          </RotatedFrame>
        ) : (
          mediaStack
        )}

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
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-[2px] transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            {project.title}
          </span>
        </h3>
      </div>
    </div>
  );

  // mediaOnly cards are inert visual tiles. Wrapping <div> is hidden
  // from assistive tech (aria-hidden) because there's no actionable
  // affordance and the title is decorative caption text on the page.
  if (project.mediaOnly) {
    return (
      <div className="group block" aria-hidden>
        {inner}
      </div>
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
