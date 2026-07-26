import { getWorkCards } from "@/lib/content";
import { WorkCards } from "@/components/site/work-cards";
import { Button } from "@/components/site/button";
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
      <div className="flex items-center justify-between gap-4">
        <SectionHeading>Featured work</SectionHeading>
        <Button
          href="/projects"
          variant="secondary"
          className="flex-none border border-pz-border2"
        >
          All work
        </Button>
      </div>
      <div className="mt-7">
        <WorkCards cards={cards} layout="rail" />
      </div>
    </section>
  );
}
