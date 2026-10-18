import type { CSSProperties } from "react";
import { getImageProps } from "next/image";
import type { Media } from "@/lib/portfolio";
import dimensions from "../../../content/portfolio/image-dimensions.json";

export function MediaImage({ media, alt, className = "", priority = false, eager = false, sizes = "(max-width: 800px) calc(100vw - 48px), 1096px", narrowMedia, narrowPosition = "50% 50%", narrowBreakpoint = 1100 }: {
  media: Media; alt?: string; className?: string; priority?: boolean; eager?: boolean; sizes?: string; narrowMedia?: Media; narrowPosition?: string; narrowBreakpoint?: number;
}) {
  const t = media.crop;
  const cropped = t && t[0][0] > 0 && t[1][1] > 0;
  const size = (dimensions as Record<string, number[]>)[media.src];
  const width = media.width || size?.[0] || 1440;
  const height = media.height || size?.[1] || 900;
  const frame = media.frame || (cropped ? [1440, 712] : [width, height]);
  const { props } = getImageProps({ src: media.src, alt: alt ?? media.alt, width, height,
    sizes, quality: 90, loading: priority || eager ? "eager" : "lazy", fetchPriority: priority ? "high" : undefined,
    style: cropped ? {
      width: `${100 / t[0][0]}%`, height: `${100 / t[1][1]}%`,
      left: `${-100 * t[0][2] / t[0][0]}%`, top: `${-100 * t[1][2] / t[1][1]}%`,
      objectFit: "contain", maxWidth: "none",
    } : { objectFit: (media.fit || "contain") as CSSProperties["objectFit"] },
  });
  const narrow = narrowMedia ? getImageProps({ src: narrowMedia.src, alt: alt ?? narrowMedia.alt,
    width: narrowMedia.width || (dimensions as Record<string, number[]>)[narrowMedia.src]?.[0] || 1440,
    height: narrowMedia.height || (dimensions as Record<string, number[]>)[narrowMedia.src]?.[1] || 900,
    sizes, quality: 90,
  }).props : null;
  const image = narrow ? <picture className="pf-responsive-picture" style={{ "--narrow-position": narrowPosition } as CSSProperties}>
    <source media={`(max-width: ${narrowBreakpoint}px)`} srcSet={narrow.srcSet} sizes={narrow.sizes} />
    <img {...props} alt={props.alt} draggable={false} />
  </picture> : <img {...props} alt={props.alt} draggable={false} />;
  return <span className={`pf-media-image ${className}`} style={{
    background: media.background || "var(--pf-surface)",
    "--media-frame-ratio": frame[0] / frame[1], "--media-source-ratio": width / height,
  } as CSSProperties}>{cropped ? <span className="pf-media-scene">{image}</span> : image}</span>;
}
