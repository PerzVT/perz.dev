import type { CSSProperties } from "react";
import type { Media } from "@/lib/portfolio";

export function MediaImage({ media, alt, className = "", priority = false }: {
  media: Media; alt?: string; className?: string; priority?: boolean;
}) {
  const t = media.crop;
  const cropped = t && t[0][0] > 0 && t[1][1] > 0;
  const frame = media.frame || [1440, 712];
  const image = <img src={media.src} alt={alt ?? media.alt}
    width={media.width} height={media.height}
    loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined}
    draggable={false} style={cropped ? {
      width: `${100 / t[0][0]}%`, height: `${100 / t[1][1]}%`,
      left: `${-100 * t[0][2] / t[0][0]}%`, top: `${-100 * t[1][2] / t[1][1]}%`,
      objectFit: "contain", maxWidth: "none",
    } : { objectFit: (media.fit || "contain") as CSSProperties["objectFit"] }} />;
  return <span className={`pf-media-image ${className}`} style={{
    background: media.background || "var(--pf-surface)",
    "--media-frame-ratio": frame[0] / frame[1],
  } as CSSProperties}>
    {cropped ? <span className="pf-media-scene">{image}</span> : image}
  </span>;
}
