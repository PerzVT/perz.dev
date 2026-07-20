import { getWork, type WorkEntry } from "@/lib/content";

/**
 * Home "Experience" — the six real roles as an editorial list (date ·
 * role · company · status), newest-first from content/work/*.json. No
 * logos (the comp drops them, which also sidesteps the missing Knite
 * mark). Status is derived from the data, not hand-tagged.
 */
function statusTag(w: WorkEntry): { label: string; accent: boolean } | null {
  if (w.current) return { label: "Current", accent: true };
  if (w.employment?.toLowerCase().includes("contract"))
    return { label: "Contract", accent: false };
  return null;
}

export function Experience() {
  const roles = getWork();

  return (
    <section
      id="experience"
      className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vh,88px)]"
    >
      <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pz-ink">
        Experience
      </h2>
      <div className="mt-3.5 border-t border-pz-border">
        {roles.map((w) => {
          const tag = statusTag(w);
          return (
            <div
              key={`${w.company}-${w.startDate ?? w.range}`}
              className="grid grid-cols-[minmax(140px,180px)_1fr_auto] items-baseline gap-[18px] border-b border-pz-border px-0.5 py-[15px]"
            >
              <span className="text-[12.5px] text-pz-faint">{w.range}</span>
              <span className="text-[15px]">
                <span className="font-bold text-pz-ink">{w.title}</span>
                <span className="text-pz-muted"> · {w.company}</span>
              </span>
              <span
                className={`text-xs font-semibold ${
                  tag?.accent ? "text-pz-accent" : "text-pz-faint"
                }`}
              >
                {tag?.label ?? ""}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
