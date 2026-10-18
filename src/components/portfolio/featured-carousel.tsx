"use client";
import Link from "next/link";
import { memo, useId, useState, type CSSProperties } from "react";
import type { FeaturedProject, FeaturedSlotView } from "@/lib/featured-layout";
import { MediaImage } from "./media-image";
import { Icon } from "./controls";
import { RailNavigation } from "./rail-navigation";
import { useLoopingCarousel } from "./use-looping-carousel";
import "./featured-carousel.css";

const ProjectPreview = memo(function ProjectPreview({ project }: { project: FeaturedProject }) {
  const [chosen, setChosen] = useState<FeaturedSlotView | null>(null);
  const [hovered, setHovered] = useState<FeaturedSlotView | null>(null);
  const slot = hovered || chosen || project.main;
  const narrow = hovered || chosen || project.mainNarrow;
  const previews = project.thumbnails;
  return <>
    <Link className="pf-featured-art" href={`/projects/${project.slug}`} draggable={false} style={{ "--featured-position": slot.position } as CSSProperties} aria-label={`Explore ${project.title}`}>
      <MediaImage media={slot.media} alt={slot.media.alt} narrowMedia={narrow.media} narrowPosition={narrow.position} narrowBreakpoint={1100} sizes="(max-width: 1100px) calc(100vw - 48px), 750px" />
    </Link>
    <div className="pf-featured-details" data-sparse={previews.length === 0}>
      <div><h3>{project.title}</h3>
        {project.platforms.length > 0 && <div className="pf-platforms">{project.platforms.map(platform => {
          const content = <><span className="pf-platform-icon" data-brand={platform.icon} aria-hidden="true" style={{ "--platform-icon": `url(/shared/platforms/${platform.icon}.svg)` } as CSSProperties} />{platform.label}</>;
          return platform.href ? <a key={platform.label} className="pf-platform-pill" href={platform.href}>{content}</a> : <span key={platform.label} className="pf-platform-pill">{content}</span>;
        })}</div>}
      </div>
      {previews.length > 0 && <div className="pf-featured-thumbnails" role="group" aria-label={`${project.title} artwork previews`}
        onPointerLeave={() => setHovered(null)}>
        {previews.map((item, previewIndex) => <button key={previewIndex} type="button" aria-label={`Preview ${item.media.alt || project.title}`}
          style={{ "--featured-position": item.position } as CSSProperties} aria-pressed={chosen === item} onClick={() => { setHovered(null); setChosen(chosen === item ? null : item); }}
          onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(item); }}
          onFocus={() => setHovered(item)} onBlur={() => setHovered(null)}>
          <MediaImage media={item.media} alt="" sizes="(max-width: 600px) 22vw, (max-width: 1100px) 22vw, 160px" />
        </button>)}
      </div>}
      <div className="pf-featured-bottom">
        <div className="pf-actions">
          <Link className="pf-button" href={`/projects/${project.slug}`} aria-label={`Read more about ${project.title}`}><Icon name="imgIconArrow" />Read more</Link>
        </div>
      </div>
    </div>
  </>;
});

export function FeaturedCarousel({ projects }: { projects: FeaturedProject[] }) {
  const { ref, viewportRef, index, running, previous, next } = useLoopingCarousel(projects.length);
  const id = useId();
  if (!projects.length) return null;
  return <div ref={ref} className="pf-carousel pf-featured-carousel" role="region" aria-roledescription="carousel" aria-label="Featured work" tabIndex={0}
    onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    }}>
    <div ref={viewportRef} className="pf-track-viewport" id={id}>
      <div className="pf-stable-track">
        {projects.map((project, item) => <article key={project.slug} className="pf-slide pf-track-card pf-featured-card"
          data-active={item === index} inert={item !== index} aria-hidden={item !== index}
          role="group" aria-roledescription="slide" aria-label={project.title}>
          <ProjectPreview project={project} />
        </article>)}
      </div>
    </div>
    <RailNavigation count={projects.length} label="Featured work" controls={id} onPrevious={previous} onNext={next} />
    <span className="sr-only" aria-live={running ? "off" : "polite"}>{projects[index].title}</span>
  </div>;
}
