import type { ProjectTag } from "@/lib/config";

/**
 * Shared project shape consumed by the sidebar tree, the home grid, and
 * the project detail page. Kept in a types-only module so consumers don't
 * pull in component code they don't render.
 */
export interface BentoProject {
  slug: string;
  title: string;
  description: string;
  tags: ProjectTag[];
  year: number;
  image?: string;
  video?: string;
  /** High-res or motion piece shown in the lightbox for mediaOnly
   *  projects (and used as the OG image elsewhere). Falls back to
   *  `image` when not set. */
  hero?: string;
  /** True when there's no case study — card click opens a lightbox
   *  instead of navigating to /projects/[slug]. */
  mediaOnly?: boolean;
  /** Card render variant — "cover" (edge-to-edge image) or "frame"
   *  (diffused bg with inset image). Defaults to "cover" if absent. */
  cardStyle?: "cover" | "frame";
  span?: "1x1" | "2x1" | "1x2" | "2x2";
}
