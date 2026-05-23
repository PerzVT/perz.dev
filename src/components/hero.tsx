"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { StatBlocks, Stat } from "@/components/stat-blocks";
import { BLUR_DATA_URL } from "@/lib/blur";

/**
 * Hero — split layout. Text column on the left, art column on the
 * right. Both columns are vertically centered inside the hero band.
 *
 * The art column shows /hero-art.png by default; hovering "Percy" in
 * the headline swaps it to /percy.jpg (the portrait). State for that
 * swap lives at this level so the headline (left column) can drive
 * the art (right column) without prop drilling through siblings.
 *
 * On narrow screens (< md) the art column hides and the layout
 * collapses to a single centered text stack.
 */
const ART_DEFAULT = "/hero-art.png";
const ART_HOVER = "/percy.jpg";

export function Hero() {
  const [hover, setHover] = useState(false);

  return (
    <section
      id="home"
      className="relative flex min-h-[80dvh] w-full items-center"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 sm:px-10 sm:py-28 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
          <div>
            {/* H1 lifted from text-3xl/4xl to the page's true hero
                scale — was being out-shouted by the Projects H2 below
                the fold. Role line drops .font-display so the global
                heading letter-spacing doesn't fight the explicit
                tracking-[0.14em] on uppercase caps. */}
            <h1 className="font-display text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
              <PercyWord onHoverChange={setHover} />
            </h1>
            <p className="mt-3 font-mono text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground sm:text-sm">
              {siteConfig.title}
            </p>
          </div>

          <div className="flex max-w-xl flex-col gap-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>{siteConfig.description}</p>
            <p>{siteConfig.descriptionExtra}</p>
          </div>

          <StatBlocks>
            <Stat
              number=".gg/draconia"
              label="Discord"
              href={siteConfig.links.discord}
            />
            <Stat
              number="PerzVT"
              label="CurseForge"
              href={siteConfig.links.curseforge}
            />
            <Stat number="5+ yrs" label="design + dev" />
          </StatBlocks>
        </div>

        {/* Art column. Hidden on mobile (md:block). Default art is
            the gamer-room piece; hovering "Percy" in the headline
            swaps to the portrait. No card frame / border — the PNG
            cutout sits on the page so the hero reads as a hero, not
            a thumbnail in a panel.
            next/image with priority on the default art (it's the LCP
            element on the home page) and a sizes hint matching the
            ~50vw column at md+ widths. */}
        <div className="relative hidden aspect-square w-full max-w-md self-center md:block">
          <Image
            src={ART_DEFAULT}
            alt=""
            fill
            sizes="(min-width: 1024px) 448px, 50vw"
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-opacity duration-300 ease-out"
            style={{ opacity: hover ? 0 : 1 }}
          />
          <Image
            src={ART_HOVER}
            alt=""
            fill
            sizes="(min-width: 1024px) 448px, 50vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-opacity duration-300 ease-out"
            style={{ opacity: hover ? 1 : 0 }}
          />
        </div>
      </div>

      {/* Smooth scroll matches the top-nav Projects button, which also
          uses scrollIntoView. Previously the chevron jumped instantly
          (native hash scroll) while the nav animated — inconsistent
          motion across two affordances pointing at the same target. */}
      <button
        type="button"
        onClick={() => {
          document
            .getElementById("projects")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
        aria-label="scroll to projects"
        data-sfx="click"
      >
        <ChevronDown className="scroll-cue h-6 w-6" strokeWidth={1.5} />
      </button>
    </section>
  );
}

/**
 * Headline name. Reads "Percy" by default; swaps to "Shadab" (the
 * real first name behind the handle) when hovered. Same onHoverChange
 * call also drives the right-column art swap.
 *
 * inline-block so the swap from "Percy" (5 chars) to "Shadab" (6
 * chars) doesn't reflow the line. min-w-[3.2ch] reserves room for
 * the longer string.
 */
function PercyWord({
  onHoverChange,
}: {
  onHoverChange: (hover: boolean) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="inline-block min-w-[3.2ch] cursor-default text-foreground"
      onPointerEnter={() => {
        setHover(true);
        onHoverChange(true);
      }}
      onPointerLeave={() => {
        setHover(false);
        onHoverChange(false);
      }}
    >
      {hover ? "Shadab" : "Percy"}
    </span>
  );
}
