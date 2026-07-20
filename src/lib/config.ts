export const siteConfig = {
  name: "perz",
  fullName: "Percy A",
  title: "Developer / Designer · UX",
  /** Visible role tag in the nav + JSON-LD jobTitle. */
  role: "Creative Designer",
  /** Home + default browser/SEO title. */
  metaTitle: "Perz · Building Fun Experiences",
  /** Owner-approved positioning line (verbatim from the v2 hero comp).
   *  Shared by the home hero and the page metadata. */
  positioning:
    "I'm a Game Designer specialized in user experience, with professional experience building PC and VR games. I love designing intuitive mechanics and engaging systems that create fun and memorable experiences.",
  /** "About me" paragraph — home About section + résumé summary. */
  about:
    "Hi, I'm Percy, a game designer and developer in Calgary. I've made games and gaming content since I was 15, starting with custom assets and mods for Roblox, Unturned, and Minecraft. I began in computer science, then earned a bachelor's in Media, Graphics and Animation, where I built my first game and trained as a product designer. I founded Draconia and Kerberus, gaming networks that have served over 400,000 players in the past five years. I created Mythcraft (play as demigods), Dragoncraft (play as dragons), and the Kerberus Network.",
  /** "My design philosophy" paragraph — home About section. */
  philosophy:
    "My background shapes how I design. Product design and UX training keeps me focused on the player's experience, and my technical side helps design and engineering teams work together. I lead the vision through design, sharpen communication, and find fun through simplicity. I keep designs clear and grounded in strong core systems and well-structured data, and I break complex ideas into clean, functional experiences, aiming for clarity in the gameplay and the process behind it.",
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
    email: "mailto:hello@perz.dev",
  },
  // Raw address (no mailto: prefix) shown in the footer, contact
  // section, and résumé, and used as the contact form's default
  // recipient. `links.email` carries the mailto: form.
  email: "hello@perz.dev",
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
