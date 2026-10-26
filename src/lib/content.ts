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
  /** factsBar: the facts run as one horizontal bar under the hero, for pages that are only media. */
  factsBar?: boolean;
  /** heroFit: "cover" stretches the hero art to fill its frame; the default "contain" letterboxes it. */
  heroFit?: "cover" | "contain";
  featured?: boolean;
  span?: "1x1" | "2x1" | "1x2" | "2x2";

  // Header-strip fields, shown in the detail page's metadata sidebar.
  // All optional so "coming soon" stubs can omit them.
  roles?: string[];
  engine?: string;
  duration?: string;
  platform?: string;
  release?: string;
  employment?: string;
  /** Scan-layer "Contributions at a glance"; the first word is emphasised. */
  contributions?: string[];
  /** Scan-layer skill/tool tags. */
  skills?: string[];
  hero?: string;
  /** Muted clip that plays on card hover (desktop only). Resolved like `image` (bare filename → project folder). */
  cardVideo?: string;
  /** coverWide: 16:9 art for the spotlight carousel. The 2:3 `image` crops badly in a landscape slot. */
  coverWide?: string;
  confidential?: boolean;
  status?: "live" | "wip" | "coming-soon";
  /** mediaOnly: no case study; the card opens a lightbox of `hero` (or `image`) instead of linking to a detail route. */
  mediaOnly?: boolean;
  /** caseStudy: MDX body uses the structured Context/Problem/Approach/Solution/Impact layout with a sticky TOC, instead of a plain single-column article. */
  caseStudy?: boolean;
  /** draft: hides the project everywhere (home grid, /projects index, terminal slugs, sitemap, detail route) without deleting the file. */
  draft?: boolean;
  /** cardStyle: "cover" (default) fills the card edge-to-edge; "frame" insets the image with padding and moves title/year outside it. Use frame for UI screenshots and branding work. */
  cardStyle?: "cover" | "frame";

  /** cardFocus: per-card object-position for the 2:3 grid crop (e.g. "center top"), for when the default center crop clips something. */
  cardFocus?: string;
}

export interface ProjectEntry {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

// Memoized per server render: the grid, the terminal's slug list,
// generateStaticParams, and every project route all call this.
export const getProjects = cache((): ProjectEntry[] => {
  const projectsDir = path.join(contentDir, "projects");

  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));

  const entries = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(projectsDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        frontmatter: data as ProjectFrontmatter,
        content,
      };
    })
    // Drafts are hidden from every list this feeds: grid, /projects
    // index, terminal slugs, sitemap, generateStaticParams.
    .filter((e) => !e.frontmatter.draft);

  // Interleaves games and media-only entries so the grid alternates
  // game / art / game / art instead of clumping games first.
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

// Memoized for the same reason as getProjects: generateMetadata and the page
// body each ask for the same slug, which otherwise parses the file twice.
export const getProject = cache((slug: string): ProjectEntry | null => {
  const filePath = path.join(contentDir, "projects", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as ProjectFrontmatter,
    content,
  };
});

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

/** Visual work exhibits from content/visual/*.json, one file per piece,
 *  sorted newest-first by `startDate` (or year). Curated to 3–5 pieces. */
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

// ---------------------------------------------------------------------
// Media path resolution
// ---------------------------------------------------------------------

/** Resolves a frontmatter image path: a bare filename scopes to the
 *  project's public folder (/projects/<slug>/foo.png); an absolute
 *  path passes through untouched. Falsy → null. */
export function resolveImg(slug: string, img?: string): string | null {
  if (!img) return null;
  return img.startsWith("/") ? img : `/projects/${slug}/${img}`;
}

// ---------------------------------------------------------------------
// Work history
// ---------------------------------------------------------------------

export interface WorkEntry {
  title: string;
  company: string;
  /** Display range, e.g. "Dec 2023 – Present". */
  range: string;
  duration?: string;
  employment?: string;
  description?: string;
  location?: string;
  skills?: string[];
  current?: boolean;
  logo?: string;
  /** Sort key only (ISO-ish), newest first. */
  startDate?: string;
}

