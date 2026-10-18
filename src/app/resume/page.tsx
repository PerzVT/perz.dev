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
  const skills = [...new Map(r.skills.flatMap(group => group.tags).map(tag => [tag.toLowerCase(), tag])).values()];
  const groups = [
    { title: "Design and prototyping", match: /design|prototyp|graybox|narrative|script writing|miro|project management|publishing/i },
    { title: "Engineering and engines", match: /unity|unreal|programming|engineering|script|c\+\+|blueprint|architecture|dots|vr\/ar|frontend|optimization|profiling|2d\/3d/i },
    { title: "Art and production", match: /./ },
  ];
  const remaining = new Set(skills);
  const skillGroups = groups.map(group => {
    const tags = [...remaining].filter(tag => group.match.test(tag));
    tags.forEach(tag => remaining.delete(tag));
    return { title: group.title, tags };
  });
  return (
    <>
      <SiteNav />
      <main className="pf-page pf-resume-page" id="main-content">
        <header className="pf-container pf-page-heading pf-resume-intro">
          <h1>{r.title}</h1>
          <p>{r.subtitle}</p>
          <p className="pf-resume-print-contact">hello@perz.dev · perz.dev</p>
          <div className="pf-actions"><PrintButton /></div>
        </header>
        <section className="pf-container pf-section">
          <h2>Experience</h2>
          <Experience rows={r.experience} />
        </section>
        <section className="pf-container pf-section">
          <h2>Skills</h2>
          <div className="pf-resume-skill-groups">{skillGroups.map(group => <section key={group.title}><h3>{group.title}</h3><Skills tags={group.tags} /></section>)}</div>
        </section>
        <section className="pf-container pf-section">
          <h2>Education</h2>
          <Experience rows={r.education} />
        </section>
        <section className="pf-container pf-section pf-resume-summary">
          <div>
            <h2>Background</h2>
            {r.summary.map((p, i) => (
              <Paragraphs text={p} key={i} />
            ))}
          </div>
          <img
            className="pf-about-photo"
            src={r.image}
            alt="Percy presenting at a games event"
          />
        </section>
        <section className="pf-container pf-section pf-resume-philosophy">
          <h2>Design philosophy</h2>
          <Paragraphs text={r.philosophy} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
