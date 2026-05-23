# Selected Visual Work

Drop one JSON file per curated visual piece into this directory. The
home page's "Selected Visual Work" section reads everything matching
`*.json` here, sorted newest-first.

Target: 3–5 pieces. More than that dilutes the curation signal.

## Schema

```json
{
  "title": "Knite Studios key art",
  "year": "2022",
  "startDate": "2022-09-01",
  "media": "/visual/knite-keyart.jpg",
  "type": "still",
  "description": "Brand identity exploration for an indie studio."
}
```

- `title` — what the piece is.
- `year` — display value. Single year or span ("2021–2022").
- `startDate` — sort key (YYYY-MM-DD). Used for ordering only.
- `media` — path under `/public/`. Drop the asset in
  `public/visual/` to match.
- `type` — `"still"` for images, `"video"` for short autoplaying loops.
- `description` — optional one-liner shown on hover.

The section hides itself if this directory is empty.
