# Public media folders

- `home/`: hero, about, experience logos, recommendations (`quotes`), banners and featured work.
- `projects/<project>/hero/`: cover artwork and trailers.
- `projects/<project>/gallery/`: general project screenshots.
- `projects/<project>/sections/<section>/`: all images and videos for that feature or carousel, together.
- `contact/` and `resume/`: media grouped by page section.
- `shared/`: reusable icons, branding, social artwork, sprite sheets with their JSON, and placeholders.
- `fonts/`: site fonts. `llms.txt` and `.well-known/` remain at their required public URLs.

Add carousel images and videos to the matching section folder, then update its media list in `content/portfolio/pages.json`. Folder contents do not automatically publish. Sidequest content still uses `content/projects/*.mdx` until its final design is implemented.

Different encodings and crops are retained. Shared files are referenced without copying them. `content/portfolio/unique-media.csv` lists current files; `media-organization.json` records moves. Old URLs are supported by `media-aliases.json`.
