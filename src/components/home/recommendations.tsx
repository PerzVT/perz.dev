import Image from "next/image";
import { getRecommendations } from "@/lib/content";
import { Rail } from "@/components/site/rail";
import { siteConfig } from "@/lib/config";
import { SectionHeading } from "@/components/site/section-heading";

/**
 * Recommendations — an auto-rotating rail of every LinkedIn recommendation,
 * three featured first. It pauses on hover, and the hovered card brightens
 * so the quote is easier to read. Avatars are initial badges for now; swap
 * for real photos when they're supplied (LinkedIn can't be fetched).
 */
/** LinkedIn mark. Inlined because lucide dropped its brand icons, and
 *  pulling a whole icon pack for one glyph isn't worth the weight. */
function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

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
      <div className="flex items-center gap-3">
        <SectionHeading>Recommendations</SectionHeading>
        <a
          href={siteConfig.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="See these on LinkedIn"
          title="See these on LinkedIn"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-pz-muted transition-colors hover:bg-pz-raised hover:text-pz-accent"
        >
          <LinkedInMark className="h-[15px] w-[15px]" />
        </a>
      </div>

      <div className="mt-7">
        <Rail ariaLabel="Recommendations" autoAdvanceMs={4800}>
          {recs.map((r) => (
            <figure
              key={r.name}
              // Wider cards so a trimmed quote doesn't run to five short
              // lines, and the whole card answers the pointer.
              className="pz-panel pz-lift group/card flex min-h-[210px] w-[min(88vw,460px)] flex-none snap-start flex-col gap-4 rounded-[var(--r-panel)] p-6"
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
                  <span className="block text-[13px] leading-[1.45] text-pz-faint">
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
