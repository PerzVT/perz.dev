# perz.dev Rebuild — Design Spec

- **Date:** 2026-07-18 (revised after reference research + Codex adversarial review)
- **Status:** Design approved. Copy supplied incrementally by the site owner.
- **Base:** live `main` (canonical repo, github.com/PerzVT/perz.dev).
- **Work branch:** `game-designer-rebuild` (off `main`).
- **Deploy rule:** never push `main`/`master`; changes go to `staging` for review, owner promotes to live.

---

## 1. Context

Rebuilt on **live `main`**. A large in-progress redesign existed only on a disconnected orphaned local fork (`master` → `wip-redesign-backup`, ~1 month behind, no shared history) — not canonical; preserved and **mined for parts**, not merged. Stack: Next.js 16 (App Router), React 19, Tailwind v4, MDX (`next-mdx-remote`).

## 2. Goal & audience

- **Audience:** game studios hiring. **Action:** land an interview.
- **Optimize for:** a hiring lead scanning ~60–120s who must quickly answer — *what role, what shipped, what did they personally own, where's the proof.*

## 3. Positioning (through-line)

Lead everywhere with **Game Designer — user experience + player-focused systems.** Developer and product-design experience are **supporting foundation** (inside "How I work" and case-study background), never the hero label, nav, or page `<title>`.

