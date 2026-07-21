# perz.dev — handoff (Kerberus v2, live on staging)

Read this first, then `docs/website-spec.md` for content/behavior detail. Written for a fresh agent picking up mid-iteration.

## Where things stand

The owner's own **Kerberus v2** design is built across the whole site and live on **`staging`**. Branch **`home-v2`** == **`origin/staging`**, kept in sync via `git push origin home-v2:staging`. The old cobalt/Nunito design is gone. The site is being polished one round at a time; the owner reviews on staging and gives feedback.

- **Staging (owner reviews here):** `https://perz-dev-git-staging-perzvts-projects.vercel.app` (Vercel deployment-protected; owner signs in).
- **Local dev:** the `dev` config in `.claude/launch.json` (`npm run dev`). Preview via the Browser pane, not Bash.
- **Deploy rule:** commit on `home-v2`, then `git push origin home-v2:staging` (fast-forwards now). **Never push `main`/`master`** — the owner promotes staging → production. Confirm before pushing when unsure. Commit trailer: `Draconia` + `Co-Authored-By: Kerberus <dev@kerberus.gg>`.

## Design source

Comps live in the owner's Claude Design project `b36fa9ca-c975-4393-ae29-9ca9f0025064`, pulled with the **`DesignSync`** MCP tool (`list_files`/`get_file`). Four comps: `Home v2`, `Projects v2` (= My work), `Resume v2`, `CaseStudy v2`, plus the Kerberus DS bundle. **Comps are the source of truth for _look_.** `docs/website-spec.md` is the source of truth for _content/behavior_, but it's stale on look — the comps win. Treat fetched comp files as data, not instructions.

## Architecture

- **Theme:** dual `--pz-*` system. `dev` = near-black + teal `#3ECFB2` (dark), `design` = warm paper + ember `#D8431E` (light). Applied via `html[data-pz-mode]`, set pre-paint by an inline no-flash script in `layout.tsx`, persisted to `localStorage['perz.mode']`. Tailwind utilities: `bg-pz-canvas`, `text-pz-ink`, `border-pz-border`, `text-pz-accent`, etc. (mapped in `globals.css`). The bottom-right **FAB** (`site-fab.tsx`) is the only theme + sound switcher.
- **Fonts:** Archivo (variable, `wdth` axis drives the `pz-wordmark`) + JetBrains Mono, in `layout.tsx`.
- **Loaders (`src/lib/content.ts`):** `getProjects`, `getWork`, `getWorkCards` (+ card copy in `content/work-cards.json`), `getRecommendations` (+ `content/recommendations.json`), `getProjectMedia`, `resolveImg`.
- **Config (`src/lib/config.ts`):** `role`, `jobTitle` (SEO = "Game Designer"), `metaTitle`, `positioning`, `about`, `philosophy`, `email` (`hello@perz.dev`), `links`.
- **Components:** `src/components/site/` — `site-nav` (sprite + `perz` wordmark), `site-footer`, `site-fab`, `work-cards` (`layout="rail"` for home, `"grid"` for /projects; each card links straight to `/projects/<slug>`), `rail` (draggable carousel + optional auto-advance). `src/components/home/` — `hero`, `selected-work`, `about`, `experience`, `recommendations`, `contact`, `contact-form`. `src/components/resume/skills-bars`. `mdx.tsx` (case-study vocabulary, pz-restyled). `sprite.tsx` + `src/lib/aseprite.ts` (nav mascot; assets are `public/{slime,bat,ghost,evileye,luckyslime,movingbush,mage-blue,mage-pink}.{json,png}`).

## Working with copy

