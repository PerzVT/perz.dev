# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild perz.dev as a Game-Designer portfolio (UX + player-focused systems) on live `main`, with a product-design surface, evidence-first home, and a subordinate tactile layer.

**Architecture:** Next.js App Router, content-driven from `content/*` via `src/lib/content.ts`. A design-token layer (Bricolage + amber) drives an Anton-Sten-restraint surface; a Spotlight-style carousel-led hero sits above evidence-rich featured projects; case studies are full MDX pages; a calibrated tactile layer (sprite, opt-in SFX, Motion springs) wraps but never leads.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, next-mdx-remote, next/font, `use-sound`, `motion`, `vaul`, `next-themes` (later phase), `vitest` (logic tests only).

## Global Constraints

*(Every task implicitly includes these. Values copied from the spec.)*

- **Base branch:** `game-designer-rebuild` (off `main`). **Never push `main`/`master`.** Changes go to `staging` for review; owner promotes to live. Confirm before any push.
- **Copy is the owner's.** Never write or reword portfolio copy. Scaffold every copy-bearing slot with a clearly-marked placeholder (`{/* COPY: … */}`) and request the real text per section during build.
- **Positioning:** lead with "Game Designer — user experience + player-focused systems." Developer/product-design are supporting only; never in hero label, nav, or `<title>`.
- **Evidence-first principle:** key art is the invitation, not the proof. Every featured project pairs an image with role · one decision · one artifact · one outcome. Personality (sprite/SFX/springs) stays subordinate.
- **Perf/a11y (non-negotiable):** `next/image` + blur everywhere, never raw `<img>`; video-with-poster, never GIF; lazy-load below fold; no autoplay; only the first hero visual gets priority. No `backdrop-blur` on fixed/overlay elements. Reduced-motion honored globally. Keyboard nav, visible focus, captions/transcripts, semantic headings, sufficient contrast. `mediaOnly` excluded from sitemap; `dynamicParams = false`. Dev-only `'unsafe-eval'` CSP. Pin font weights.
- **Salvage source:** `git checkout wip-redesign-backup -- <path>` to pull specific files (Bricolage+amber tokens, BisectHosting case study + assets, `blur.ts`, `mdx-image.tsx`).
- **Verification:** logic → `vitest`; visual → browser preview (`preview_start` name `dev`, then `read_page` / `read_console_messages` / `preview_logs`; raster screenshots are broken on this machine). Every task also passes `npm run build` and `npm run lint`.
- **Commits:** frequent, one per task minimum, on the branch. Do not push.

---

## File Structure

**Design system / config**
- `src/app/globals.css` — tokens (Bricolage+amber), type scale; remove shadcn import, `.pixel-border`, fade keyframes.
- `src/app/layout.tsx` — fonts (Nunito→Bricolage), providers (SFX, Motion config), metadata/positioning.
- `src/lib/config.ts` — siteConfig positioning, links, résumé.

**Content / data**
- `src/lib/content.ts` — projects/visual loaders + new work-history loader; games-lead interleave.
- `src/lib/blur.ts`, `src/components/mdx-image.tsx` — salvaged perf image layer.
- `src/lib/__tests__/content.test.ts` — loader logic tests.

**Tactile layer**
- `src/components/sfx/sound-provider.tsx`, `src/lib/sfx.ts` — opt-in SFX + mute (refined).
- `src/components/motion/press.tsx` — Motion press/hover primitives + MotionConfig.
- `src/components/sprite.tsx`, `src/lib/aseprite.ts` — retained mascot + cache fix.

**Home**
- `src/app/page.tsx` — home composition.
- `src/components/hero.tsx` — Spotlight-style hero + key-art carousel.
- `src/components/featured-projects.tsx` — evidence cards.
- `src/components/work-gallery.tsx` — subordinate Titus-style dense grid.
- `src/components/how-i-work.tsx`, `src/components/work-timeline.tsx`.

**Projects / case studies**
- `src/app/projects/page.tsx` — Cuberto staggered grid.
- `src/app/projects/[slug]/page.tsx` + `src/components/mdx.tsx` — case-study template + MDX vocabulary.
- `src/components/quick-view.tsx` — Vaul media-peek drawer.

**Résumé / contact**
- `src/app/resume/page.tsx`, `public/resume.pdf`.
- `src/app/contact/…` + `src/app/api|action` — form.

**Later**
- `src/components/theme/theme-toggle.tsx` — deferred.

---

## Phase 0 — Foundation & cleanup

