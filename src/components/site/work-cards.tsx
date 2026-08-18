import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { WorkCard } from "@/lib/content";
import { Rail } from "@/components/site/rail";

/**
 * Project cards. Two layouts: a draggable single-row "rail" (home, hints
 * at the full set) and a full "grid" (the work page). Each card links
 * straight to its case study at /projects/<slug>. Covers are 16:9 on disk
 * and object-cover into the 2:3 frame (owner's choice); a per-card
 * frontmatter `cardFocus` can retarget the crop.
 */
export function WorkCards({
  cards,
  layout = "grid",
}: {
  cards: WorkCard[];
  layout?: "grid" | "rail";
}) {
  const rail = layout === "rail";

  const cardEls = cards.map((card, i) => (
    <Link
      key={card.slug}
      href={card.caseHref}
      aria-label={`${card.title} — case study`}
      className={`group/card flex flex-col gap-3 text-left transition-transform duration-200 ease-out hover:-translate-y-[3px] focus-visible:-translate-y-[3px] ${
        rail ? "w-[min(82vw,340px)] flex-none snap-start" : ""
      }`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] border border-pz-border bg-pz-surface">
        {card.image && (
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes={rail ? "340px" : "(min-width: 1160px) 270px, (min-width: 640px) 45vw, 100vw"}
            priority={i === 0}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
            style={{ objectPosition: card.cardFocus ?? "center" }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-[7px]">
        <span className="text-base font-bold tracking-[-0.01em] text-pz-ink">
          {card.title}
        </span>
        <span className="text-[13px] leading-[1.6] text-pz-ink2">
          {card.tagline}
        </span>
        <span className="mt-auto inline-flex items-baseline gap-2 self-start pt-[5px] text-[13px] font-semibold text-pz-accent">
          <span className="decoration-[1.5px] underline-offset-4 transition-all group-hover/card:underline group-focus-visible/card:underline">
            Read more
          </span>
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover/card:translate-x-1 group-focus-visible/card:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  ));

  return rail ? (
    <Rail ariaLabel="Projects">{cardEls}</Rail>
  ) : (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-x-5 gap-y-10">
      {cardEls}
    </div>
  );
}
