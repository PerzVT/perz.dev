# Applied motion

- Transitions.dev (https://transitions.dev/): directional content transitions, short state swaps and active indicators. Original implementation using browser transform/opacity animations; no copied Pro source.
- Emil design-engineering guidance: custom ease-out, stable control geometry, reduced motion, no heavy filters.
- Lenis (https://github.com/darkroomengineering/lenis): existing install retained, anchor handling corrected, touch/nested fields stay native.
- Interior Copy Button (https://www.interior.dev/docs/copy-button): fixed-width copy/check feedback, failure message retained.

All shared carousel rails use a pill-shaped elapsed-time indicator synchronized to the 12-second advance. Hover, focus, hidden tabs and playing videos pause the clock. Manual navigation resets it. Reduced motion disables auto-advance and slide animation. No auto-scroll pause buttons are rendered. Shared media and recommendation changes slide directionally over 380 ms. Page entry uses a short 240 ms fade/translation.

Saved chart, workflow, cursor-tour, Remotion and Rive references remain project-specific. No extra animation dependencies were installed.
