# perz.dev — Full Website Specification

> **Purpose.** A complete, build-ready spec of the site: every page, every section, all content/data, and all behavior. Hand this to a builder (human or Claude) who will apply **the owner's own design system** for the visuals.
>
> **How to read it.** This document is the source of truth for **structure, content, information architecture, and behavior**. It is deliberately **design-system-agnostic**: where it names fonts, colors, or reference sites, treat those as the *original design intent to adapt*, not fixed requirements — the owner's design system governs the actual look (type, color, spacing, components, motion styling).
>
> **Reference implementation.** A working build exists on branch `game-designer-rebuild` (Next.js 16 + Tailwind v4). It implements most of this spec with a placeholder design language. Consult it for concrete structure/behavior; restyle or rebuild with the owner's design system.

---

## 1. Who it's for & what it must do

- **Owner:** a **Game Designer specialized in user experience and player-focused systems.** Developer and product-design background exist but are **supporting**, never the headline.
- **Primary audience:** hiring leads at **game studios**. **Primary goal:** land an interview.
- **Governing principle — evidence first:** a hiring lead scans ~60–120s and must quickly answer *what role, what shipped, what did they personally own, where's the proof.* Prove game-design judgment before demonstrating website craft.
- **Voice:** professional, product-design-grade. **Show, don't tell.** No "gamer/swag" language.
- **Positioning line (owner's approved copy):** "I'm a Game Designer specialized in user experience, with professional experience building PC and VR games. With a strong foundation working in engines like Unity and Unreal, I love designing intuitive mechanics and engaging systems that create fun and memorable experiences."

---

## 2. Design intent (adapt to the owner's design system)

Concept: **a product-designer-grade surface carrying game content** (flashy key art), with a **subtle, tasteful tactile "game-feel" layer** — interaction polish, not decoration; never cringe.

Reference touchstones (for *intent*, restyle freely):
- **Anton Sten** — editorial restraint, whitespace, clear hierarchy.
- **Tailwind "Spotlight"** — hero: typographic intro above a tilted key-art card row.
- **Cuberto** — `/projects` staggered offset card grid.
- **Titus Lunter** — dense image gallery for "more work."
- **Simon Pan** — case-study spine (problem → decisions → measured outcome).
- **Rauno Freiberg / Josh Comeau** — tasteful microinteractions + opt-in UI sound.
- **Vaul** — mobile-first drawer for quick media peeks.
- **benji.org/family-values** — annotated-notes + GIF/clip presentation for showing interactions.

Single-accent discipline, one restrained accent color, one display face — but final tokens come from the owner's design system.

---

## 3. Tech stack & global constraints

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, MDX via `next-mdx-remote`. Content-driven from the `content/` directory. Single dark theme (optional light toggle — see §7.5).
- **Performance (non-negotiable):** `next/image` + blur placeholder everywhere (never raw `<img>`); **video with poster frames, never GIF**; lazy-load below the fold; **no autoplay**; only the first hero visual gets loading priority; reserve image dimensions (no CLS).
- **Accessibility (non-negotiable):** keyboard navigable; visible focus ring on every interactive element; alt text; semantic heading order; contrast ≥ 4.5:1 (body) / 3:1 (large); `prefers-reduced-motion` honored globally; captions/transcripts for media; interactive targets ≥ 44px where practical; no color-only meaning.
- **Platform fix:** **no `backdrop-blur` on fixed/overlay elements** — it stalls the Windows-Chromium compositor (fixed header goes unclickable until refresh). Use a solid background + hairline border.
- **SEO:** `<title>` + meta descriptions lead with the Game-Designer positioning; OpenGraph + Twitter cards; JSON-LD `Person` with `jobTitle: "Game Designer"`; `dynamicParams = false` on project routes; `mediaOnly`/`draft` projects excluded from the sitemap and static params.
- **Deploy rule:** **never push `main` or `master`.** Work on a feature branch; changes go to `staging` for the owner to review; the owner promotes to production.
- **Copy rule:** **the owner writes all copy.** Scaffold every copy-bearing slot with a clearly-marked placeholder; never invent final copy. (Placeholder/lorem for layout is fine and expected.)

---

## 4. Global layout elements

### 4.1 Top navigation (every page)
- **Left:** brand mark = the **pixel-art sprite mascot** (retained signature element; clicking it may cycle sprites — an intentional, low-key easter egg). Links home.
- **Right:** `Work` (scrolls to home #work / routes to `/#work`), `How I work` (#how-i-work), `Projects` (`/projects`), `Résumé` (`/resume`), `Contact` (mailto or `/contact`), and a **sound on/off toggle**.
- Fixed to top, solid background + hairline border (**no backdrop-blur**). Active in-page section highlighted. Must fit at 375px without horizontal overflow (collapse to a menu if the owner's design needs it).

### 4.2 Footer (every page)
- Contact (email), copyright, social icon row: GitHub, Discord (`.gg/draconia`), LinkedIn, itch.io, CurseForge. One accent flourish.

### 4.3 Tactile layer (global, subtle, opt-in)
- **UI sound:** short hover/click SFX with a **global mute toggle, default OFF**, persisted to `localStorage`, never auto-on under reduced-motion (WCAG 1.4.2-safe — the enabling click self-unlocks audio). Recommend `use-sound`.
- **Microinteractions:** press/hover **spring** feedback (scale ≈ 0.97–1.03, < 200ms, transform/opacity only), globally reduced-motion aware (e.g. Motion `MotionConfig reducedMotion="user"`).
- **Sprite mascot** in the nav = the one signature personality device.

---

## 5. Information architecture (routes)

| Route | Page | Notes |
|---|---|---|
| `/` | Home | §6.1 |
| `/projects` | Projects index | §6.2 — Cuberto staggered grid |
| `/projects/[slug]` | Case study | §6.3 — MDX, static-generated; excludes `mediaOnly`/`draft` |
| `/resume` | Résumé | §6.4 — HTML one-pager + PDF download |
| `/contact` | Contact | §6.5 — form (or a home section + mailto; owner's call) |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | Machine routes | positioning-aligned metadata |

---

## 6. Page specifications

### 6.1 Home (`/`)

Sections, in order:

**1. Hero.** Typographic intro (Spotlight pattern) → a **tilted key-art card row/carousel of games** directly below.
- Content: an amber-style eyebrow with the **Game-Designer positioning label** (copy); a large display **statement headline** (copy); the **bio paragraph** (owner's positioning line, §1); a social link row; then the card row.
- Card row: 5 tilted cards (~aspect 9:10, rounded, ±2°, object-cover) pulling **game** key art (filter out media-only/design pieces). First image eager/`priority`, rest lazy. `overflow-hidden` so it never causes horizontal page scroll. No autoplay.
- Owner uses their **full name** in the hero (no name-swap gimmick).

**2. Featured projects (evidence-first).** 3–5 flagship projects, **Highstreet: Calamity VR leads.**
- Each: large key art + **role · year · one concrete decision · one artifact · one measurable outcome** + link to the case study. Alternating/editorial layout.
- Pull real frontmatter (title, roles, description, year). The **decision/outcome** lines are copy slots.

**3. How I work.** A short three-beat POV band: **user experience · player-focused systems · shipping** — label + one line each (copy). Product-design background acknowledged here as *foundation*.

**4. Work gallery ("more work").** Dense image grid (Titus Lunter) of the remaining projects — **subordinate** to the featured evidence. Case-study tiles link to their page; media-only tiles open a quick-view (see §7.4) or are inert. Credit any art the owner didn't create.

**5. Experience timeline.** Compact, editorial list of the **6 real roles** (role · company · range), newest first, from `content/work/*.json`.

**6. Footer.**

### 6.2 Projects index (`/projects`)
- **Cuberto staggered offset grid:** two columns with the right column dropped ~half a card for a zigzag; single column on mobile.
- Each card: cover image (hover-scale) → title + year → tag → description. Case studies link to `/projects/[slug]`; media-only pieces are inert tiles (or quick-view).
- Header: eyebrow + `Projects` + entry count. Shows all non-`draft` projects.

### 6.3 Case study (`/projects/[slug]`)
- MDX-driven, statically generated (`generateStaticParams`, `dynamicParams=false`). Excludes `mediaOnly` and `draft`.
- **Spine (Simon-Pan):** sticky section TOC + sections **Context → Problem → Approach → Solution → Impact** (the existing MDX component vocabulary — keep it).
- **Metadata strip:** Roles · Engine · Duration · Platform · Release · Employment (from frontmatter).
- **Hero media** (image or captioned video/carousel; poster, no autoplay). **External CTA** when a store/itch URL exists (e.g. "View on Meta Quest").
- **Enhancement (from design intent):** present interaction proof as **annotated notes + short captioned clips** (family-values style) rather than raw trailers — owner supplies annotated media.
- Respect `confidential` frontmatter (some visuals have numbers hidden — keep a short note).

### 6.4 Résumé (`/resume`)
- Scannable one-page **HTML résumé** + a **"Download PDF"** button (owner supplies the PDF).
- Content: summary, experience (the 6 roles), skills, education, links. **Include Nightwalker (Unreal)** as a named experience credential — this substantiates the Unreal claim (the project itself is not showcased, by choice). Qualify Unreal experience precisely (owner's wording).
- Add `Résumé` to the nav.

### 6.5 Contact (`/contact` or home section)
- A **real contact form** (name, email, message; labels, inline validation, honeypot, success/error states, keyboard + focus, `aria-live` errors) **plus a visible `mailto:` fallback**.
- Send mechanism: a Server Action + email service (e.g. Resend) or a form service — owner's choice; keep secrets in env, never committed.

---

## 7. Behavior & interaction requirements

### 7.1 Responsive
- Mobile-first; verified at 375px (no horizontal overflow) through desktop. The hero card row clips gracefully; grids collapse to one column; nav fits or collapses.

### 7.2 Motion
- 150–300ms micro-interactions, transform/opacity only, ease-out enter; spring press feedback; staggered reveals optional (30–50ms). All disabled/reduced under `prefers-reduced-motion`.

### 7.3 Sound
- Per §4.3 — opt-in, default off, accessible mute, reduced-motion-aware.

### 7.4 Quick-view (optional enhancement)
- A **Vaul** drawer (mobile-first bottom sheet) for peeking project media from the grid/gallery without leaving the page; deep case studies remain full pages with stable URLs. Focus-trap, Esc, restore focus.

### 7.5 Theme toggle (optional, later)
- A tactile light/dark switch (`next-themes`, zero-flash SSR; optional View-Transitions reveal, feature-checked + reduced-motion fallback). Weigh the doubled visual-QA cost; ship the single dark theme first.

---

## 8. Content inventory (data that already exists in `content/`)

### 8.1 Projects — `content/projects/*.mdx` (frontmatter-driven)
Frontmatter schema: `title, description, tags[] ("game-dev"|"design"), year, image?, video?, url?, hero?, roles[]?, engine?, duration?, platform?, release?, employment?, confidential?, status?, mediaOnly?, caseStudy?, draft?, cardStyle?("cover"|"frame"), span?`.

| Slug | Title | Tags | Year | caseStudy | mediaOnly / draft | Notes |
|---|---|---|---|---|---|---|
| highstreet-calamity-vr | Highstreet: Calamity VR | game-dev | 2026 | yes | — | **Flagship.** Multiplayer roguelike VR (Unity 6·DOTS·VR, Meta Quest). Role: Game Designer (UX, Systems). `confidential`. |
| supercat | Supercat | game-dev | 2024 | yes | — | Action platformer (mecha cat). |
| bubble-buddy | Bubble Buddy | game-dev | 2025 | yes | — | GGJ jam; "you are the weapon" resource loop. |
| lurk | Lurk | game-dev | 2024 | yes | — | First-person horror. |
| poly-punch-vr | Poly Punch VR | game-dev | 2024 | yes | — | VR rhythm/gesture combat (hand-tracking). |
| stick-it | Stick It | game-dev | 2024 | yes | — | 2D stealth-action; PM + design + UI. |
| bisecthosting | BisectHosting | design | 2023 | yes | — | Product/brand case study — the product-design foundation. |
| calamity-matchmaking | Calamity Matchmaking UI | design | 2025 | — | **mediaOnly + draft (hidden)** | Party-picker UI artifact. |
| bero-character-design | Bero Character Design | design | 2023 | — | mediaOnly | Character illustration. |

### 8.2 Work history — `content/work/*.json` (6 roles)
Schema: `title, company, range, duration?, employment?, description?, location?, skills[]?, current?, logo?, startDate`.
- Highstreet — Game Designer — Dec 2023–Present (current)
- Smooth Brain Games — Game Designer — Oct 2023–Apr 2025 (contract)
- Knite Studios — Game Designer — Sep 2022–Sep 2023  *(logo `/work/knite.svg` is missing — fix or drop the logo field)*
- BisectHosting — Graphic Designer — Apr 2022–Dec 2023
- Sennovate — Graphic Designer — Jan–Mar 2022
- Whiteboard Studios — Senior Graphic Designer — Jan 2020–Jan 2021

### 8.3 Other content
- `content/skills.json` — headline (Game Design, Product Design, Unity + C#) + secondary tools (Photoshop, Illustrator, Blender, Godot, Notion, Miro, Jira, Python, TypeScript). *Dormant — surface on `/resume` or a skills block.*
- `content/education/01-degree.json` — **placeholder, unfilled.** Owner to supply or omit.
- `content/visual/` — currently empty (schema exists for a curated visual gallery).
- Credibility signals for the hero/résumé: **Draconia** (gaming service the owner founded, 400,000+ players) and **Kerberus** (the owner's studio).

### 8.4 Assets — `public/`
Per-project media in `public/projects/<slug>/` (covers `.png/.avif/.webp`, trailers `.mp4`). Top-level BisectHosting brand assets (`BH_*.png`, `MCEternal_FM.mp4`, logos). Sprite sheets (aseprite json+png pairs) for the mascot. Work logos in `public/work/`. Image paths in frontmatter may be a bare filename (resolve to `/projects/<slug>/<file>`) or an absolute `/path` — handle both.

---

## 9. Copy plan (owner writes all copy)

Copy slots to scaffold with placeholders, then request from the owner:
- Hero: Game-Designer eyebrow label; statement headline; (bio paragraph is provided, §1).
- Featured projects: per project — one decision line + one measurable outcome line.
- How I work: three one-line bodies (UX / player-focused systems / shipping).
- Case studies: MDX bodies (Context/Problem/Approach/Solution/Impact) — owner's; annotated-media captions.
- Résumé: summary, experience blurbs, skills, education, the precise Unreal/Nightwalker qualification.
- Meta: site title + search/social descriptions leading with Game Designer.
- Contact: intro line + form labels.
- Credibility framing: how "400k+ players" and Kerberus connect to game-design ability.

---

## 10. Non-goals / out of scope (this build)

- Staging-branch content experiments (extra Minecraft-modpack / "argus"/"hermes" projects, devlog-voice rewrites) — not included; base is production `main`.
- Education section unless the owner fills the placeholder.
- Over-built interaction: keep the tactile layer subtle and subordinate — never the featured attraction.

---

## 11. Open recommendations (owner's call)

- **Second deep case study** beyond Highstreet, so credibility isn't concentrated in one project.
- Curate the featured-home set to the 3–4 strongest games.
- Keep the résumé + a clear email path even if the contact form is deferred (lowest-effort hiring value).

---

*Reference implementation: branch `game-designer-rebuild`. Prior design spec + task plan: `docs/superpowers/specs/2026-07-18-portfolio-rebuild-design.md`, `docs/superpowers/plans/2026-07-18-portfolio-rebuild.md`. Self-run design review: `docs/reviews/2026-07-19-design-review.md`.*
