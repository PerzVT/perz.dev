export const siteConfig = {
  name: "perz",
  fullName: "Percy A",
  title: "Developer / Designer · UX",
  /** Visible role tag in the nav + JSON-LD jobTitle. */
  role: "Game Designer",
  /** Home + default browser/SEO title. */
  metaTitle: "Perz · Building Fun Experiences",
  /** JSON-LD / schema job title. Matches the visible nav tag. */
  jobTitle: "Game Designer",
  url: "https://perz.dev",
  links: {
    github: "https://github.com/PerzVT",
    discord: "https://discord.gg/draconia",
    linkedin: "https://www.linkedin.com/in/perz/",
    itch: "https://notperz.itch.io/",
    curseforge: "https://www.curseforge.com/members/perzvt/projects",
    email: "mailto:hello@perz.dev",
  },
  // Raw address (no mailto: prefix): shown in the footer, contact
  // section, and résumé; used as the contact form's default recipient.
  // `links.email` carries the mailto: form.
  email: "hello@perz.dev",
  handles: {
    github: "perzvt",
    discord: "@perz",
    itch: "notperz",
    curseforge: "PerzVT",
  },
} as const;

/**
 * Two top-level project buckets: game-dev (shipped games, jam entries)
 * and design (everything else: branding, illustration, UI, web, etc).
 */
export type ProjectTag = "game-dev" | "design";

export const allTags: { value: ProjectTag; label: string }[] = [
  { value: "game-dev", label: "Game Dev" },
  { value: "design", label: "Design" },
];
