import Link from "next/link";
import { getWorkCards } from "@/lib/content";
import { WorkCards } from "@/components/site/work-cards";

/**
 * Home "Selected work" — a seamless-looping carousel of project cards
 * (~3 shown, larger than the mobile rail), each linking to its case
 * study, with "All work" / "See all work" links to the full grid.
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
          Selected work
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
      <div className="mt-9 flex justify-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-lg border border-pz-border2 px-[22px] py-[11px] text-sm font-semibold text-pz-ink2 transition-colors hover:border-pz-accent hover:text-pz-accent"
        >
          See all work <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