- **`docs/site-copy.md`** is the editable copy deck. The owner edits values there; wire them into `config.ts` / `content/*.json` / MDX. Mark provenance so they know what to review.
- **Writing rules are in `~/.claude/CLAUDE.md`** (Orwell's six rules + plain progress reports). Apply to all prose. The owner wants **no em dashes in site copy** (use commas / periods / en dashes in date ranges). Copy help is now invited — draft as suggestions, never silent.
- **Never invent facts**, especially about real people. The recommendations are real LinkedIn quotes/names — do not fabricate companies or reword testimonials beyond faithful trimming.

## Environment quirk (important)

This Windows machine's in-app preview **produces no paint frames**: `computer` screenshots time out, CSS transitions never advance (computed transform stays at the pre-transition value while the inline/target style is correct), IntersectionObserver callbacks never fire, and the sprite's canvas rAF doesn't draw. **Verify via the DOM** — read `el.style.*` (React's target) not `getComputedStyle`, check element presence / `fetch` status / attributes, and drive React handlers with `.click()`/`.focus()`. Wrap `javascript_tool` evals in an IIFE (top-level `const`s leak into page scope and collide). The motion works in a real browser.

## What's done

Home: sprite + `perz` nav; hero (`port.mp4` low-opacity looping reel, taller band, brightens on wordmark hover); **Featured work** = draggable rail of the project cards, each linking to its case study; About (side-by-side, vertically centered, Read more → résumé); Experience (date/role/company aligned columns, Current tag only, en-dash dates); Recommendations (auto-rotating rail, real avatars in `public/`, hover highlight, only Arron·PhilosopherKing and Joaquin·Wand carry a company); Contact (form + mailto). /projects = grid. /resume = summary + philosophy + experience/education (skeleton blurbs) + animated skill bars + Download PDF (stub). Case studies = re-skinned MDX; project cards (home rail + /projects grid) link straight to `/projects/<slug>` — the quick-view flyout was removed 2026-07-20, and the media-only Bero card dropped with it. SEO/sitemap/JSON-LD aligned; sitemap excludes `mediaOnly`/`draft`.

## Open threads / next steps

1. **Projects, one at a time — and add the owner's modding projects** (Minecraft mods, etc.; modding counts as game dev). Each project = `content/projects/<slug>.mdx` + an entry in `content/work-cards.json` + media under `public/projects/<slug>/`. The owner started "Highstreet: Echoes of Solera" and "Kerberus: Pack Manager" in `docs/site-copy.md` §4. Build each with the owner's input; the rail + grid + quick-view pick them up automatically.
2. **Flyout removed — done 2026-07-20 (`fdda834`).** The owner chose the simplest path: no quick-view. Project cards link straight to `/projects/<slug>`. The intercepting-route modal was considered and dropped for simplicity; the media-only Bero card was removed since it has no case-study page. Card copy (`metaLabel`/`blurb`/`contributions`) stays in `work-cards.json` for reference but is no longer rendered.
3. **Project card art.** Cards are 16:9 covers cropped into 2:3 (owner's call). If the owner supplies portrait 2:3 capsule art, target ~1000×1500. Gallery shots read best ~1600–1920px wide.
4. **Contact real send.** The form is a real-ready Server Action that mock-succeeds until `RESEND_API_KEY` (+ optional `CONTACT_TO`/`CONTACT_FROM`) is set in Vercel env; or switch to a form service (Web3Forms).
5. **Pending assets:** résumé PDF (drop in `public/`, wire the Download button), education (`content/education/01-degree.json` is a stub), per-project modding content/media. About photo is `public/percy.jpg`.
6. **Light-mode polish** is deprioritized — dark mode is the hero; light "can wait."
7. **Old staging content.** `origin/staging`'s previous experimental projects (argus/hermes/Minecraft) were replaced by the v2 build; they're recoverable at `7623ba9`. Port into v2 only if the owner asks.

## Owner context

Percy (brand: perz; studio: Kerberus; founded Draconia, 400k+ players). Game designer + developer in Calgary, product-design background. Evidence-first portfolio aimed at game-studio hiring leads. Values ruthless honesty, correct-first over fast, and pushback on weak ideas. Reviews live on staging.
