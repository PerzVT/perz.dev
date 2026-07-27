import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { WorkCards } from "@/components/site/work-cards";
import { getWorkCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "My work",
  description:
    "Shipped titles, jam builds, and the design work underneath them.",
  alternates: { canonical: "/projects" },
};

/**
 * "My work" (Kerberus v2) — a single dense grid of the full project set
 * (games + design), each card linking to its case study. Titus-style
 * intent; the comp ships a uniform grid, which is what's rendered here.
 */
export default function WorkPage() {
  const cards = getWorkCards();

  return (
    <>
      <SiteNav />
      <main id="main-content">
        {/* Same shape as the home sections: display heading with the
            width axis doing the shouting, a lead line, then a hairline
            carrying the count before the grid. */}
        <header className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(48px,8vh,80px)]">
          <h1 className="pz-wordmark text-[clamp(34px,4.4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.017em] text-pz-ink [animation:perzRise_.5s_var(--ease-out)_.05s_both]">
            My work
          </h1>
          <p className="mt-3.5 max-w-[56ch] text-[20px] leading-[1.6] text-pz-ink2 [animation:perzRise_.5s_var(--ease-out)_.12s_both]">
            My latest adventure has been working with the talented team at
            Highstreet. I still make modded content on the side and enter
            game-jams to keep things exciting!
          </p>
        </header>
        <div className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pb-[clamp(64px,9vh,96px)] pt-[clamp(28px,4vh,44px)]">
          <WorkCards cards={cards} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
