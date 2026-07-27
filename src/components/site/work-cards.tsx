import Link from "next/link";
import type { WorkCard } from "@/lib/content";
import { CardMedia } from "@/components/site/card-media";

/**
 * The project grid on /projects. Each card is a ringed panel holding its
 * 2:3 cover, and the whole card is the link to the case study.
 *
 * The old "rail" layout is gone — the home page runs the spotlight
 * carousel now, and this was its only other caller.
 */
export function WorkCards({ cards }: { cards: WorkCard[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-5">
      {cards.map((card, i) => (
        <Link
          key={card.slug}
          href={card.caseHref}
          aria-label={`${card.title} — case study`}
          className="pz-panel pz-lift group/card flex flex-col gap-3.5 rounded-[var(--r-panel)] p-3 text-left"
        >
          <CardMedia
            image={card.image}
            hoverVideo={card.hoverVideo}
            alt={card.title}
            cardFocus={card.cardFocus}
            priority={i === 0}
            sizes="(min-width: 1160px) 260px, (min-width: 640px) 45vw, 100vw"
          />
          <div className="flex flex-1 flex-col gap-2 px-1 pb-1">
            <span className="text-[17px] font-bold leading-[1.3] tracking-[-0.011em] text-pz-ink">
              {card.title}
            </span>
            <span className="text-[14.5px] leading-[1.6] text-pz-ink2">
              {card.tagline}
            </span>
            {/* A tag, not a button: the whole card is already the link,
                and an anchor inside an anchor is invalid. */}
            <span className="mt-auto inline-flex items-center self-start rounded-[var(--r-tag)] px-2.5 py-1.5 text-[13.5px] font-semibold text-pz-muted shadow-[var(--pz-ring-strong)] transition-colors group-hover/card:text-pz-ink">
              Read more
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
