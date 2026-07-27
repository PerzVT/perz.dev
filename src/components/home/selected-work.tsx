import Link from "next/link";
import { getWorkCards } from "@/lib/content";
import { WorkCards } from "@/components/site/work-cards";
import { SectionHeading } from "@/components/site/section-heading";

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
      {/* Heading row sits on a hairline, with the index as a quiet link
          rather than a second button competing with the slide's CTA. */}
      <div className="flex items-center justify-between gap-4 pb-3.5 shadow-[inset_0_-1px_0_var(--pz-border-soft)]">
        <SectionHeading>Featured work</SectionHeading>
        <Link
          href="/projects"
          className="flex-none text-[15px] font-medium text-pz-muted transition-colors hover:text-pz-ink"
        >
          All work
        </Link>
      </div>
      <div className="mt-7">
        <WorkCards cards={cards} layout="rail" />
      </div>
    </section>
  );
}
