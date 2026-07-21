# perz.dev — content index & checklist

The control doc for the content fill-out. Every text slot on the site, the image spec for each, the project roster (registered + new), and the order we work in. Tick boxes as we go.

**How we work:** owner gives facts, I draft the copy against `docs/voice.md`, owner reviews and supplies images. Nothing invented. No em dashes in site copy.

**Guiding goal:** show the design and the experiences created, gameplay and people having fun. Metrics are a bonus, never the lead.

**Status legend:** `[ ]` open · `[~]` drafted, needs owner review · `[x]` done & approved · `(owner)` waiting on owner facts/media.

---

## A. Image specs

Shapes pulled from the live components, so they're exact. Deliver PNG masters (or AVIF/WebP); I wire them into `public/projects/<slug>/`.

| Slot | Ratio | Make at | Notes |
|---|---|---|---|
| **Project cover (carousel + grid card)** | **2:3 portrait** | **1200×1800** | The one to make first. Steam-library-portrait shape. Author natively at 2:3 so nothing crops. Central 84% safe area; 10px rounded corners. `→ public/projects/<slug>/cover.png` |
| Case-study hero (trailer) | 16:9 video | 1920×1080 mp4 | Poster frame auto-pulled; no autoplay. `→ <slug>/trailer.mp4` |
| Media reel shots | 16:9 | 1600–1920 wide | Scroll-snap gallery at top of the case study. avif/png/mp4 mix. |
| Highlight gallery images | flexible, 2-col | 1600 wide | Sit inside a Highlight block beside its text. |
| About portrait | 4:5 portrait | 1080×1350 | `→ public/percy.jpg`. object-cover, so keep the face off the edges. |

---

## B. Project roster

### B1. Registered games (have `.mdx`)

| Project | Card | Case study | State |
|---|---|---|---|
| Highstreet: Calamity VR | `[~]` | `[~]` migrated to v2 | Copy drafted, needs review. The **template** for the rest. |
| Supercat | `[~]` | `[ ]` old vocab | Migrate to media-forward + word it. |
| Bubble Buddy | `[~]` | `[ ]` old vocab | " |
| Lurk | `[~]` | `[ ]` old vocab | " |
| Poly Punch VR | `[~]` | `[ ]` old vocab | " |
| Stick It | `[~]` | `[ ]` old vocab | " |
| BisectHosting (design) | `[~]` | `[ ]` old vocab | Product/brand foundation piece. |
| Calamity Matchmaking UI | `[ ]` | hidden (mediaOnly+draft) | Card-only, low priority. |
| Bero Character Design | `[ ]` | hidden (mediaOnly) | Card-only, low priority. |

### B2. New projects to register (owner-driven)

Modding counts as game dev. Kerberus Network dropped as its own page. Seven pages to register; each leads with experience + gameplay, metrics as accent.

All six scaffolded on `home-v2`: `.mdx` + frontmatter + card + page state live and building clean (verified on the dev server). `[~]` = drafted, awaiting owner review + media; each notes what it still needs.

- `[~]` **Highstreet: Echoes of Solera** — narrative choose-your-own-adventure. Ships as **coming-soon** (skeleton). Card = cover + hover clip. Needs: `cover.png` + `hover.mp4` in `public/projects/highstreet-echoes-of-solera/`; confirm the role credit (drafted "Narrative Design").
- `[~]` **Kerberus Modded Suite** — one page, five mods as Highlight sections. Greek theme anchored by Kerberus (Cerberus). Names locked; owner renames the real projects on release day:
  - **Atlas** — maps & claiming
  - **Orion** — ranks & permissions
  - **Argus** — watchdog / logging / moderation
  - **Hermes** — messaging / cross-server bridge
  - **Iris** — cross-server player sync (was "PlayerSync")
  - Needs: screens/clips per mod; confirm the loader (Forge / Fabric / Paper?).
- `[~]` **Kerberus Pack Manager** — tool / product-design case study, written from the private repo README + the owner's "describe the designed product" note. Needs: app screenshots.
- `[~]` **Dragoncraft** — modpack, play as dragons. Written from CurseForge. Needs: gameplay gallery; **confirm year (guessed 2024)**.
- `[~]` **Mythcraft** — modpack, play as demigods. Written from CurseForge. Needs: gameplay gallery; **confirm year (guessed 2025)** and whether the title is "Mythcraft" or "Mythcraft Unleashed".
- `[~]` **Slime Dragon** — mod (addon to the Dragon Survival community mod). Full ability write-up from CurseForge. Needs: ability shots/clips. Dragon Survival itself is not a portfolio project.

