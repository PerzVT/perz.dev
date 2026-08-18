import Image from "next/image";
import { getRecommendations } from "@/lib/content";
import { Rail } from "@/components/site/rail";
import { siteConfig } from "@/lib/config";

/**
 * Recommendations — an auto-rotating rail of every LinkedIn recommendation,
 * three featured first. It pauses on hover, and the hovered card brightens
 * so the quote is easier to read. Avatars are initial badges for now; swap
 * for real photos when they're supplied (LinkedIn can't be fetched).
 */
function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

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
        <a
          href={siteConfig.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12.5px] text-pz-faint underline-offset-2 transition-colors hover:text-pz-accent hover:underline"
        >
          from LinkedIn <span aria-hidden>↗</span>
        </a>
      </div>

      <div className="mt-7">
        <Rail ariaLabel="Recommendations" autoAdvanceMs={4800}>
          {recs.map((r) => (
            <figure
              key={r.name}
              className="group/card flex min-h-[210px] w-[min(84vw,340px)] flex-none snap-start flex-col gap-4 rounded-xl border border-pz-border bg-pz-raised p-6 transition-colors hover:border-pz-border2 hover:bg-pz-surface"
            >
              <blockquote className="text-[14px] leading-[1.7] text-pz-ink2 transition-colors group-hover/card:text-pz-ink">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span className="h-10 w-10 flex-none overflow-hidden rounded-full bg-pz-surface">
                  {r.avatar ? (
                    <Image
                      src={r.avatar}
                      alt={r.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-full w-full items-center justify-center text-[13px] font-bold text-pz-accent"
                    >
                      {initials(r.name)}
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-semibold text-pz-ink">
                    {r.name}
                  </span>
                  <span className="block text-[12px] text-pz-faint">
                    {r.title}
                    {r.company ? ` · ${r.company}` : ""}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Rail>
      </div>
    </section>
  );
}
