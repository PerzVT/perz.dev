export const siteConfig = {
  name: "perz",
  fullName: "Percy A",
  title: "Developer / Designer · UX",
  description:
    "Developer and designer who specializes in user experience. Product design background, now building VR and PC games in Unity and C#. I design systems that feel obvious to use and rewarding to play.",
  /** Second paragraph in the hero. Kept separate from `description`
   *  so the hero can break it onto its own line. */
  descriptionExtra:
    "Five years shaping design across startups, game studios, GSPs, and game-adjacent services. I run my own studio (Kerberus) putting out jam games and small indie titles, and in 2020 I founded Draconia, a gaming service that's served 400,000+ players since.",
  url: "https://perz.dev",
  links: {
    github: "https://github.com/PerzVT",
    discord: "https://discord.gg/draconia",
    linkedin: "https://www.linkedin.com/in/perz/",
    itch: "https://notperz.itch.io/",
    curseforge: "https://www.curseforge.com/members/perzvt/projects",
    email: "mailto:perzeus.ttv@gmail.com",
  },
  // Raw address used by the copy-to-clipboard footer button. Kept
  // separate from `links.email` (which carries the `mailto:` prefix)
  // so each call site can pick the form it actually wants.
  email: "perzeus.ttv@gmail.com",
  handles: {
    github: "perzvt",
    discord: "@perz",
    itch: "notperz",
    curseforge: "PerzVT",
  },
} as const;

/**
 * Two top-level project buckets. game-dev covers shipped games and
 * jam entries; design covers everything else (branding, illustration,
 * UI, web, etc.). Granular categorization lived in the previous
 * enum but cluttered the card surfaces — recruiters skim, two
 * buckets read better than seven.
 */
export type ProjectTag = "game-dev" | "design";

export const allTags: { value: ProjectTag; label: string }[] = [
  { value: "game-dev", label: "Game Dev" },
  { value: "design", label: "Design" },
];