Approved positioning copy (owner's words, 2026-07-18): *"I'm a Game Designer specialized in user experience, with professional experience building PC and VR games. With a strong foundation working in engines like Unity and Unreal, I love designing intuitive mechanics and engaging systems that create fun and memorable experiences."* → hero supporting paragraph. Hero uses the owner's **full name** (the live Percy↔Shadab hover swap is removed).

## 4. The core principle (from the Codex pass)

**Prove game-design judgment first, then show craft.** The product-design surface and the tactile layer are *invisible infrastructure* — they make role, decisions, and outcomes easy to grasp; they never become the featured interaction project. Key art is the **invitation**, not the proof: every featured project pairs an image with role · one decision · one artifact · one outcome. Personality is kept but **subordinate and dialed down**.

## 5. Design language (assembled from references, locked)

- **Base surface:** Anton Sten editorial restraint — big type, whitespace, clear hierarchy, one accent.
- **Hero:** Tailwind *Spotlight*-style — typographic intro (full name + Game-Designer positioning + bio) **above a tilted key-art card carousel** of projects. *Carousel-led* (owner's call), with positioning + role/outcome legible immediately so it reads as carousel **and** evidence.
- **/projects page:** *Cuberto*-style staggered offset card grid, carried with *Rauno*-grade restraint + top-nav craft.
- **Gallery / visual work:** *Titus Lunter*-style dense image grid — **subordinate** to the project evidence, with explicit authorship credits on any art the owner didn't create.
- **Case-study pages:** full **pages with stable, shareable URLs** (Simon-Pan spine: context → problem → role → decisions incl. options rejected → measured outcome), presented in the *family-values* annotated-notes style with short **captioned video** (not GIF) demonstrating interactions.
- **Project quick-view:** *Vaul* drawer for fast media peeks only — **not** the primary project detail (deep work lives on real pages).

## 6. Information architecture

Home: **Hero (carousel + positioning) → featured projects with evidence → subordinate dense gallery / "more work" → How I work → work-history timeline → Footer.**
Routes: `/` · `/projects` (full Cuberto grid) · `/projects/[slug]` (case studies) · **`/resume`** · Contact.
Nav: **Projects · How I work · Résumé · Contact** (home via wordmark/sprite).

## 7. Section specs

- **Hero** — see §5. Copy slots (owner): Game-Designer label; headline (proposed reuse: *"I design systems that feel obvious to use and rewarding to play"*); support paragraph (provided §3).
- **Featured projects (home)** — 3–5 evidence-rich cards, each: key art + role + one decision + one artifact + one outcome. Highstreet leads.
- **How I work** — three beats (user experience · player-focused systems · shipping); product-design background acknowledged here as foundation. Copy pending.
- **Project grid (/projects)** — full Cuberto staggered grid; `content.ts` interleave adjusted so games lead.
- **Case studies** — full for Highstreet (anchor). Second deep case study = **recommended, deferred** (not this build).
- **Work history** — compact timeline; reinstate dormant `content/work/*.json` (write the missing loader + Timeline component); fix broken `knite.svg` ref.
- **Résumé (`/resume`)** — scannable one-page HTML + downloadable PDF. jobTitle = Game Designer. Name **Nightwalker (Unreal)** here as the Unreal credential (project not showcased, by choice). Copy/values by owner.
- **Contact** — real form; send mechanism TBD (Server Action + Resend, or a form service). Visible email fallback regardless.
- **Footer** — keep (mail, socials, ©), amber ✦.

## 8. Identity & tokens

- **Type:** Bricolage Grotesque (display 800) · Inter (body 400/500) · JetBrains Mono (micro-labels).
- **Accent:** amber `#ffb454` — single hue (replaces live cobalt), threaded through eyebrows, links, focus ring, `::selection`, footer ✦, sprite note.
- **Palette:** neutral-900 dark base retained.

## 9. Tactile layer (kept, calibrated, subordinate)

- **Sprite mascot (nav)** = the **one signature personality device** (Codex: "one device max"). Apply the sheet-cache fix.
- **UI sound** — restrained hover/click SFX, **default OFF**, keyboard-accessible mute toggle, `localStorage`-persisted, reduced-motion aware (`use-sound`; WCAG 1.4.2-safe — the enabling click self-unlocks audio).
- **Press/hover microinteractions** — Motion `whileHover`/`whileTap` springs, scale ≤1.03 / ≥0.97, <200ms, `transform`/`opacity` only, `MotionConfig reducedMotion="user"`.
- **Theme light/dark toggle** — *optional delight-budget item, flagged.* If kept: `next-themes` (zero-flash SSR) + View-Transitions circular reveal (feature-checked, reduced-motion fallback). Weigh against the doubled visual-QA cost before committing.
- **Strip:** cutting-mat background, ⌘K terminal (lean cut unless it earns a place), dead `shadcn` import, `.pixel-border`, unused fade keyframes.

## 10. Performance & accessibility (non-negotiable)

- **Video with poster frames, not GIFs;** lazy-load near viewport; **no autoplay**; first hero visual gets loading priority, nothing else preloaded.
- `next/image` + blur placeholder everywhere; reserved dimensions; responsive crops; no full key-art served as thumbnails.
- Stable URLs + browser history for case studies; keyboard nav, visible focus, captions/transcripts, semantic headings, sufficient contrast; non-motion equivalents for any interaction explanation.
- No `backdrop-blur` on fixed/overlay (Windows-Chromium stall). Dev-only `'unsafe-eval'` CSP. `mediaOnly` out of sitemap; `dynamicParams=false`.

## 11. Credibility fixes (from Codex)

- **Unreal:** keep, **qualified precisely** (owner's words); backed by **Nightwalker** named as experience on the résumé (not showcased).
- **"400k+ players" / Kerberus / Draconia:** frame the owner's specific contribution + relevance to game-design ability, and pre-empt the "does running a studio affect availability?" question — owner's copy.
- **Role focus:** state the primary role sought, then UX + player-focused systems as the demonstrated specialization.

## 12. Salvage from `wip-redesign-backup`

Bricolage+amber token set; BisectHosting case study MDX + brand assets + `BrandRow`; `next/image` perf pass (`blur.ts`, `mdx-image.tsx`); `carousel`/`reveal`/`rotated-frame` where used; fixes checklist.

## 13. Implementation libraries

`use-sound` (SFX), `next-themes` (theme, if kept), Motion / Framer Motion (springs), Vaul (quick-view drawer), MDX (case studies). Verify layout/provider snippets against the repo's Next build per `AGENTS.md`.

## 14. Non-goals (this pass)

Staging content (argus, hermes, dragoncraft/mythcraft/toothless, supercat devlog rewrite); education section; second deep case study; playable-link buildout beyond existing itch links; copy authoring (owner writes all copy).

## 15. Copy plan (incremental)

Provided: hero support paragraph (§3). Pending, requested per section during build: hero label + headline; How-I-work 3 lines; featured-project evidence lines (role/decision/artifact/outcome ×N); résumé content + Unreal/Nightwalker qualification; 400k/Kerberus framing; meta title + descriptions; contact copy.
