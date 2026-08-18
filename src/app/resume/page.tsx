import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { SkillsBars } from "@/components/resume/skills-bars";
import { getWork, type WorkEntry } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Résumé",
  description: siteConfig.positioning,
  alternates: { canonical: "/resume" },
};

function statusTag(w: WorkEntry): { label: string; accent: boolean } | null {
  if (w.current) return { label: "Current", accent: true };
  if (w.employment?.toLowerCase().includes("contract"))
    return { label: "Contract", accent: false };
  return null;
}

// Illustrative skeleton widths for the per-role blurbs (owner supplies).
const BLURB_W = ["72%", "62%", "56%", "68%", "46%", "58%"];

const ROW =
  "grid grid-cols-[minmax(130px,165px)_1fr_auto] items-start gap-4 border-b border-pz-border py-3.5";

/**
 * Résumé (Kerberus v2). Scannable one-pager: summary + credibility,
 * experience (real roles, skeleton per-role blurbs), education (skeleton
 * until supplied), and animated skill bars. No engine-credential card.
 * The PDF is owner-supplied — the button stays disabled until one lands.
 */
export default function ResumePage() {
  const roles = getWork();

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[860px] px-[clamp(20px,4vw,32px)] pb-[clamp(64px,10vh,96px)] pt-[clamp(44px,7vh,72px)]">
        {/* Header */}
        <div className="flex flex-wrap items-start gap-6 [animation:perzRise_.5s_var(--ease-out)_.05s_both]">
          <div className="flex-1 basis-[360px]">
            <h1 className="text-[clamp(28px,3.6vw,38px)] font-bold tracking-[-0.018em] text-pz-ink">
              Résumé
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3.5">
              <span className="text-[15px] font-semibold text-pz-ink">Perz</span>
              <span className="flex flex-col gap-1">
                <span
                  className="pz-skeleton h-[13px] w-[170px]"
                  aria-label="Full name pending"
                />
                <span className="text-[10.5px] text-pz-faint">
                  full name — owner supplies
                </span>
              </span>
              <span className="text-[13.5px] text-pz-muted">
                Game designer — UX &amp; player-focused systems
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button
              type="button"
              disabled
              title="Owner supplies the PDF"
              className="cursor-not-allowed rounded-lg border-none bg-pz-accent px-5 py-[11px] text-sm font-semibold text-[var(--pz-on-accent)] opacity-70"
            >
              Download PDF
            </button>
            <span className="text-[11px] text-pz-faint">PDF — owner supplies</span>
          </div>
        </div>

        {/* Summary */}
        <p className="mt-[26px] max-w-[66ch] text-[15px] leading-[1.75] text-pz-ink2 [animation:perzRise_.5s_var(--ease-out)_.12s_both]">
          {siteConfig.about}
        </p>

        {/* Credibility line (verbatim from comp) */}
        <div className="mt-[22px] text-[13px] leading-[1.9] text-pz-muted [animation:perzRise_.5s_var(--ease-out)_.16s_both]">
          Six shipped titles across PC and VR · Founded Draconia — a 400,000+
          player gaming service · Kerberus, independent studio
        </div>

        {/* Experience */}
        <section className="mt-11">
          <h2 className="text-base font-bold tracking-[-0.005em] text-pz-ink">
            Experience
          </h2>
          <div className="mt-2.5 border-t border-pz-border">
            {roles.map((w, i) => {
              const tag = statusTag(w);
              return (
                <div key={`${w.company}-${w.startDate ?? i}`} className={ROW}>
                  <span className="text-[12.5px] text-pz-faint">{w.range}</span>
                  <span className="flex flex-col gap-[7px]">
                    <span className="text-[14.5px]">
                      <span className="font-bold text-pz-ink">{w.title}</span>
                      <span className="text-pz-muted"> · {w.company}</span>
                    </span>
                    <span
                      className="pz-skeleton h-[9px]"
                      style={{ width: BLURB_W[i] ?? "60%" }}
                      aria-label="Role blurb pending"
                    />
                  </span>
                  <span
                    className={`pt-0.5 text-xs font-semibold ${
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

        {/* Education */}
        <section className="mt-10">
          <h2 className="text-base font-bold tracking-[-0.005em] text-pz-ink">
            Education
          </h2>
          <div className="mt-2.5 border-t border-pz-border">
            {[0, 1].map((i) => (
              <div key={i} className={ROW}>
                <span className="flex items-center">
                  <span
                    className="pz-skeleton h-[9px]"
                    style={{ width: i === 0 ? "112px" : "96px" }}
                    aria-label="Dates pending"
                  />
                </span>
                <span className="flex flex-col gap-[7px]">
                  <span
                    className="pz-skeleton h-[11px]"
                    style={{ width: i === 0 ? "58%" : "46%" }}
                    aria-label="Degree and school pending"
                  />
                  <span
                    className="pz-skeleton h-[9px]"
                    style={{ width: i === 0 ? "36%" : "30%" }}
                  />
                </span>
                <span className="pt-0.5 text-[11px] text-pz-faint">
                  {i === 0 ? "owner supplies" : ""}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mt-10">
          <h2 className="text-base font-bold tracking-[-0.005em] text-pz-ink">
            Skills
          </h2>
          <div className="mt-2">
            <SkillsBars />
          </div>
          <div className="mt-4 text-[13px] leading-[2] text-pz-muted">
            Photoshop · Illustrator · Blender · Godot · Notion · Miro · Jira ·
            Python · TypeScript
          </div>
          <div className="mt-1.5 text-[11px] text-pz-faint">
            Bar levels illustrative — owner tunes
          </div>
        </section>

        {/* Footer links */}
        <div className="mt-11 flex flex-wrap gap-5 border-t border-pz-border pt-4 text-[13px]">
          <a
            href="/"
            className="text-pz-ink2 transition-colors hover:text-pz-ink"
          >
            {siteConfig.name}.dev
          </a>
          <a
            href={siteConfig.links.email}
            className="text-pz-ink2 transition-colors hover:text-pz-ink"
          >
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pz-ink2 transition-colors hover:text-pz-ink"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pz-ink2 transition-colors hover:text-pz-ink"
          >
            LinkedIn
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
