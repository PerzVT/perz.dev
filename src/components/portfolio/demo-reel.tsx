import { getImageProps } from "next/image";
import type { Media } from "@/lib/portfolio";

/** A reel the visitor starts themselves, at its own 16:9 shape, with the
 *  browser's controls so it can go fullscreen. Nothing loads until play. */
export function DemoReel({ src, poster, label }: { src: string; poster: Media; label: string }) {
  const { props } = getImageProps({ src: poster.src, alt: "", width: 960, height: 540, quality: 75 });
  return <video className="pf-reel-video" src={src} poster={props.src} controls playsInline preload="none" aria-label={label} />;
}
