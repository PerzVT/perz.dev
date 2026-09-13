# Project media

Each project has `hero/`, `gallery/`, `sections/NN-section-title/`, and `banners/` folders. Existing source files are preserved. Section folders contain the images already assigned by the Figma design. Gallery media remains available until you assign the remaining images to sections; no section placement has been guessed.

Move or add images to these folders during the content review. The website reads `content/portfolio/pages.json`, so moving a file also requires updating its `src` there. Each item has `fit` (`contain` or `cover`), `background`, and optional Figma `crop`. Keep `sourceHash` for tracing artwork back to Figma. `content/portfolio/media-paths.json` records original and organized paths. New files are not automatically published just by dropping them in a folder.
