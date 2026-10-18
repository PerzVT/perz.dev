import { getProjects, resolveImg } from "./content";
import { caseStudies } from "./portfolio";

// These supplied files are plain color placeholders, not project artwork.
export const pendingArtwork = new Set(["kerberus-pack-manager", "slime-dragon"]);

/** MDX projects that are not case studies, in the order the content layer sorts them. */
export function sidequestProjects() {
  return getProjects().filter(p => !caseStudies.some(c => c.slug === p.slug));
}

export function sidequestImage(slug: string, image?: string): string | null {
  return pendingArtwork.has(slug) ? null : resolveImg(slug, image) ?? null;
}
