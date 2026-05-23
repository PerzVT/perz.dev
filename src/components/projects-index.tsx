"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lightbox } from "@/components/lightbox";
import type { BentoProject } from "@/components/project-types";

/**
 * Jesse-Warren-style indexed project list. Left thumbnail, title +
 * tag line + description, year on the right. Hairline between rows.
 *
 * mediaOnly behavior: rows for mediaOnly projects open a lightbox
 * with the hero (or image) media instead of navigating. State lives
 * here so only one lightbox is open at a time across the list.
 */
export function ProjectsIndex({ projects }: { projects: BentoProject[] }) {
  const [lightbox, setLightbox] = useState<{
    src: string;
    type: "image" | "video";
    alt: string;
  } | null>(null);

  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">No projects yet.</p>;
  }

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
      <ul className="divide-y divide-border/60 border-y border-border/60">
        {projects.map((p) => (
          <li key={p.slug}>
            <ProjectRow project={p} onOpen={() => open(p)} />
          </li>
        ))}
      </ul>
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

function ProjectRow({
  project,
  onOpen,
}: {
  project: BentoProject;
  onOpen: () => void;
}) {
  const tagLine = project.tags.map((t) => t.replace(/-/g, " ")).join(" / ");

  // Same body for both link and button variants. Only the wrapping
  // element changes, so the row visually reads identical regardless
  // of click behavior.
  const inner = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-card">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {project.title.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="font-display text-xl text-foreground sm:text-2xl">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-[2px] transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            {project.title}
          </span>
        </div>
        {tagLine && (
          <div className="mt-1 text-[11px] lowercase tracking-[0.16em] text-muted-foreground/80">
            {tagLine}
          </div>
        )}
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </div>

      <div className="self-start pt-1 text-right">
        <span className="font-display text-sm tabular-nums text-muted-foreground/80">
          {project.year}
        </span>
      </div>
    </>
  );

  const rowClass =
    "group grid grid-cols-[96px_1fr_auto] items-center gap-x-5 py-5 text-left transition-colors hover:bg-foreground/[0.025] sm:grid-cols-[120px_1fr_auto] sm:gap-x-7 sm:py-6";

  if (project.mediaOnly) {
    return (
      <button
        type="button"
        onClick={onOpen}
        data-sfx="click"
        className={`${rowClass} w-full cursor-pointer`}
        aria-label={`view ${project.title}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-sfx="click"
      className={rowClass}
    >
      {inner}
    </Link>
  );
}
