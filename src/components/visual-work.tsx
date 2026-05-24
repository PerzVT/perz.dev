import type { VisualPiece } from "@/lib/content";
import { LazyVideo } from "@/components/lazy-video";
import { RotatedFrame } from "@/components/rotated-frame";

/**
 * Selected Visual Work — curated exhibit of 3–5 pieces of branding /
 * key art / poster work. Per the redesign spec, graphic-design work
 * lives inside relevant game project pages by default; this section
 * is for the orphan pieces that don't tie to a shipped game but show
 * the visual evolution.
 *
 * Tiles are exhibits, not projects: clicking does nothing. Each tile
 * lives inside a RotatedFrame so the gallery reads as placed pieces
 * rather than a uniform grid. Hover surfaces year + title and the
 * frame rotation eases toward zero.
 *
 * Empty data → section renders nothing. The consuming page should
 * also not render the heading.
 */
export function VisualWork({ pieces }: { pieces: VisualPiece[] }) {
  if (pieces.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pieces.map((p, i) => (
        <li key={`${p.title}-${p.year}`}>
          <VisualTile piece={p} index={i} />
        </li>
      ))}
    </ul>
  );
}

function VisualTile({
  piece,
  index,
}: {
  piece: VisualPiece;
  index: number;
}) {
  const isVideo = piece.type === "video";
  return (
    <figure className="group">
      <RotatedFrame
        index={index}
        className="aspect-square border border-border/60"
      >
        {isVideo ? (
          <LazyVideo
            src={piece.media}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={piece.media}
            alt={piece.title}
            className="max-h-full max-w-full object-contain"
          />
        )}
      </RotatedFrame>
      <figcaption className="mt-3 flex items-baseline gap-3 px-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          {piece.year}
        </span>
        <span className="font-display text-base leading-tight text-foreground">
          {piece.title}
        </span>
      </figcaption>
      {piece.description && (
        <div className="mt-1 px-1 text-xs text-muted-foreground/80">
          {piece.description}
        </div>
      )}
    </figure>
  );
}
