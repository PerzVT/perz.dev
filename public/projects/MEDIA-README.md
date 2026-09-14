# Media authoring folders

Use `public/projects/<project>/hero/`, `gallery/`, and `sections/NN-section-name/`. Put all images AND videos for a section together in that section folder. Banners have their own folder. Main pages have `public/home/`, `public/resume/`, `public/contact/`, and index cards use `public/projects/cards/`.

The full folder inventory is `content/portfolio/media-sections.csv`. Empty folders are retained with `.gitkeep`. Case-study sections reflect the current website; unfinished Sidequest folders follow the legacy MDX headings and are marked pending. Pages with no feature sections do not have invented feature folders.

## Where the unique files are

`content/portfolio/unique-media.csv` lists one canonical path per exact file. Prefer those paths when locating artwork. `duplicate-media.csv` lists every additional byte-identical copy. Files are not all unique within a single physical folder: `public/figma/` is the extracted Figma library, older `public/projects/` root files are original project media, and the page/section folders contain organized copies created for authoring. No additional media copies were created in this audit and no originals were deleted.

The audit compares file contents, not filenames. Different encodings, crops or resolutions of the same artwork can still appear separately. Reused art in two sections can intentionally share one file reference; it does not need another physical copy.

## Adding a carousel image or video

Place the files in the matching section folder, then update that section's `media` array in `content/portfolio/pages.json`. Images use `src`, `alt`, `fit` and `background`. A video item uses `src` for its poster and `video` for the video file. Multiple items automatically use the section carousel. Keep `sourceHash` when available to trace Figma sources. New files are not automatically displayed just by dropping them in a folder. Legacy/Sidequest content remains in `content/projects/*.mdx` until its final design is implemented.
