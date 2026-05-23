import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * Document section for the home page's content sections.
 *
 * Two-element structure:
 *   outer <section>: full-width band. bg-background covers the
 *     section edge-to-edge so CuttingMatBg doesn't bleed underneath.
 *   inner <div>:    centered column. Width controlled by `width`.
 *
 * Width presets:
 *   "narrow"  (default) max-w-3xl — editorial long-form
 *   "hero"    max-w-6xl — matches the Hero split grid container so
 *             Projects can sit edge-to-edge with the hero's text + art
 *             columns, no width step at the section break
 */
export function DocSection({
  id,
  eyebrow,
  title,
  width = "narrow",
  className = "",
  children,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  width?: "narrow" | "hero";
  className?: string;
  children: ReactNode;
}) {
  const maxW = width === "hero" ? "max-w-6xl" : "max-w-3xl";
  return (
    <section
      id={id}
      className={[
        "relative z-10 bg-background scroll-mt-10",
        className,
      ].join(" ")}
    >
      <div className={`mx-auto ${maxW} px-6 py-20 sm:px-10 sm:py-24`}>
        {(eyebrow || title) && (
          <header className="mb-12">
            {eyebrow && <Eyebrow tone="foreground">{eyebrow}</Eyebrow>}
            {title && (
              <h2 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
