import Image from "next/image";
import { getWork, type WorkEntry } from "@/lib/content";
import { SectionHeading } from "@/components/site/section-heading";

/**
 * Home "Experience" — one row per role: company mark, role and company
 * stacked, and the date range as its own chip on the right. Newest
 * first. `content/work/knite.json` points at a logo that was never added
 * to the repo, so a monogram stands in whenever the file is missing or
 * fails to load.
 */
function range(r: string): string {
  return r.replace(/\s*—\s*/g, " – ");
}

/** Company monogram, used when there's no logo file. */
function Monogram({ company }: { company: string }) {
  const letters = company
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className="flex h-full w-full items-center justify-center text-[13px] font-bold text-pz-muted"
    >
      {letters}
    </span>
  );
}

// Logos referenced in content but not present in public/work.
const MISSING_LOGOS = new Set(["/work/knite.svg"]);

function Row({ w }: { w: WorkEntry }) {
  const logo = w.logo && !MISSING_LOGOS.has(w.logo) ? w.logo : null;

  return (
    // Wraps on narrow screens: at 375px the date block was taking more
    // width than the role and company it sits beside, squeezing them into
    // ~110px and forcing them to wrap. `basis-full` drops the dates onto
    // their own line below, indented to line up under the text.
    // Hover tints the whole row, with the padding pulled out to the
    // gutter so the highlight reads as the row and not a floating box.
    <div className="pz-hover -mx-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--r-card)] px-3 py-4 shadow-[inset_0_-1px_0_var(--pz-border-soft)]">
      <span className="pz-panel flex h-11 w-11 flex-none overflow-hidden rounded-lg border border-pz-border bg-pz-raised">
        {logo ? (
          <Image
            src={logo}
            alt=""
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        ) : (
          <Monogram company={w.company} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold leading-snug text-pz-ink">
          {w.title}
        </span>
        <span className="block text-[13.5px] leading-snug text-pz-muted">
          {w.company}
        </span>
      </span>

      <span className="flex basis-full items-center gap-2 pl-[60px] sm:basis-auto sm:pl-0">
        <span className="pz-panel rounded-lg px-2.5 py-1.5 text-[12px] tabular-nums text-pz-ink2">
          {range(w.range)}
        </span>
      </span>
    </div>
  );
}

export function Experience() {
  const roles = getWork();

  return (
    <section
      id="experience"
      className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vh,88px)]"
    >
      <SectionHeading>Experience</SectionHeading>
      <div className="mt-3.5 border-t border-pz-border">
        {roles.map((w) => (
          <Row key={`${w.company}-${w.startDate ?? w.range}`} w={w} />
        ))}
      </div>
    </section>
  );
}
