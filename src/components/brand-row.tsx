/**
 * BrandRow — flex row of horizontal brand logos, sized to a
 * consistent height so logos of different native aspect ratios
 * sit visually balanced. Used inside MDX case studies when a
 * section needs to surface multiple brands as a related set.
 *
 * Logos are passed as a comma-separated string of paths so the
 * component composes cleanly from MDX (where JS-expression props
 * with arrays aren't supported by our MDX runtime). Alt text is
 * derived from the filename — author-readable but not great for
 * screen readers; pass `alts` if you need explicit labels.
 */
export function BrandRow({
  srcs,
  alts,
}: {
  /** Comma-separated paths under /public, e.g. "/foo.png, /bar.png". */
  srcs: string;
  /** Optional comma-separated alt-text overrides. Same length as srcs. */
  alts?: string;
}) {
  const sources = srcs
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const altList = alts
    ? alts
        .split(",")
        .map((a) => a.trim())
    : [];

  if (sources.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
      {sources.map((src, i) => {
        // Filename → fallback alt. Strips path and extension, swaps
        // delimiters for spaces. "MC_Logo_Horizontal_Light.png" →
        // "MC Logo Horizontal Light".
        const filename =
          src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
        const fallbackAlt = filename.replace(/[_-]+/g, " ");
        const alt = altList[i] ?? fallbackAlt;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + i}
            src={src}
            alt={alt}
            className="h-10 w-auto object-contain sm:h-14"
          />
        );
      })}
    </div>
  );
}
