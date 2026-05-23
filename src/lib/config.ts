export const siteConfig = {
  name: "perz",
  fullName: "Percy A",
  title: "Designer / Game Designer",
  description:
    "Designer with a product background, now full-time on games. I build systems that feel obvious to use and surprising to play, same instinct that helped a few startups go from scrappy to shipping.",
  /** Second paragraph in the hero. Kept separate from `description`
   *  so the hero can break it onto its own line. */
  descriptionExtra:
    "Five years of it. Good at the people part, still learning the rest.",
  url: "https://perz.dev",
  links: {
    github: "https://github.com/PerzVT",
    discord: "https://discord.gg/draconia",
    linkedin: "https://www.linkedin.com/in/perz/",
    itch: "https://notperz.itch.io/",
    curseforge: "https://www.curseforge.com/members/perzvt/projects",
    email: "mailto:perzeus.ttv@gmail.com",
  },
  handles: {
    github: "perzvt",
    discord: "@perz",
    itch: "notperz",
    curseforge: "PerzVT",
  },
  stats: {
    discord: "12k+ members",
    curseforge: "350k+ downloads",
    github: "open source",
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
