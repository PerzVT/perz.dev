export const siteConfig = {
  name: "perz",
  fullName: "Percy A",
  title: "Developer / Designer · UX",
  /** Public-facing role headline. Decoupled from `title` so the site's
   *  positioning (nav tag, JSON-LD jobTitle, metadata) leads with Game
   *  Designer while `title` stays available for other call sites. */
  role: "Game Designer",
  /** Owner-approved positioning line (verbatim from the v2 hero comp).
   *  Shared by the home hero and the page metadata. */
  positioning:
    "I'm a Game Designer specialized in user experience, with professional experience building PC and VR games. With a strong foundation in engines like Unity and Unreal, I love designing intuitive mechanics and engaging systems that create fun and memorable experiences.",
  /** Owner-approved "About me" paragraph (verbatim from the v2 comps).
   *  Shared by the home About section and the résumé summary. */
  about:
    "Hi, I'm Percy, a game designer and developer based out of Calgary who believes that simplicity is powerful. I focus on creating clear, straightforward designs that keep players engaged through strong core systems and well-structured data. I enjoy breaking down complex ideas into clean, functional experiences, always aiming for clarity in both the gameplay and the creative process. Outside of work, I'm passionate about games, soccer, my wife, and our dog, the things that keep life fun and grounded.",
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