**Build mechanisms (done, verified):**
- `status: "coming-soon"` → case-study page renders a skeleton / coming-soon state. ✓
- `cardVideo` frontmatter → `hoverVideo` on the card; muted clip plays on hover. ✓
- CTA labels for CurseForge / Modrinth / GitHub. ✓

**Card order:** existing 1–7, new projects 8–13 (Dragoncraft, Mythcraft, Slime Dragon, Modded Suite, Pack Manager, Echoes). Reorder by changing `cardOrder` in `content/work-cards.json`.

### B3. Per-project checklist (repeat for each game)

- `[ ]` **Card** — `content/work-cards.json`: `slug`, `cardOrder`, `tagline` (the one line shown). Legacy `metaLabel`/`blurb`/`contributions` optional.
- `[ ]` **Cover art** 2:3 → `public/projects/<slug>/cover.png` `(owner)`
- `[ ]` **Frontmatter** — title, description (the hook), tags, year, roles[], engine, duration, platform, release, employment, contributions[] (numbered "at a glance"), skills[], image, hero, url, confidential?
- `[ ]` **MDX body** — `MediaReel` + one or more `Highlight` blocks (duplicate/drop per project) + `Outcome` with `OutcomePoint`s.
- `[ ]` **Media** — reel shots, gallery images, trailer video `(owner)`

---

## C. Home page copy

- **Hero** `→ config.positioning` — `[x]` owner-approved positioning line + buttons.
- **Selected work** — `[x]` heading + "All work" link. Cards come from §B.
- **About** `→ config.about` — `[~]` bio paragraph drafted; `[~]` philosophy paragraph drafted. Portrait 4:5 `(owner)`.
- **Experience** `→ content/work/*.json` — `[~]` 6 role lines. Wording pass; **drop the "Contract" tag** (owner note). Newest first.
- **Recommendations** `→ recommendations` — `[ ]` **pick up to 3** of the 8 real LinkedIn quotes and trim faithfully. Decision needed (§F).
- **Contact** — `[~]` heading "Let's talk.", intro, email note. Form labels are fine as-is.

## D. Résumé (`/resume`)

- `[ ]` Full name (owner supplies, or use "Percy A").
- `[x]` Role line, `[~]` summary (reuses About), `[~]` credibility line.
- `[ ]` **6 experience blurbs** — one line each, from work history.
- `[ ]` **Education** ×2 — `(owner)` supplies `date — degree · school`, or we omit the section.
- `[ ]` **Skill bars** ×5 — owner tunes the 0–100 numbers.
- `[x]` Secondary tools line.
- `[ ]` **PDF** `(owner)` supplies → I wire the Download button.

## E. Global / SEO

- `[x]` Meta title, `[x]` meta description (positioning line).
- `[ ]` **Nav role tag** — currently "Creative Designer"; positioning says "Game Designer". Confirm which shows (§F).
- `[x]` Footer lines, social labels.

---

## F. The flow (order of work)

1. `[x]` Lock the voice standard — `docs/voice.md`.
2. `[~]` Covers: 2:3, 1200×1800 — owner creating now.
3. `[ ]` **Confirm roster + order**, gather facts on the 5 new projects (§B2).
4. `[ ]` **Project by project, evidence-first.** Highstreet is the built template; do the strongest games next. Per project: card → frontmatter → MDX body → media spec.
5. `[ ]` Home connective copy: Experience wording, pick 3 recommendations, Contact. Mostly drafted, quick pass.
6. `[ ]` Résumé.
7. `[ ]` Global/SEO + meta polish.

## G. Decisions I need from you

1. **Recommendations — pick up to 3.** My recommendation for a hiring lead: **Matt Fleming** (managed you directly, systems + "creative and technical"), **Arron Ferguson** (UI/UX + proactive), and one of **Emma Gallaher** or **Guilherme Martins** (peer, "makes games feel good"). Your call.
2. **The 5 new projects** (§B2) — facts, and for each: full case study, card-only, or media-only? Plus where they sit in the order.
3. **Registered games** — which get full case studies vs stay card-only.
4. **Nav role tag** — "Creative Designer" or "Game Designer"?
