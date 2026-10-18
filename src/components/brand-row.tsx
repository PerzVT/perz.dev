/**
 * BrandRow: flex row of brand logos at a consistent height so
 * different aspect ratios stay visually balanced. Used in MDX case
 * studies to surface several brands as a set.
 *
 * `srcs` is a comma-separated string, not an array, because the MDX
 * runtime doesn't support array-expression props. Alt text falls
 * back to the filename, which isn't great for screen readers; pass
 * `alts` for real labels.
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
        // delimiters for spaces. "meloncube-logo.png" →
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
