import { getRecommendations } from "@/lib/content";

/**
 * Recommendations — a horizontal scroll of every LinkedIn recommendation,
 * featured three first. Cards peek at the edge to hint the scroll.
 */
export function Recommendations() {
  const recs = getRecommendations();
  if (recs.length === 0) return null;

  return (
    <section
      id="recommendations"
      className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vh,88px)]"
    >
      <div className="flex items-baseline gap-3.5">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pz-ink">
          Recommendations
        </h2>
        <span className="text-[12.5px] text-pz-faint">from LinkedIn</span>
      </div>

      <ul
        aria-label="Recommendations"
        className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-color:var(--pz-border2)_transparent] [scrollbar-width:thin]"
      >
        {recs.map((r) => (
          <li
            key={r.name}
            className="w-[min(84vw,340px)] flex-none snap-start"
          >
            <figure className="flex h-full min-h-[210px] flex-col gap-4 rounded-xl border border-pz-border bg-pz-raised p-6">
              <blockquote className="text-[14px] leading-[1.7] text-pz-ink2">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-auto">
                <div className="text-[13.5px] font-semibold text-pz-ink">
                  {r.name}
                </div>
                <div className="text-[12px] text-pz-faint">{r.title}</div>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
