import Image from "next/image";
import type { ReactNode } from "react";
import { BLUR_DATA_URL } from "@/lib/blur";
import { Button } from "@/components/site/button";

/**
 * Wide CTA banner: background art under a gradient scrim, copy on top,
 * one button. The standard shape for outbound calls to action — an
 * affiliate spot, "play this on Meta Quest", "join the Discord" — so
 * they read as one family instead of ad-hoc blocks.
 *
 * The scrim runs from the canvas colour on the text side to transparent,
 * so art stays visible on the far side while the copy keeps contrast.
 * `align="center"` scrims from both edges instead, for symmetric art.
 * `accent` recolours the button for partner marks (Meta blue, Discord
 * blurple); omit it and the site accent is used.
 */
export function Banner({
  image,
  imageAlt = "",
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  accentBg,
  accentFg,
  dotColor,
  icon,
  align = "left",
  priority,
}: {
  /** Small brand dot beside the eyebrow, e.g. Discord blurple. */
  dotColor?: string;
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: ReactNode;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  /** Partner button colour, e.g. "#0064e0". Plain strings, not an
   *  object — MDX silently drops object-literal props. */
  accentBg?: string;
  accentFg?: string;
  icon?: ReactNode;
  align?: "left" | "center";
  priority?: boolean;
}) {
  const scrim =
    align === "center"
      ? "linear-gradient(90deg, var(--pz-canvas) 0%, color-mix(in srgb, var(--pz-canvas) 72%, transparent) 30%, color-mix(in srgb, var(--pz-canvas) 72%, transparent) 70%, var(--pz-canvas) 100%)"
      : "linear-gradient(90deg, var(--pz-canvas) 8%, color-mix(in srgb, var(--pz-canvas) 82%, transparent) 46%, color-mix(in srgb, var(--pz-canvas) 20%, transparent) 78%, transparent 100%)";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-pz-border bg-pz-surface">
      {/* Art fills the banner and is cropped to it. It sits above the
          card background (a negative z-index would drop it behind the
          parent's own fill and render nothing) and below the scrim. */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(min-width: 1200px) 1160px, 100vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        priority={priority}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: scrim }}
      />

      <div
        className={`relative z-[2] flex flex-wrap items-center gap-x-8 gap-y-5 px-[clamp(20px,4vw,40px)] py-[clamp(24px,4vw,36px)] ${
          align === "center" ? "justify-center text-center" : ""
        }`}
      >
        <div
          className={`min-w-[min(100%,260px)] flex-1 ${
            align === "center" ? "max-w-[52ch] flex-none" : ""
          }`}
        >
          {eyebrow && (
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-pz-accent">
              {/* Brand dot: names the partner without colouring the whole
                  button, so the single-accent rule survives. */}
              {dotColor && (
                <span
                  aria-hidden
                  className="h-[7px] w-[7px] flex-none rounded-full"
                  style={{ backgroundColor: dotColor }}
                />
              )}
              {eyebrow}
            </div>
          )}
          <h3 className="pz-wordmark text-[clamp(19px,2.4vw,26px)] font-extrabold leading-[1.15] tracking-[-0.026em] text-pz-ink">
            {title}
          </h3>
          {body && (
            <p className="mt-2 max-w-[46ch] text-[15px] leading-[1.6] text-pz-ink2">
              {body}
            </p>
          )}
        </div>

        <Button
          href={ctaHref}
          size="lg"
          accentBg={accentBg}
          accentFg={accentFg}
          icon={icon}
          className="flex-none"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
