import { getWork, type WorkEntry } from "@/lib/content";
import { SectionHeading } from "@/components/site/section-heading";

/**
 * Home "Experience" — the real roles as an editorial table: date, role, and
 * company each in their own aligned column, newest first. No logos. Status
 * is derived from the data (Current only).
 */
function statusTag(w: WorkEntry): string {
  return w.current ? "Current" : "";
}

/** Range dates without the em dash. */
function range(r: string): string {
  return r.replace(/\s*—\s*/g, " – ");
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
          <div
            key={`${w.company}-${w.startDate ?? w.range}`}
            className="grid grid-cols-[minmax(92px,150px)_minmax(104px,180px)_1fr_auto] items-baseline gap-x-3.5 gap-y-1 border-b border-pz-border px-0.5 py-[15px] sm:gap-x-[18px]"
          >
            <span className="text-[12.5px] text-pz-faint">{range(w.range)}</span>
            <span className="text-[15px] font-bold text-pz-ink">{w.title}</span>
            <span className="text-[15px] text-pz-muted">{w.company}</span>
            <span className="text-xs font-semibold text-pz-accent">
              {statusTag(w)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
