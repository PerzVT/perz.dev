import { featuredProjects } from "@/lib/featured-layout";
import { caseStudies } from "@/lib/portfolio";
import { SiteNavClient, type NavProject } from "./site-nav-client";

const navProjects: NavProject[] = featuredProjects.map(project => ({
  slug: project.slug,
  title: project.title,
  image: project.main.media.src,
  position: project.main.position,
  locked: caseStudies.find(study => study.slug === project.slug)?.status === "coming-soon",
}));

export function SiteNav({ section }: { section?: "sidequests" }) {
  return <SiteNavClient section={section} projects={navProjects} />;
}
