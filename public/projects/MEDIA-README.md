# Media authoring folders

Use `public/projects/<project>/hero/`, `gallery/`, and `sections/NN-section-name/`. Put all images AND videos for a section together in that section folder. Banners have their own folder. Main pages have `public/home/`, `public/resume/`, `public/contact/`, and index cards use `public/projects/cards/`.

The full folder inventory is `content/portfolio/media-sections.csv`. Empty folders are retained with `.gitkeep`. Case-study sections reflect the current website; unfinished Sidequest folders follow the legacy MDX headings and are marked pending. Pages with no feature sections do not have invented feature folders.

## Where the unique files are

`content/portfolio/unique-media.csv` lists the retained files. Exact duplicate copies have been removed and website references now point to the retained page/section asset. Shared artwork can be referenced by several sections without another physical copy. `content/portfolio/removed-duplicates.json` records each removal; `media-aliases.json` preserves old URLs through server rewrites. Empty section folders remain available for authoring.

The audit compares file contents, not filenames. Different encodings, crops or resolutions of the same artwork can still appear separately. Reused art in two sections can intentionally share one file reference; it does not need another physical copy.

## Adding a carousel image or video

Place the files in the matching section folder, then update that section's `media` array in `content/portfolio/pages.json`. Images use `src`, `alt`, `fit` and `background`. A video item uses `src` for its poster and `video` for the video file. Multiple items automatically use the section carousel. Keep `sourceHash` when available to trace Figma sources. New files are not automatically displayed just by dropping them in a folder. Legacy/Sidequest content remains in `content/projects/*.mdx` until its final design is implemented.
