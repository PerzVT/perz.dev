"use client";

import { useState } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { WorkCard } from "@/lib/content";
import { QuickViewSheet } from "@/components/site/quick-view-sheet";

/**
 * Shared 2:3 "capsule" card grid + quick-view sheet. The home passes its
 * six games; the work page passes the full set. Cards open the sheet
 * rather than navigating, so the home stays a single page and deep case
 * studies keep their own routes. Covers are 16:9 on disk and object-cover
 * into the 2:3 frame (owner's choice — tight crop until portrait capsule
 * art exists; a per-card frontmatter `cardFocus` can retarget the crop).
 */
export function WorkCards({ cards }: { cards: WorkCard[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-x-5 gap-y-10">
        {cards.map((card, i) => (
          <button
            key={card.slug}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`${card.title} — quick view`}
            aria-haspopup="dialog"
            className="group flex flex-col gap-3 text-left transition-transform duration-200 ease-out hover:-translate-y-[3px] focus-visible:-translate-y-[3px]"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] border border-pz-border bg-pz-surface">
              {card.image && (
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(min-width: 1160px) 270px, (min-width: 640px) 45vw, 100vw"
                  priority={i === 0}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                  style={{ objectPosition: card.cardFocus ?? "center" }}
                />
              )}
            </div>
            <div className="flex flex-col gap-[7px]">
              <span className="text-base font-bold tracking-[-0.01em] text-pz-ink">
                {card.title}
              </span>
              <span className="text-[13px] leading-[1.6] text-pz-ink2">
                {card.tagline}
              </span>
              <span
                className="mt-[3px] inline-flex items-center gap-[7px] self-start rounded-full px-[13px] py-[6px] text-[12.5px] font-semibold text-pz-accent transition-colors"
                style={{
                  border:
                    "1px solid color-mix(in srgb, var(--pz-accent) 40%, transparent)",
                  background:
                    "color-mix(in srgb, var(--pz-accent) 8%, transparent)",
                }}
              >
                Read more <span aria-hidden>→</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <QuickViewSheet
        card={openIndex === null ? null : cards[openIndex]}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
