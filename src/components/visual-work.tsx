import type { VisualPiece } from "@/lib/content";
import { LazyVideo } from "@/components/lazy-video";

/**
 * Selected Visual Work — curated exhibit of 3–5 pieces of branding /
 * key art / poster work. Per the redesign spec, graphic-design work
 * lives inside relevant game project pages by default; this section
 * is for the orphan pieces that don't tie to a shipped game but show
 * the visual evolution.
 *
 * Tiles are exhibits, not projects: clicking does nothing. Hovering
 * surfaces year + title. Square aspect for mixed-media consistency
 * (key art, posters, brand marks all sit coherently).
 *
 * Empty data → section renders nothing. The consuming page should
 * also not render the heading.
 */
export function VisualWork({ pieces }: { pieces: VisualPiece[] }) {
  if (pieces.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pieces.map((p) => (
        <li key={`${p.title}-${p.year}`}>
          <VisualTile piece={p} />
        </li>
      ))}
    </ul>
  );
}

function VisualTile({ piece }: { piece: VisualPiece }) {
  const isVideo = piece.type === "video";
  return (
    <figure className="group relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-card">
      {isVideo ? (
        <LazyVideo
          src={piece.media}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={piece.media}
          alt={piece.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-10 text-white opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/70">
          {piece.year}
        </div>
        <div className="mt-0.5 font-display text-base leading-tight">
          {piece.title}
        </div>
        {piece.description && (
          <div className="mt-1 text-xs text-white/75">{piece.description}</div>
        )}
      </figcaption>
    </figure>
  );
}
