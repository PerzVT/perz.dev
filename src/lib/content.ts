import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import type { ProjectTag } from "@/lib/config";

const contentDir = path.join(process.cwd(), "content");

export interface ProjectFrontmatter {
  title: string;
  description: string;
  tags: ProjectTag[];
  year: number;
  image?: string;
  video?: string;
  url?: string;
  featured?: boolean;
  span?: "1x1" | "2x1" | "1x2" | "2x2";

  // Structured header strip — rendered as a metadata sidebar on the
  // detail page. All optional so "coming soon" stubs can omit them.
  roles?: string[];
  engine?: string;
  duration?: string;
  platform?: string;
  release?: string;
  employment?: string;
  hero?: string;
  confidential?: boolean;
  status?: "live" | "wip" | "coming-soon";
  /** When true, the project has no case study — clicking the card on
   *  the home grid opens a lightbox showing `hero` (or `image` if no
   *  `hero` is set) instead of navigating to a detail route. Useful
   *  for visual-only pieces where there's no narrative to write. */
  mediaOnly?: boolean;
  /** When true, the MDX body uses the structured <Context> / <Problem>
   *  / <Approach> / <Solution> / <Impact> components. Flips on the
   *  sticky TOC sidebar + the two-column flex layout. Pages without
   *  this flag use a centered single-column article without a TOC. */
  caseStudy?: boolean;
  /** Card render variant on the home grid + /projects index.
   *   - "cover" (default): edge-to-edge image fills the card. Best for
   *     game key art / illustrations that are meant to take a frame.
   *   - "frame":  diffused background, image inset with padding, title
   *     and year sit outside the image area. Best for UI screenshots,
   *     branding work, anything that reads as "considered design work
   *     presented in a frame." */
  cardStyle?: "cover" | "frame";
}

export interface ProjectEntry {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

// React.cache memoizes for the duration of a single server render.
// The home page calls getProjects() to drive both the grid and the
// terminal's slug list; generateStaticParams + every project route
// also reads it. Cache eliminates the duplicated fs scans within
// one request without pinning state across builds.
export const getProjects = cache((): ProjectEntry[] => {
  const projectsDir = path.join(contentDir, "projects");

  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));

  const entries = files.map((file) => {
    const raw = fs.readFileSync(path.join(projectsDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug: file.replace(/\.mdx$/, ""),
      frontmatter: data as ProjectFrontmatter,
      content,
    };
  });

  // Interleave games and media-only entries so the grid reads
  // game / art / game / art instead of clumping all games first.
  const games = entries
    .filter((e) => !e.frontmatter.mediaOnly)
    .sort((a, b) => b.frontmatter.year - a.frontmatter.year);
  const media = entries
    .filter((e) => e.frontmatter.mediaOnly)
    .sort((a, b) => b.frontmatter.year - a.frontmatter.year);

  const interleaved: ProjectEntry[] = [];
  const maxLen = Math.max(games.length, media.length);
  for (let i = 0; i < maxLen; i++) {
    if (games[i]) interleaved.push(games[i]);
    if (media[i]) interleaved.push(media[i]);
  }
  return interleaved;
});

export function getProject(slug: string): ProjectEntry | null {
  const filePath = path.join(contentDir, "projects", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as ProjectFrontmatter,
    content,
  };
}

// ---------------------------------------------------------------------
// Visual work
// ---------------------------------------------------------------------

export interface VisualPiece {
  title: string;
  /** Single year "2022" or span "2021–2022". */
  year: string;
  /** Path under /public, e.g. "/visual/knite-keyart.jpg". */
  media: string;
  type: "still" | "video";
  description?: string;
  /** Used only for sort. Strip before returning to consumers. */
  startDate?: string;
}

/**
 * Visual work exhibits from content/visual/*.json. One file per piece.
 * Sorted newest-first by `startDate` (or year if startDate omitted).
 * 3–5 pieces is the curated target — the section is a small gallery,
 * not a complete archive.
 */
export function getVisual(): VisualPiece[] {
  const dir = path.join(contentDir, "visual");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const entries = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    return JSON.parse(raw) as VisualPiece;
  });
  entries.sort((a, b) =>
    (b.startDate ?? b.year).localeCompare(a.startDate ?? a.year),
  );
  return entries.map((e) => {
    const copy = { ...e };
    delete copy.startDate;
    return copy;
  });
}
