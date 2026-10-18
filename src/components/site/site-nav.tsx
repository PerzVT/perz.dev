import { featuredProjects } from "@/lib/featured-layout";
import { sidequestImage, sidequestProjects } from "@/lib/sidequests";
import { SiteNavClient, type NavProject } from "./site-nav-client";

const navProjects: NavProject[] = featuredProjects.map(project => ({
  slug: project.slug,
  title: project.title,
  image: project.main.media.src,
  position: project.main.position,
}));

const navSidequests: NavProject[] = sidequestProjects().map(project => ({
  slug: project.slug,
  title: project.frontmatter.title,
  image: sidequestImage(project.slug, project.frontmatter.image) ?? undefined,
}));

export function SiteNav({ section }: { section?: "sidequests" }) {
  return <SiteNavClient section={section} projects={navProjects} sidequests={navSidequests} />;
}
