"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LazyVideo } from "@/components/lazy-video";

/**
 * Media gallery reel — a scroll-snap row of 16:9 gameplay captures with
 * prev/next controls and progress dots. Lead a case study with it to show
 * the game in motion. `srcs` is a comma-separated list of image/video
 * paths; videos render as posters that play on click.
 */
export function MediaReel({
  srcs,
  title = "A look inside the game.",
}: {
  srcs: string;
  title?: string;
}) {
  const items = srcs
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const slideW = () => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first ? first.getBoundingClientRect().width + 14 : 0;
  };
  const go = useCallback((i: number) => {
    const el = ref.current;
    const w = slideW();
    if (el && w) el.scrollTo({ left: i * w, behavior: "smooth" });
  }, []);
  const step = (dir: number) => {
    const el = ref.current;
    const w = slideW();
    if (!el || !w) return;
    const n = items.length;
    const next = (Math.round(el.scrollLeft / w) + dir + n) % n;
    el.scrollTo({ left: next * w, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = ref.current;
    const w = slideW();
    if (!el || !w) return;
    const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / w)));
    if (i !== active) setActive(i);
  };

  if (items.length === 0) return null;
  const isVideo = (s: string) => /\.(mp4|webm|mov)$/i.test(s);

  return (
    <section id="media" className="scroll-mt-[84px]">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3.5">
        <div className="mr-auto">
          <div className="text-[12px] font-semibold text-pz-accent">
            Media gallery
          </div>
          <h2 className="mt-2 text-[22px] font-bold tracking-[-0.022em] text-pz-ink">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous media"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-pz-border2 bg-pz-raised text-pz-ink2 transition-colors hover:border-pz-muted hover:text-pz-ink"
          >
            <ChevronLeft className="h-[15px] w-[15px]" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next media"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-pz-border2 bg-pz-raised text-pz-ink2 transition-colors hover:border-pz-muted hover:text-pz-ink"
          >
            <ChevronRight className="h-[15px] w-[15px]" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        onScroll={onScroll}
        className="-mx-1 mt-[18px] flex gap-[14px] overflow-x-auto px-1 pb-1.5 [scrollbar-width:none] [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[16/9] flex-[0_0_min(880px,85%)] snap-start overflow-hidden rounded-xl border border-pz-border bg-pz-surface"
          >
            {isVideo(src) ? (
              <LazyVideo
                src={src}
                className="absolute inset-0 block h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to media ${i + 1}`}
            className="h-1 rounded-[2px] transition-all"
            style={{
              width: i === active ? "22px" : "8px",
              background: i === active ? "var(--pz-accent)" : "var(--pz-border2)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
