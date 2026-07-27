import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/site/button";
import { getWork } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Résumé",
  description: siteConfig.positioning,
  alternates: { canonical: "/resume" },
};

interface Skill {
  name: string;
  context?: string;
}
interface SkillsFile {
  headline: Skill[];
  secondary: { name: string }[];
}

function getSkills(): SkillsFile | null {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "content", "skills.json"),
      "utf-8",
    );
    return JSON.parse(raw) as SkillsFile;
  } catch {
    return null;
  }
}

/** The PDF is owner-supplied. Render the button only once the file is
 *  actually there — a disabled button that apologises for itself is
 *  worse than no button. Drop resume.pdf in public/ and it appears. */
function pdfHref(): string | null {
  const rel = "/resume.pdf";
  return fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"))
    ? rel
    : null;
}

const ROW =
  "pz-hover -mx-3 grid grid-cols-1 gap-x-5 gap-y-1.5 rounded-[var(--r-card)] px-3 py-4 shadow-[inset_0_-1px_0_var(--pz-border-soft)] sm:grid-cols-[minmax(140px,170px)_1fr]";

/**
 * Résumé — a scannable one-pager built only from real content: the
 * summary, the design philosophy, the six roles with their actual
 * descriptions, and the skills from content/skills.json.
 *
 * Deliberately no skeleton rows. The previous version shipped six
 * placeholder bars, an empty Education section and "owner supplies"
 * labels, all of which a hiring lead would have seen. A shorter résumé
 * that is entirely true beats a longer one full of blanks: Education
 * returns when there's something to put in it.
 */
export default function ResumePage() {
  const roles = getWork();
  const skills = getSkills();
  const pdf = pdfHref();

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pb-[clamp(64px,10vh,96px)] pt-[clamp(44px,7vh,72px)]">
        <div className="flex flex-wrap items-start justify-between gap-6 [animation:perzRise_.5s_var(--ease-out)_.05s_both]">
          <div className="flex-1 basis-[360px]">
            <h1 className="pz-wordmark text-[clamp(34px,4.4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.017em] text-pz-ink">
              Résumé
            </h1>
            <p className="mt-2.5 text-[14.5px] text-pz-faint">
              Game designer, user experience and player-focused systems
            </p>
          </div>
          {pdf && (
            <Button href={pdf} size="lg" external={false}>
              Download PDF
            </Button>
          )}
        </div>

        <p className="mt-[26px] max-w-[56ch] text-[20px] leading-[1.6] text-pz-ink2 [animation:perzRise_.5s_var(--ease-out)_.12s_both]">
          {siteConfig.about}
        </p>

        <div className="mt-[22px] text-[14.5px] leading-[1.8] text-pz-faint [animation:perzRise_.5s_var(--ease-out)_.16s_both]">
          Shipped on Meta Quest and itch.io · Founded Draconia, a gaming service
          with 400,000+ players · Kerberus, independent studio
        </div>

        <section className="mt-11">
          <h2 className="text-[26px] font-extrabold leading-[1.3] tracking-[-0.012em] text-pz-ink [font-stretch:122%]">
            Design philosophy
          </h2>
          <p className="mt-2.5 max-w-[66ch] text-[15px] leading-[1.8] text-pz-ink2">
            {siteConfig.philosophy}
          </p>
        </section>

        <section className="mt-11">
          <h2 className="text-[26px] font-extrabold leading-[1.3] tracking-[-0.012em] text-pz-ink [font-stretch:122%]">
            Experience
          </h2>
          <div className="mt-3 border-t border-pz-border">
            {roles.map((w, i) => (
              <div key={`${w.company}-${w.startDate ?? i}`} className={ROW}>
                <span className="flex items-baseline gap-2.5">
                  <span className="text-[12.5px] tabular-nums text-pz-muted">
                    {w.range.replace(/\s*—\s*/g, " – ")}
                  </span>
                  {w.current && (
                    <span className="text-[12px] font-semibold text-pz-accent">
                      Current
                    </span>
                  )}
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-[15px]">
                    <span className="font-bold text-pz-ink">{w.title}</span>
                    <span className="text-pz-muted"> · {w.company}</span>
                  </span>
                  {w.description && (
                    <span className="max-w-[62ch] text-[14px] leading-[1.7] text-pz-ink2">
                      {w.description.replace(/\s*—\s*/g, ", ")}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        {skills && (
          <section id="skills" className="mt-11">
            <h2 className="text-[26px] font-extrabold leading-[1.3] tracking-[-0.012em] text-pz-ink [font-stretch:122%]">
              Skills
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
              {skills.headline.map((s) => (
                <div key={s.name}>
                  <h3 className="text-[18px] font-bold tracking-[-0.011em] text-pz-ink">
                    {s.name}
                  </h3>
                  {s.context && (
                    <p className="mt-1.5 text-[14.5px] leading-[1.65] text-pz-ink2">
                      {s.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-2 pt-5 shadow-[inset_0_1px_0_var(--pz-border-soft)]">
              {skills.secondary.map((s) => (
                <span
                  key={s.name}
                  className="rounded-[var(--r-tag)] px-2.5 py-1.5 text-[13.5px] text-pz-muted shadow-[var(--pz-ring-strong)]"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="mt-11 flex flex-wrap gap-5 pt-5 text-[14.5px] shadow-[inset_0_1px_0_var(--pz-border-soft)]">
          <Link
            href="/"
            className="text-pz-ink2 transition-colors hover:text-pz-ink"
          >
            {siteConfig.name}.dev
          </Link>
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
