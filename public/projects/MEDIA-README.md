# Project media

Open `D:/Git/perz.dev/MEDIA-REVIEW.html` for the visual review sheet, grouped by page and section, with checkboxes for marking artwork. The sheet references the actual media files; it does not create duplicate thumbnails.

Every retained raster image has a descriptive subject name. Reused images share one canonical file, including across gallery and section references. Different crops or compositions that contain different content remain separate and are named accordingly. Exact duplicate copies and visually verified alternate-format exports were consolidated.

Put section images and videos together in `sections/<section>/`. Each folder has a README naming the section and its files. Update `content/portfolio/pages.json` for case studies or `content/projects/*.mdx` for Sidequests after adding files. Files do not publish automatically.

Section clips autoplay muted, loop and have no player controls. Hero reels remain click-to-play. Motion preferences and offscreen visibility pause section clips.

`content/portfolio/media-cleanup.json` records the canonical assets and old-to-new names. `unique-media.csv` is the current file/hash inventory. Compressed recovery archives are outside public in `media-source/`.
