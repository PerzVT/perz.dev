# perz.dev — polish plan

Everything from the design-polish conversation, reconciled into one list. The
goal in the owner's words: **less generic, more polished.**

Legend: `[x]` done · `[ ]` open · **(owner)** blocked on his art/facts/decision.

---

## 0. Done already (this session)

- `[x]` Button + Banner components; every CTA runs through them
- `[x]` Button depth pass (gradient, inset top highlight, colour-tinted shadow, hover lift, press sink)
- `[x]` Card "Read more" matches the secondary button treatment
- `[x]` "All work" moved from section header to one centred button below the rail
- `[x]` Sound toggle: out of the flyout, standalone bottom-right, light disc for contrast
- `[x]` Nav sprite cycles the mascot on click (pacomepertant-style easter egg)
- `[x]` Lenis smooth scrolling, reduced-motion aware, anchors handled
- `[x]` Banner art rendering fix (was hidden behind the card background)
- `[x]` Carousel edge fade removed; duplicate work links removed
- `[x]` Light theme dropped; contrast failures fixed; hardening, 404, locked pages

---

## 1. The big one — scrapbook layout

Reference: **chungsunglau.co.uk**. Unbound, editorial, overlapping, not a grid.
Supersedes the earlier collection-surfer and orbit-card-stack ideas.

- `[ ]` **`/projects` page** rebuilt in this direction (replaces the uniform grid)
- `[ ]` **Home featured section** reconciled with it, so the two don't read as different sites
- `[ ]` **(owner)** comp it in Claude Design first — this is a layout invention, not a styling tweak, and guessing wastes both our time

**Note:** this is the single biggest visual change on the list. Everything else
is polish on top of the existing structure; this one replaces structure.

---

## 2. Buttons — still not there

The depth pass landed but the owner still reads them as generic. Options, in
order of how much they change:

- `[ ]` **Tune the current treatment** — radius, weight, letter-spacing, shadow falloff. Cheap, might be enough.
- `[ ]` **Add a texture layer** — subtle noise or a brushed-metal gradient sheen (the metal.jakubantalik feel, without the liquid shader). Middle cost.
- `[ ]` **(owner)** comp the button in Claude Design and I match it exactly. Most certain path to what he actually wants.

---

## 3. Motion + life

- `[ ]` **Heading animation** — letter-cascade on hover, or kinetic-text-reveal on scroll-in (componentry.dev). Reduced-motion aware.
- `[ ]` **Footer signature** — animated "perz" signature, clipped large, side-anchored, low opacity behind the footer.
- `[x]` Lenis smooth scroll
- `[x]` Scroll reveals on home sections

---

## 4. Banners — need assets

The component is built and proven with the Kerberus/Discord banner.

- `[ ]` **(owner)** BisectHosting affiliate — artwork + affiliate URL. Slot and example markup ready in `src/components/home/end-banners.tsx`.
- `[ ]` **(owner)** Meta Quest banner for Highstreet — artwork; I'll do the Meta-blue button and icon.
- `[ ]` **(owner)** Contact card below the banners — what does it hold that the contact section doesn't?

---

## 5. Content gaps

- `[ ]` **(owner)** Supercat: what came back from the Edmonton/Calgary booths and the publisher pitches; what the reward loops were
- `[ ]` **(owner)** Bubble Buddy: why the team kept building after the jam
- `[ ]` **(owner)** Covers (2:3, 1200×1800): Supercat, Slime Dragon, Pack Manager
- `[ ]` **(owner)** Poly Punch media — he has it; a gesture clip is the priority
- `[ ]` **(owner)** Résumé PDF, plus education rows and skill-bar numbers
- `[ ]` Compress Supercat `trailer.mp4` (7MB, lazy-loaded so lower priority)

---

## 6. Declined / parked, with reasons

- **GitHub calendar** — recommend skipping. The owner's commits are batched from offline sprees, so the chart reads "inactive" to anyone who doesn't know that. It would undersell him.
- **bklit charts** — nothing on the site has real data yet. Only worth it if the résumé skill bars stay, and those numbers are self-assigned anyway.
- **Steam-style featured carousel** — dropped by the owner mid-thread; the scrapbook direction replaces it.

---

## Recommended order

1. **Scrapbook layout comp** (owner, in Claude Design) — it's the biggest change and everything else should sit on top of the final structure, not be redone after it.
2. **Button direction** (owner comp, or I tune) — it's on every page, so getting it right pays off everywhere.
3. **Banner assets + content gaps** (owner) — these unblock finished pages.
4. **Motion polish** (me) — signature, heading animation. Best done last, on a settled layout.
