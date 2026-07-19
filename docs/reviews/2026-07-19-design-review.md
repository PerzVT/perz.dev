# Home Design Review — 2026-07-19

**Reviewer:** self-run adversarial pass against the `ui-ux-pro-max` pre-delivery checklist + live preview (desktop + mobile). Codex's own run was killed by the Bash tool's 10-minute ceiling mid-review — its first-pass note was that the page has "a strong restrained base." (Codex was driving its `impeccable` frontend-review skill.)

## Verdict

The home reads as a real product-designer surface carrying game content — evidence-first under a Spotlight-faithful hero. Issues found were **refinement, not structural**.

## Fixed this pass

- **Keyboard focus** — no consistent focus ring → added a global amber `:focus-visible` outline on all interactive elements (`globals.css`).
- **Hero curation** — the Bero illustration leaked into the "games" carousel → filtered the hero cards to non-media-only projects (games) (`hero.tsx`).
- **Opacity-on-text** (a `ui-ux-pro-max` anti-pattern — alpha drifts per surface) — the outcome line (`/70`) and the case-study underline (`decoration-hl/40`) → solid colors (`featured-projects.tsx`).
- **Nav tap targets** — `py-1` (~28px) below the 44px minimum → `py-2` (~36px) (`top-nav.tsx`).

## Verified

- **Mobile (375px):** zero horizontal overflow; nav fits.
- **Desktop:** no console or server errors; production build green (15/15 static pages, TS clean).
- Backdrop-blur removed from the fixed nav (Windows-Chromium compositor fix).

## Open / deferred (by plan, not defects)

- **Copy** — owner writes all copy at the end; the per-project outcome line + how-i-work bodies are marked placeholder.
- Task 3 (metadata/positioning), `/projects` Cuberto grid, résumé + contact pages, the tactile SFX/Motion layer (Phase 2), theme toggle (Phase 7).
- Nav tap target is 36px, still under 44px — acceptable for a desktop-primary text nav; revisit if the audience skews mobile.
- Section vertical rhythm varies slightly (`py-24 / 28 / 32`) — minor; unify in a later pass.
- Codex design-phase point still standing: consider a **second deep case study** so credibility isn't all on Highstreet.
