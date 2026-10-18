import { featuredProjects } from "@/lib/featured-layout";
import { SiteNavClient, type NavProject } from "./site-nav-client";

const navProjects: NavProject[] = featuredProjects.map(project => ({
  slug: project.slug,
  title: project.title,
  image: project.main.media.src,
  position: project.main.position,
}));

export function SiteNav({ section }: { section?: "sidequests" }) {
  return <SiteNavClient section={section} projects={navProjects} />;
}
