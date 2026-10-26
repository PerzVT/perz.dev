import { getProjects } from "./content";
import { caseStudies } from "./portfolio";

/** Top-level pages, in nav order. */
export const topLevelRoutes = ["/", "/resume", "/contact"];

/** Every slug that renders a page at /projects/[slug]. Case studies come from
 *  pages.json, sidequests from the MDX files; getProjects() drops drafts. */
export function projectSlugs(): string[] {
  const pages = getProjects().filter((p) => !p.frontmatter.link);
  return [...new Set([...caseStudies.map((p) => p.slug), ...pages.map((p) => p.slug)])];
}

/**
 * Detail pages worth listing in the sitemap. Coming-soon pages render a
 * placeholder and already carry robots: noindex, so linking to them from the
 * sitemap would contradict the page itself.
 */
export function indexableProjectSlugs(): string[] {
  const comingSoon = new Set(
    getProjects()
      .filter((p) => p.frontmatter.status === "coming-soon")
      .map((p) => p.slug),
  );
  return projectSlugs().filter((slug) => !comingSoon.has(slug));
}
