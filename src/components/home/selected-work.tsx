import { getWorkCards } from "@/lib/content";
import { WorkCards } from "@/components/site/work-cards";
import { Button } from "@/components/site/button";

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
      <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pz-ink">
        Featured work
      </h2>
      <div className="mt-7">
        <WorkCards cards={cards} layout="rail" />
      </div>
      <div className="mt-9 flex justify-center">
        <Button href="/projects" variant="secondary" size="lg" iconAfter={<span aria-hidden>→</span>}>
          All work
        </Button>
      </div>
    </section>
  );
}
