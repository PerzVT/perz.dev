import type { CSSProperties } from "react";
import type { Media } from "@/lib/portfolio";
export function MediaImage({
  media,
  alt,
  className = "",
  priority = false,
}: {
  media: Media;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const t = media.crop;
  const crop =
    t && t[0][0] > 0 && t[1][1] > 0
      ? {
          width: `${100 / t[0][0]}%`,
          height: `${100 / t[1][1]}%`,
          left: `${(-100 * t[0][2]) / t[0][0]}%`,
          top: `${(-100 * t[1][2]) / t[1][1]}%`,
          objectFit: "fill" as const,
          maxWidth: "none",
        }
      : {};
  return (
    <span
      className={`pf-media-image ${className}`}
      style={{ background: media.background || "var(--pf-surface)" }}
    >
      <img
        src={media.src}
        alt={alt ?? media.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
        style={{
          objectFit: (media.fit || "contain") as CSSProperties["objectFit"],
          ...crop,
        }}
      />
    </span>
  );
}
