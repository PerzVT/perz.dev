import Link from "next/link";
import type { WorkCard } from "@/lib/content";
import { CardMedia } from "@/components/site/card-media";
import { Rail } from "@/components/site/rail";

/**
 * Project cards. Two layouts sharing one card: a scrolling "rail" on the
 * home page and the full "grid" on /projects. Each card is a ringed panel
 * holding its 2:3 cover, and the whole card is the link to the case study.
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
          className={`pz-panel pz-lift group/card flex flex-col gap-3.5 rounded-[var(--r-panel)] p-3 text-left ${
            rail ? "w-[min(78vw,290px)] flex-none snap-start" : ""
          }`}
        >
          <CardMedia
            image={card.image}
            hoverVideo={card.hoverVideo}
            alt={card.title}
            cardFocus={card.cardFocus}
            priority={i === 0}
            sizes={
              rail
                ? "290px"
                : "(min-width: 1160px) 260px, (min-width: 640px) 45vw, 100vw"
            }
          />
          <div className="flex flex-1 flex-col gap-2 px-1 pb-1">
            <span className="text-[17px] font-bold leading-[1.3] tracking-[-0.011em] text-pz-ink">
              {card.title}
            </span>
            <span className="text-[14.5px] leading-[1.6] text-pz-ink2">
              {card.tagline}
            </span>
            {/* Carries the primary button's styling but stays a span:
                the whole card is already the link, and an anchor inside
                an anchor is invalid. */}
            <span className="pz-btn pz-btn-primary mt-auto inline-flex items-center self-start px-3.5 py-2 text-[13px] font-semibold text-[var(--pz-on-accent)]">
              Read more
            </span>
          </div>
        </Link>
  ));

  return rail ? (
    <Rail ariaLabel="Projects">{cardEls}</Rail>
  ) : (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-5">
      {cardEls}
    </div>
  );
}
