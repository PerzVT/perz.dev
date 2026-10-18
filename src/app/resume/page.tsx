import { PrintButton } from "@/components/portfolio/print-button";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import {
  Experience,
  Paragraphs,
  Skills,
} from "@/components/portfolio/sections";
import { portfolio } from "@/lib/portfolio";
export const metadata: Metadata = {
  title: "Résumé",
  alternates: { canonical: "/resume" },
};
export default function Resume() {
  const r = portfolio.resume;
  const [intro, ...highlightBlocks] = r.summary;
  const highlights = highlightBlocks
    .flatMap(block => block.split("\n"))
    .map(line => line.replace(/^[✦•·]\s*/, "").replace(/[·\s]+$/, ""))
    .filter(Boolean);
  const [philosophyLead, ...philosophy] = r.philosophy.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  // A skill listed at two levels shows once, at the higher one.
  const seen = new Set<string>();
  const levels = r.skills.map(group => ({
    title: group.title,
    tags: group.tags.map(tag => tag.trim()).filter(tag => {
      const key = tag.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  }));
  return (
    <>
      <SiteNav />
      <main className="pf-page pf-resume-page" id="main-content">
        <header className="pf-container pf-resume-intro">
          <div>
            <h1>{r.title}</h1>
            <p className="pf-resume-subtitle">{r.subtitle}</p>
            <p className="pf-resume-print-contact">hello@perz.dev · perz.dev</p>
            <Paragraphs text={intro} />
            {highlights.length > 0 && <ul className="pf-feature-list pf-resume-highlights">
              {highlights.map(line => <li key={line}><span aria-hidden="true">✦</span><span>{line}</span></li>)}
            </ul>}
            <div className="pf-actions"><PrintButton /></div>
          </div>
          <img
            className="pf-about-photo"
            src={r.image}
            alt="Percy presenting at a games event"
          />
        </header>
        {philosophyLead && <section className="pf-section pf-quiet pf-resume-philosophy">
          <div className="pf-container">
            <h2>Design philosophy</h2>
            <p className="pf-resume-lead">{philosophyLead}</p>
            {philosophy.map(text => <p key={text.slice(0, 32)}>{text}</p>)}
          </div>
        </section>}
        <section className="pf-container pf-section">
          <h2>Experience</h2>
          <Experience rows={r.experience} />
        </section>
        <section className="pf-container pf-section">
          <h2>Skills</h2>
          <div className="pf-proficiency">{levels.map((level, i) => <section className="pf-proficiency-level" key={level.title}>
            <h3><span className="pf-meter" aria-hidden="true">{levels.map((_, dot) => <i key={dot} data-on={dot < levels.length - i} />)}</span>{level.title}</h3>
            <Skills tags={level.tags} />
          </section>)}</div>
        </section>
        <section className="pf-container pf-section">
          <h2>Education</h2>
          <Experience rows={r.education} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
