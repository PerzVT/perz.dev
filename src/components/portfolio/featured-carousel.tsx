"use client";
import Link from "next/link";
import { useId, type CSSProperties } from "react";
import type { FeaturedProject } from "@/lib/featured-layout";
import { MediaImage } from "./media-image";
import { Icon } from "./controls";
import { RailNavigation } from "./rail-navigation";
import { useLoopingCarousel } from "./use-looping-carousel";
import "./featured-carousel.css";

function ProjectSlide({ project }: { project: FeaturedProject }) {
  const { main, mainNarrow: narrow } = project;
  return <>
    <Link className="pf-featured-art" href={`/projects/${project.slug}`} draggable={false} style={{ "--featured-position": main.position } as CSSProperties} aria-label={`Explore ${project.title}`}>
      <MediaImage media={main.media} alt={main.media.alt} narrowMedia={narrow.media} narrowPosition={narrow.position} narrowBreakpoint={1100} sizes="(max-width: 800px) 88vw, 1096px" />
      {project.logo && <img className="pf-featured-logo" src={project.logo} alt="" draggable={false} />}
    </Link>
    <div className="pf-featured-caption">
      <div>
        <h3>{project.title}</h3>
        {project.platforms.length > 0 && <div className="pf-platforms">{project.platforms.map(platform => {
          const content = <><span className="pf-platform-icon" data-brand={platform.icon} aria-hidden="true" style={{ "--platform-icon": `url(/shared/platforms/${platform.icon}.svg)` } as CSSProperties} />{platform.label}</>;
          return platform.href ? <a key={platform.label} className="pf-platform-pill" href={platform.href}>{content}</a> : <span key={platform.label} className="pf-platform-pill">{content}</span>;
        })}</div>}
      </div>
      <Link className="pf-button" href={`/projects/${project.slug}`} aria-label={`Read more about ${project.title}`}><Icon name="imgIconArrow" />Read more</Link>
    </div>
  </>;
}

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
          <ProjectSlide project={project} />
        </article>)}
      </div>
    </div>
    <RailNavigation count={projects.length} label="Featured work" controls={id} onPrevious={previous} onNext={next} />
    <span className="sr-only" aria-live={running ? "off" : "polite"}>{projects[index].title}</span>
  </div>;
}
