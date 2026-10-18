import layouts from "../../content/portfolio/featured-layout.json";
import { featuredStudies, type CaseStudy, type Media } from "./portfolio";

export type FeaturedSlot = { src: string; position: string };
export type PlatformPill = { label: string; icon: string; href?: string };
export type FeaturedLayout = { main: FeaturedSlot; mainNarrow?: FeaturedSlot; thumbnails: FeaturedSlot[]; platforms: PlatformPill[] };

/** Indexing can miss, so callers have to handle it. */
export const featuredLayouts = layouts as Record<string, FeaturedLayout | undefined>;

export function projectImages(project: CaseStudy): Media[] {
  const seen = new Set<string>();
  return [...project.hero, ...project.gallery, ...project.sections.flatMap(section => section.type === "feature" ? section.media : [])]
    .filter(image => { if (seen.has(image.src)) return false; seen.add(image.src); return true; });
}

export function resolveFeaturedSlot(project: CaseStudy, slot: FeaturedSlot): Media {
  return projectImages(project).find(image => image.src === slot.src) || { src: slot.src, alt: project.title };
}

export type FeaturedSlotView = { media: Media; position: string };
export type FeaturedProject = {
  slug: string;
  title: string;
  main: FeaturedSlotView;
  mainNarrow: FeaturedSlotView;
  platforms: PlatformPill[];
};

function view(project: CaseStudy, slot: FeaturedSlot): FeaturedSlotView {
  const media = resolveFeaturedSlot(project, slot);
  return { media: { ...media, fit: "cover", crop: undefined }, position: slot.position };
}

/**
 * The carousel's slots resolved against the case studies here, so the browser
 * receives its image and title instead of the whole case study.
 */
export const featuredProjects: FeaturedProject[] = featuredStudies.map(project => {
  const layout = featuredLayouts[project.slug];
  if (!layout) {
    throw new Error(
      `No entry for "${project.slug}" in content/portfolio/featured-layout.json.`,
    );
  }
  return {
    slug: project.slug,
    title: project.title,
    main: view(project, layout.main),
    mainNarrow: view(project, layout.mainNarrow || layout.main),
    platforms: layout.platforms,
  };
});
