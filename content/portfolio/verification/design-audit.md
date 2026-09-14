# Portfolio design audit — 13 September 2026

Independent aspect runs reviewed the staging site before corrections. These are baseline grades, not certification or a claim that every page matches Figma. Accuracy inspected Home 292:470 and its About, Recommendations and Banners in Figma. Accessibility and motion used Edge browser tests. Color and type used computed styles, the focused Figma measurements and brand authority.

| Aspect | Baseline grade | Main evidence |
|---|---:|---|
| Design accuracy | 5/10 | Eight stale recommendation avatar URLs; component effects differ from Figma; Hero drops authored crop transforms. |
| Accessibility | 5.5/10 | Skip link did not move keyboard focus; focused recommendation region continued rotating; manual announcements permanently disabled. |
| Motion and animation | 5/10 | Focus pause failure, reduced-motion changes ignored by Lenis, paused RAF work, approximate whole-rail transitions. |
| Color and depth | 4/10 | Backing #344351 was 3.5 times intended ink luminance; purple banner rim replaced with neutral; light blue sections missing. |
| Typography | 6/10 | Quote16 versus15px; author role12 versus15px; incorrect leading and CTA geometry. |

Grades measure fidelity and behavior, not merely whether code builds. Accuracy rubric: artwork2/4, layout/type2/4, consistency1/2. Accessibility rubric: keyboard1/2, semantics1.7/2, carousel0.4/2, motion/media1.4/2, consistency1/2. Other aspect grades are expert assessments supported by the listed defects rather than automated scores.

## Confirmed causes

The media migration missed content/recommendations.json. Physical alias targets existed, but old URLs returned404 in the running server. Prior filesystem-only validation did not catch that. Repeated generic CSS overrides also replaced component-specific values. A passing build and basic overflow check were incorrectly treated as sufficient visual verification.

## Corrections and evidence

- Active recommendation data now uses canonical /home/quotes paths. Recheck loaded Matt, Arron and Emma with naturalWidth100.
- Recommendation quote/name/role restored to15px Fredoka,145% leading. Dark quote base restored to#111820 at6px without inset highlight.
- Media uses ink#18222C,9px base with1px spread and2px22% inset highlight; banners retain purple#6973BB rim while photos keep neutral borders.
- Primary CTA restored to18px/120% Lilita,16px radius,4px rim,48px minimum height.
- Light structural border restored to#C5BBA8. About/footer restored to documented blue#2F398E with cream text. Existing brighter neutral-control rim retained as an explicit contrast exception rather than copied onto decorative borders.
- Skip link now focuses MAIN#main-content. Recheck next Tab reached main Play, bypassing header.
- Recommendations focus pauses rotation; manual ArrowRight announced Recommendation2 of8 with aria-live polite.
- Live reduced-motion preference destroys Lenis and pauses rotation. Recheck confirmed.
- Auto-rotation stops RAF while paused/offscreen; visibility requires30%; elapsed dwell resumes after pause. Actual rotation state is exposed.
- Recommendation animation now clips within a dedicated viewport, leaving controls outside; measured gap replaces hardcoded32px for quotes.

## Remaining findings — not claimed fixed

1. Hero renderer still ignores some authored crop transforms and gives secondary hero artwork generic placement. Contact, Bubble Buddy, Dragoncraft and Mythcraft require targeted source comparison before changing composition.
2. Banner protection gradient still differs from the authored blue radial treatment. Restore from exact gradient data, then visually check text over artwork; do not substitute another guessed gradient.
3. Whole-rail cloning is still an approximation of a continuous carousel track. Dot jumps and wrap transitions need a stable-track implementation and dedicated visual tests.
4. Touch gestures do not distinguish vertical intent or cancellation robustly.
5. User requested no carousel pause button. Hover/focus/reduced-motion work, but there is no persistent on-site stop preference. This remains an accessibility tradeoff, not silently resolved by reintroducing a rejected button.
6. CSS still contains repeated overrides. Consolidate approved component roles after reference discrepancies are settled; avoid further global palette experiments.
7. Sidequest detail designs remain pending. This audit does not certify unfinished pages or every hero/media crop.

## Validation limits

No native screen-reader session or full WCAG certification. Text-over-artwork contrast requires rendered sampling; token contrast alone is insufficient. No new overall grade is assigned after these targeted fixes. A separate full re-audit is needed before increasing the baseline grades.

See audit-baseline.json for measured pre-fix computed styles and audit-recheck.json for rendered page checks. Latest brand/user refinements override older Figma values where explicit: banner heading stays Lilita24; section bullets remain requested ✦; autoplay pause buttons remain removed.
