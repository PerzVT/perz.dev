"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { WorkCard } from "@/lib/content";
import { Button } from "@/components/site/button";

/**
 * Featured work as a spotlight: one project centred on an opaque panel,
 * cover on the left and the facts beside it, with the previous and next
 * projects peeking dimmed either side. Clicking a peek brings it in.
 *
 * Replaces the rail of small 2:3 cards, which gave every project the same
 * weight and no room for anything past a one-line tagline.
 *
 * Index wraps in both directions, so the set never dead-ends. Only the
 * centre slide is reachable by keyboard or pointer — the peeks have their
 * interactive children switched off in CSS so a hidden link can't be
 * tabbed into.
 */
export function SpotlightWork({ cards }: { cards: WorkCard[] }) {
  const [active, setActive] = useState(0);
  const n = cards.length;
  if (n === 0) return null;

  const wrap = (i: number) => (i + n) % n;
  const posOf = (i: number) => {
    if (i === active) return "is-center";
    if (i === wrap(active - 1)) return "is-left";
    if (i === wrap(active + 1)) return "is-right";
    return "";
  };

  return (
    <div className="relative">
      <div className="spot-track">
        {cards.map((card, i) => {
          const pos = posOf(i);
          const centre = pos === "is-center";
          return (
            <div
              key={card.slug}
              className={`spot-slide ${pos}`}
              aria-hidden={!centre}
              onClick={() => {
                if (!centre && pos) setActive(i);
              }}
            >
              <div className="spot-in">
                <div className="relative overflow-hidden rounded-[var(--r-media)] bg-pz-raised shadow-[var(--pz-ring)]">
                  {/* Prefer the 16:9 spotlight art. The 2:3 grid cover is
                      the fallback and will crop hard here until wide art
                      exists — `contain` keeps it whole rather than
                      slicing the middle out of a portrait image. */}
                  {(card.wideImage ?? card.image) && (
                    <Image
                      src={(card.wideImage ?? card.image) as string}
                      alt={card.title}
                      fill
                      sizes="(min-width: 900px) 560px, 100vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      priority={i === 0}
                      className={
                        card.wideImage ? "object-cover" : "object-contain"
                      }
                      style={
                        card.wideImage
                          ? { objectPosition: card.cardFocus ?? "center" }
                          : undefined
                      }
                    />
                  )}
                  {card.statusLabel && (
                    <span className="absolute left-3 top-3 rounded-[var(--r-chip)] bg-[rgba(10,10,12,0.72)] px-2.5 py-1 text-[13px] font-semibold text-pz-ink shadow-[var(--pz-ring-strong)]">
                      {card.statusLabel}
                    </span>
                  )}
                </div>

                <div className="spot-side flex min-w-0 flex-col gap-3 py-1.5 pr-2 transition-opacity duration-200">
                  <h3 className="pz-wordmark text-[clamp(20px,2.2vw,26px)] font-extrabold leading-[1.15] tracking-[-0.017em] text-pz-ink">
                    {card.title}
                  </h3>
                  <p className="m-0 text-[15px] leading-[1.6] text-pz-ink2">
                    {card.tagline}
                  </p>

                  {(card.role || card.engine) && (
                    <dl className="m-0 mt-auto flex flex-col">
                      {card.role && (
                        <div className="flex items-baseline justify-between gap-3 py-2 shadow-[inset_0_-1px_0_var(--pz-border-soft)]">
                          <dt className="text-[13.5px] text-pz-faint">Role</dt>
                          <dd className="m-0 text-right text-[13.5px] font-semibold text-pz-ink">
                            {card.role}
                          </dd>
                        </div>
                      )}
                      {card.engine && (
                        <div className="flex items-baseline justify-between gap-3 py-2">
                          <dt className="text-[13.5px] text-pz-faint">
                            Built in
                          </dt>
                          <dd className="m-0 text-right text-[13.5px] font-semibold text-pz-ink">
                            {card.engine}
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}

                  <Button href={card.caseHref} size="sm" className="self-start">
                    Read more
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Previous project"
        onClick={() => setActive(wrap(active - 1))}
        className="absolute left-1 top-1/2 z-[3] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-[var(--r-button)] bg-pz-surface text-pz-muted shadow-[var(--pz-ring-strong)] transition-colors hover:text-pz-ink"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => setActive(wrap(active + 1))}
        className="absolute right-1 top-1/2 z-[3] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-[var(--r-button)] bg-pz-surface text-pz-muted shadow-[var(--pz-ring-strong)] transition-colors hover:text-pz-ink"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-[22px] flex justify-center gap-[7px]">
        {cards.map((card, i) => (
          <button
            key={card.slug}
            type="button"
            aria-label={`Show ${card.title}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={`pz-dot ${i === active ? "is-on" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