### Task 1: Design tokens + type system
**Files:** Modify `src/app/globals.css`; Modify `src/app/layout.tsx` (font loaders); Modify `src/lib/config.ts` (accent note).
**Produces:** Tailwind `hl` = amber `#ffb454`; `.font-display` = Bricolage 800; tokens unchanged otherwise (dark neutral base).

- [ ] **Step 1:** Salvage the token reference: `git show wip-redesign-backup:src/app/globals.css > /tmp/ref-globals.css` and read it for the Bricolage+amber block (adapt, don't blind-copy).
- [ ] **Step 2:** In `layout.tsx`, replace the `Nunito` loader with `Bricolage_Grotesque` (`weight: ["800"]`, `variable: "--font-display"`). Keep Inter + JetBrains Mono.
- [ ] **Step 3:** In `globals.css`, set `--hl-accent: #ffb454`; ensure `.font-display` uses Bricolage; **remove** `@import "shadcn/tailwind.css"`, `.pixel-border`, and the `fade-in`/`fade-in-up` keyframes + classes.
- [ ] **Step 4:** Verify visual: `preview_start` (dev) → `read_page` home; confirm headings render in Bricolage, no console errors; `npm run build`.
- [ ] **Step 5:** Commit `chore: rebrand tokens to Bricolage + amber, drop shadcn/pixel-border`.

### Task 2: Strip cutting-mat + terminal (keep SFX for refinement)
**Files:** Modify `src/app/page.tsx`, `src/app/layout.tsx`; consider deleting `src/components/cutting-mat-bg.tsx`, `src/components/terminal.tsx`.
**Note:** SFX is **kept** (refined in Task 6) — do NOT remove `SfxProvider` here.

- [ ] **Step 1:** Remove `<CuttingMatBg />` and `<Terminal />` from `page.tsx`/`layout.tsx`; delete the two component files if no other referrers (`grep -r CuttingMatBg src`, `grep -r Terminal src`).
- [ ] **Step 2:** Verify: preview home renders flat dark, nav still works, no console errors, no dead imports; `npm run lint`.
- [ ] **Step 3:** Commit `refactor: remove cutting-mat background and command terminal`.

### Task 3: Positioning in metadata + config (copy slots)
**Files:** Modify `src/app/layout.tsx` (SITE_TITLE/descriptions), `src/lib/config.ts`, `src/components/json-ld.tsx` (jobTitle).
**Copy:** request the owner's Game-Designer title + descriptions before finalizing; scaffold with placeholders.

- [ ] **Step 1:** Replace `SITE_TITLE`/`SEARCH_DESC`/`SOCIAL_DESC` with placeholders that lead on Game Designer (mark `COPY:`); set JSON-LD `jobTitle: "Game Designer"`.
- [ ] **Step 2:** Verify: `read_page` head via preview; `npm run build`.
- [ ] **Step 3:** Commit `chore: reframe metadata + structured data to Game Designer positioning`.

---

## Phase 1 — Content & data layer

### Task 4: Reinstate work-history loader + games-lead interleave (TDD)
**Files:** Modify `src/lib/content.ts`; Create `src/lib/__tests__/content.test.ts`; add `vitest` + config.
**Interfaces — Produces:** `getWork(): WorkEntry[]` sorted newest-first by `startDate`; `getProjects()` interleave adjusted so all game-dev entries precede supporting design entries.

- [ ] **Step 1:** Add dev deps `vitest` + minimal `vitest.config.ts`; add `"test": "vitest run"` to package.json.
- [ ] **Step 2 (failing test):** In `content.test.ts`, write `test("getWork sorts newest first")` and `test("getProjects lists all game-dev before design")` against fixture files. Run `npm test` → FAIL.
- [ ] **Step 3:** Implement `getWork()` (read `content/work/*.json`, parse, sort desc by `startDate`) and adjust the interleave in `getProjects()` to games-first. Add `WorkEntry` type.
- [ ] **Step 4:** Run `npm test` → PASS.
- [ ] **Step 5:** Fix the broken `content/work/knite.json → /work/knite.svg` reference (add asset or drop the logo field).
- [ ] **Step 6:** Commit `feat: reinstate work-history loader, games-first project order`.

### Task 5: Salvage next/image perf layer
**Files:** `git checkout wip-redesign-backup -- src/lib/blur.ts src/components/mdx-image.tsx`; add dep `image-size`; wire into `src/components/mdx.tsx`.
**Interfaces — Produces:** `MdxImage`, `intrinsicSize(path)`, `BLUR_DATA_URL`.

- [ ] **Step 1:** Checkout the two files from the backup; `npm i image-size`.
- [ ] **Step 2:** Replace raw `<img>` in `mdx.tsx` with `MdxImage`; confirm `intrinsicSize` reads from `public/`.
- [ ] **Step 3 (test):** Add `test("intrinsicSize returns real dimensions")` for a known public asset. `npm test` → PASS.
- [ ] **Step 4:** Verify a project page renders images CLS-free via preview; `npm run build`.
- [ ] **Step 5:** Commit `perf: salvage next/image blur + intrinsic-size image layer`.

---

## Phase 2 — Tactile infrastructure (calibrated, subordinate)

### Task 6: Opt-in SFX + mute toggle (refined)
**Files:** Create `src/components/sfx/sound-provider.tsx`, `src/components/sfx/sfx-toggle.tsx`; keep/trim `src/lib/sfx.ts`; add dep `use-sound`; mount provider in `layout.tsx`; toggle in `top-nav.tsx`.
**Interfaces — Produces:** `SoundProvider`, `useUISound(src, opts)`, `SfxToggle`. Default **OFF**; `localStorage` key `perz:sfx`; never auto-on under reduced-motion.

- [ ] **Step 1:** `npm i use-sound`.
- [ ] **Step 2 (failing test):** `sfx.test.ts` — `test("mute state persists off by default and toggles")` against a mock `localStorage`. Run → FAIL.
- [ ] **Step 3:** Implement the provider (Context + `localStorage` + reduced-motion guard) and `useUISound` exactly per the spec §9 pattern; `SfxToggle` is a real focusable `<button aria-pressed>`.
- [ ] **Step 4:** Run test → PASS.
- [ ] **Step 5:** Wire hover/click sounds on nav + cards via `useUISound` (2–3 short variants, vol 0.2).
- [ ] **Step 6:** Verify: preview → toggle audible only after enabling; console clean; reduced-motion emulation keeps it silent.
- [ ] **Step 7:** Commit `feat: opt-in UI sound with accessible mute (default off)`.

### Task 7: Motion press/hover springs
**Files:** Create `src/components/motion/press.tsx` (`<PressCard>`, `<PressButton>`); add `<MotionConfig reducedMotion="user">` in `layout.tsx`; add dep `motion`.
**Interfaces — Produces:** press primitives — `whileHover scale≤1.03`, `whileTap scale≥0.97`, spring `{stiffness:300,damping:20}`, transform/opacity only.

- [ ] **Step 1:** `npm i motion`; add `MotionConfig`.
- [ ] **Step 2:** Implement `PressCard`/`PressButton`.
- [ ] **Step 3:** Verify via preview (press feedback present; reduced-motion disables scale); `npm run build`.
- [ ] **Step 4:** Commit `feat: tactile press/hover springs (reduced-motion aware)`.

### Task 8: Sprite retention + sheet-cache fix
**Files:** Modify `src/lib/aseprite.ts` (module-scope sheet cache), `src/components/sprite.tsx` (keep as nav mascot).

- [ ] **Step 1:** Add module-level `Map` cache to `loadSheet` so a sheet is fetched/decoded once.
- [ ] **Step 2:** Verify: preview nav shows the sprite animating; no repeated network fetches (`read_network_requests`); reduced-motion pauses it.
- [ ] **Step 3:** Commit `fix: cache aseprite sheets (leak), keep nav sprite`.

---

## Phase 3 — Hero & home

### Task 9: Hero — Spotlight-style + key-art carousel
**Files:** Rewrite `src/components/hero.tsx`.
**Structure (build against preview, reference [spotlight.tailwindui.com]):** full name (Bricolage) → Game-Designer positioning label (amber mono) → bio paragraph (provided copy) → social row → a tilted key-art card row/carousel of top projects (Motion, keyboard-navigable, no autoplay, first image `priority`). Remove Percy↔Shadab swap.
**Copy:** request hero label + confirm headline before finalizing.

- [ ] **Step 1:** Build the typographic block with the provided bio + `COPY:` placeholders for label/headline.
- [ ] **Step 2:** Build the tilted card row from `getProjects()` key art via `next/image` (priority on first only), `PressCard`, keyboard focusable, no autoplay.
- [ ] **Step 3:** Verify: preview desktop + `resize_window` mobile; `read_page` shows headings/nav order correct; console clean.
- [ ] **Step 4:** Commit `feat: carousel-led hero with Game-Designer positioning`.

### Task 10: Featured projects (evidence cards)
**Files:** Create `src/components/featured-projects.tsx`; render in `page.tsx`.
**Structure:** 3–5 cards, each: key art + role + one decision + one artifact + one outcome (copy slots), linking to the case-study page. Highstreet leads (2×1).

- [ ] **Step 1:** Build the card + section; `COPY:` slots for the four evidence lines per project.
- [ ] **Step 2:** Verify preview (Highstreet leads, evidence visible above the gallery); build.
- [ ] **Step 3:** Commit `feat: evidence-first featured projects`.

### Task 11: Subordinate work gallery (Titus-style dense grid)
**Files:** Create `src/components/work-gallery.tsx`; render below featured in `page.tsx`.
**Structure:** dense image grid of remaining work; explicit authorship credit line where art isn't the owner's; lazy-loaded; opens quick-view (Task 16).

- [ ] **Step 1:** Build the dense grid (reserved dimensions, lazy, responsive crops).
- [ ] **Step 2:** Verify preview (sits below evidence, compact, no CLS); build.
- [ ] **Step 3:** Commit `feat: subordinate dense work gallery`.

### Task 12: How I work
**Files:** Create `src/components/how-i-work.tsx`; render in `page.tsx`.
**Structure:** three beats (user experience · player-focused systems · shipping) — label + one line each (copy slots); product-design foundation acknowledged here.

- [ ] **Step 1:** Build the three-beat band with `COPY:` slots.
- [ ] **Step 2:** Verify preview; build.
- [ ] **Step 3:** Commit `feat: how-i-work section`.

### Task 13: Work-history timeline
**Files:** Create `src/components/work-timeline.tsx`; render near footer in `page.tsx`; consume `getWork()`.
**Structure:** compact rows — role · company · dates (+ optional line); logos via `next/image`.

- [ ] **Step 1:** Build the timeline from `getWork()`.
- [ ] **Step 2:** Verify preview (6 roles, newest first); build.
- [ ] **Step 3:** Commit `feat: compact work-history timeline`.

---

## Phase 4 — Projects & case studies

### Task 14: /projects page — Cuberto staggered grid
**Files:** Rewrite `src/app/projects/page.tsx`; component `src/components/projects-index.tsx`.
**Structure (reference [cuberto.com]):** staggered offset two-column card grid, cover image + title + one-line descriptor; Rauno-grade restraint; full set.

- [ ] **Step 1:** Build the staggered grid from `getProjects()`.
- [ ] **Step 2:** Verify preview desktop + mobile (stacks cleanly); build.
- [ ] **Step 3:** Commit `feat: /projects staggered grid`.

### Task 15: Case-study template (Simon-Pan spine + annotated media)
**Files:** Modify `src/app/projects/[slug]/page.tsx`; extend `src/components/mdx.tsx` vocabulary (Context/Problem/Role/Decisions/Outcome, annotated Figure, captioned `<Video>`).
**Structure:** full page, stable URL; sticky mini-summary; captioned video (never GIF); annotated-notes style; `dynamicParams=false`.

- [ ] **Step 1:** Build the two-column case layout + sticky summary; add the MDX case components.
- [ ] **Step 2:** Add a captioned `<Video>` MDX component (poster, controls, lazy, reduced-motion).
- [ ] **Step 3:** Verify preview on Highstreet slug (spine renders, media lazy, URL stable, back-button works); build.
- [ ] **Step 4:** Commit `feat: case-study template with Simon-Pan spine + captioned media`.

### Task 16: Vaul quick-view drawer (media peek)
**Files:** Create `src/components/quick-view.tsx`; wire into gallery/grid; add dep `vaul`.
**Interfaces:** opens a drawer with project media + a "full case study →" link to the real page. Not the primary detail.

- [ ] **Step 1:** `npm i vaul`; build the drawer (focus-trap, Esc, restores focus).
- [ ] **Step 2:** Verify preview desktop + mobile (drag-to-dismiss on touch, keyboard on desktop, focus returns); build.
- [ ] **Step 3:** Commit `feat: Vaul quick-view drawer for media peeks`.

### Task 17: BisectHosting case study salvage
**Files:** `git checkout wip-redesign-backup -- content/projects/bisecthosting.mdx src/components/brand-row.tsx public/BH_*.png public/MCEternal_FM.mp4 …` (enumerate from backup); adapt to current MDX components.
**Framing:** supporting product/UX foundation, not a co-headline.

- [ ] **Step 1:** List backup assets: `git show wip-redesign-backup:content/projects/bisecthosting.mdx`; checkout MDX + referenced assets + `brand-row.tsx`.
- [ ] **Step 2:** Reconcile MDX components (map `BrandRow`, carousels) to current `mdx.tsx`.
- [ ] **Step 3:** Verify preview of the BisectHosting page (media loads, credited); build.
- [ ] **Step 4:** Commit `feat: salvage BisectHosting product/UX case study`.

---

## Phase 5 — Résumé & contact

### Task 18: /resume page + PDF
**Files:** Create `src/app/resume/page.tsx`; add `public/resume.pdf`; nav link in `top-nav.tsx`.
**Structure:** scannable one-page HTML (summary, experience incl. **Nightwalker (Unreal)** as the qualified Unreal credential, skills, links) + a "Download PDF" button. Copy/values by owner; Unreal qualified precisely.

- [ ] **Step 1:** Build the HTML résumé layout with `COPY:` slots; wire the PDF download (owner supplies the PDF).
- [ ] **Step 2:** Add the nav entry.
- [ ] **Step 3:** Verify preview (scannable, prints/downloads, Unreal credential present); build.
- [ ] **Step 4:** Commit `feat: résumé page + PDF download`.

### Task 19: Contact form
**Files:** Create `src/app/contact/page.tsx` + a Server Action (`src/app/contact/actions.ts`) or route handler; env for the send mechanism.
**DECISION REQUIRED at this task:** send mechanism — Resend (Server Action + `RESEND_API_KEY`) vs a form service (Formspree). Default recommendation: Resend Server Action. Always keep a visible `mailto:` fallback.

- [ ] **Step 1:** Confirm send mechanism with owner; if Resend, `npm i resend` and add `RESEND_API_KEY` to `.env.local` (owner provides; never commit).
- [ ] **Step 2:** Build the form (labels, validation, honeypot, success/err states, keyboard/focus, `mailto:` fallback) + the action.
- [ ] **Step 3:** Verify preview (submit path returns success; validation works); build. Do not send real mail in test — stub or use a test address.
- [ ] **Step 4:** Commit `feat: contact form with email fallback`.

---

## Phase 6 — Perf/a11y hardening

### Task 20: Perf + a11y pass + platform fixes
**Files:** across components; `next.config.ts`; `src/app/sitemap.ts`; `src/app/projects/[slug]/page.tsx`.

- [ ] **Step 1:** Audit every image → `next/image` + blur + reserved dims; every clip → poster + lazy + no autoplay; only hero-first image `priority`.
- [ ] **Step 2:** Apply fixes: no `backdrop-blur` on fixed/overlay; `dynamicParams=false`; `mediaOnly` filtered from sitemap; dev-only `'unsafe-eval'` in CSP.
- [ ] **Step 3:** A11y sweep: focus visible, keyboard reachable, captions/transcripts, semantic headings, contrast; reduced-motion across SFX/springs/carousel.
- [ ] **Step 4:** Verify: preview `read_console_messages` clean, `read_network_requests` shows lazy media; `npm run build` + `npm run lint` clean.
- [ ] **Step 5:** Commit `perf: image/video discipline + a11y + platform fixes`.

---

## Phase 7 — Later (flagged, non-blocking)

### Task 21: Light/dark theme toggle (deferred)
**Files:** Create `src/components/theme/theme-toggle.tsx`; add `next-themes` provider; light-mode token set in `globals.css`.
**Structure:** `next-themes` (zero-flash, `suppressHydrationWarning`, `mounted` guard) + View-Transitions circular reveal (feature-checked, reduced-motion fallback) exactly per spec §9. Only after the evidence-first core ships and only if the doubled visual-QA is accepted.

- [ ] **Step 1:** Author the light token set; add provider + guarded toggle.
- [ ] **Step 2:** Verify both themes across hero/gallery/case-study/résumé (contrast, posters, focus rings) via preview; build.
- [ ] **Step 3:** Commit `feat: tactile light/dark theme toggle`.

---

## Self-Review (spec coverage)

- Positioning §3 → Tasks 3, 9, 18. Evidence principle §4 → Tasks 9–11. Design language §5 → Tasks 1, 9, 11, 14, 15, 16. IA §6 → Tasks 9–14, 18, 19. Sections §7 → Tasks 9–19. Tokens §8 → Task 1. Tactile §9 → Tasks 6–8, 21. Perf/a11y §10 → every task + Task 20. Credibility §11 → Tasks 3, 18. Salvage §12 → Tasks 5, 17. Libraries §13 → Tasks 5,6,7,16,19,21. Non-goals §14 → excluded (no staging content, no 2nd case study, education stays hidden). Copy plan §15 → placeholders + per-section requests throughout.
- No unresolved placeholders of the forbidden kind; `COPY:` markers are intentional owner-supplied slots, not plan gaps.
- Interface names consistent: `getWork`, `useUISound`, `PressCard/PressButton`, `MdxImage/intrinsicSize`, `quick-view`.
- Open decision flagged in-task: contact send mechanism (Task 19).