/** Work history from content/work/*.json, one file per role, sorted
 *  newest-first by `startDate`. Feeds the home Experience list and the résumé. */
export function getWork(): WorkEntry[] {
  const dir = path.join(contentDir, "work");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const entries = files.map(
    (file) =>
      JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as WorkEntry,
  );
  entries.sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""));
  return entries;
}

// ---------------------------------------------------------------------
// Work cards (home "Featured work" rail + "My work" grid)
// ---------------------------------------------------------------------

/** One row of content/work-cards.json. Only `tagline` renders;
 *  `metaLabel`/`blurb`/`contributions` are unused but kept for reference. */
interface WorkCardSeed {
  slug: string;
  tagline: string;
  metaLabel: string;
  blurb: string;
  contributions: string[];
  cardOrder: number;
  /** Unused: cards always link to /projects/<slug> now. */
  caseStudyReady?: boolean;
}

export interface WorkCard {
  slug: string;
  title: string;
  /** One-line card description. */
  tagline: string;
  /** Resolved public image path, or null when no art exists. */
  image: string | null;
  /** Resolved hover-preview clip, or null. Plays muted on card hover. */
  hoverVideo: string | null;
  /** Per-card 2:3 crop focus, if the frontmatter sets one. */
  cardFocus?: string;
  /** Case-study route the card links to (/projects/<slug>). */
  caseHref: string;
  /** 16:9 spotlight art, or null to fall back to the 2:3 cover. */
  wideImage: string | null;
  /** Facts shown beside the cover in the spotlight carousel. */
  role?: string;
  engine?: string;
  /** Badge over the cover: "Shipped", "Coming soon", etc. */
  statusLabel?: string;
}

/** Curated project cards for the home rail + work grid. Copy comes from
 *  content/work-cards.json; title/image join in from each project's MDX
 *  frontmatter. Draft and media-only projects are dropped (no page to
 *  link to). Ordered by `cardOrder`. */
export const getWorkCards = cache((): WorkCard[] => {
  const file = path.join(contentDir, "work-cards.json");
  if (!fs.existsSync(file)) return [];
  const seeds = JSON.parse(fs.readFileSync(file, "utf-8")) as WorkCardSeed[];

  const bySlug = new Map(getProjects().map((p) => [p.slug, p]));

  return seeds
    .filter((s) => {
      const p = bySlug.get(s.slug);
      // Only card projects that have a case-study page (non-mediaOnly).
      return !!p && !p.frontmatter.mediaOnly;
    })
    .sort((a, b) => a.cardOrder - b.cardOrder)
    .map((s) => {
      const p = bySlug.get(s.slug)!;
      return {
        slug: s.slug,
        title: p.frontmatter.title,
        tagline: s.tagline,
        image: resolveImg(s.slug, p.frontmatter.image),
        hoverVideo: resolveImg(s.slug, p.frontmatter.cardVideo),
        wideImage: resolveImg(s.slug, p.frontmatter.coverWide),
        cardFocus: p.frontmatter.cardFocus,
        caseHref: `/projects/${s.slug}`,
        role: p.frontmatter.roles?.[0],
        engine: p.frontmatter.engine,
        statusLabel:
          p.frontmatter.status === "coming-soon"
            ? "Coming soon"
            : p.frontmatter.url
              ? "Shipped"
              : undefined,
      };
    });
});

// ---------------------------------------------------------------------
// Recommendations (LinkedIn testimonials)
// ---------------------------------------------------------------------

export interface Recommendation {
  name: string;
  title: string;
  /** Employer, shown after the title when present. */
  company?: string;
  quote: string;
  /** Public path to the recommender's photo; falls back to initials. */
  avatar?: string;
}

/** Recommendations from content/recommendations.json, in file order
 *  (featured first). Excerpts are trimmed from the full LinkedIn text. */
export function getRecommendations(): Recommendation[] {
  const file = path.join(contentDir, "recommendations.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8")) as Recommendation[];
}
