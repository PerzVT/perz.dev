import Link from "next/link";
import { getWorkCards } from "@/lib/content";
import { WorkCards } from "@/components/site/work-cards";

/**
 * Home "Featured work" — a draggable rail of the project cards, each
 * linking to its case study. "All work →" leads to the full My work grid.
 */
export function SelectedWork() {
  const cards = getWorkCards();

  return (
    <section
      id="work"
      className="mx-auto max-w-[1160px] scroll-mt-20 px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vh,88px)]"
    >
      <div className="flex items-baseline gap-3.5">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pz-ink">
          Featured work
        </h2>
        <Link
          href="/projects"
          className="ml-auto inline-flex items-center gap-[7px] rounded-lg border border-pz-border2 px-3.5 py-2 text-[13px] font-semibold text-pz-ink2 transition-colors hover:border-pz-accent hover:text-pz-accent"
        >
          All work <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="mt-7">
        <WorkCards cards={cards} layout="rail" />
      </div>
    </section>
  );
}
