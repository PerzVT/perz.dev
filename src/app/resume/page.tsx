import { PrintButton } from "@/components/portfolio/print-button";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import {
  Experience,
  Paragraphs,
} from "@/components/portfolio/sections";
import { Icon } from "@/components/portfolio/controls";
import { portfolio } from "@/lib/portfolio";
import { DemoReel } from "@/components/portfolio/demo-reel";
import { ModpackUptime } from "@/components/portfolio/resume-stats";
import modpackStats from "../../../content/portfolio/resume-stats.json";
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
          </div>
          <div className="pf-resume-aside">
            <img
              className="pf-about-photo"
              src={r.image}
              alt="Percy presenting at a games event"
            />
            <div className="pf-actions"><PrintButton /></div>
          </div>
        </header>
        <section className="pf-container pf-resume-reel" aria-labelledby="reel-heading">
          <div className="pf-reel-heading"><h2 id="reel-heading">Demo reel</h2><span className="pf-reel-date">Updated in 2024</span></div>
          <DemoReel src="/resume/demo-reel-2024.mp4" poster={{ src: "/resume/demo-reel-2024-poster.webp", alt: "" }} label="Demo reel, 2024" />
        </section>
        {philosophyLead && <section className="pf-section pf-quiet pf-resume-philosophy">
          <div className="pf-container">
            <h2>Design philosophy</h2>
            <p className="pf-resume-lead">{philosophyLead}</p>
            {philosophy.map(text => <p key={text.slice(0, 32)}>{text}</p>)}
          </div>
        </section>}
        <section className="pf-container pf-section">
          <h2>Experience</h2>
          <Experience rows={r.experience} edit="resume/experience" />
        </section>
        <section className="pf-container pf-section">
          <h2>Skills</h2>
          <div className="pf-proficiency">{levels.map((level, i) => <section className="pf-proficiency-level" key={level.title} aria-label={`${level.title}: ${level.tags.length} skills`}>
            <header>
              <h3>{level.title}</h3>
              <span className="pf-proficiency-count">{level.tags.length} skills</span>
              <span className="pf-level-bar" aria-hidden="true">{levels.map((_, step) => <i key={step} data-on={step < levels.length - i} />)}</span>
            </header>
            <ul className="pf-checklist">{level.tags.map(tag => <li key={tag}><Icon name="imgIconCheck" />{tag}</li>)}</ul>
          </section>)}</div>
        </section>
        <section className="pf-container pf-section">
          <h2>Education</h2>
          <Experience rows={r.education} edit="resume/education" />
        </section>
        {!modpackStats.hidden && <section className="pf-container pf-section pf-trackers" id="modpacks" aria-labelledby="modpacks-heading">
          <h2 id="modpacks-heading">Modpacks</h2>
          <ModpackUptime />
        </section>}
      </main>
      <SiteFooter />
    </>
  );
}
