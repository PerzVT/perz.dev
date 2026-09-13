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
  return (
    <>
      <SiteNav />
      <main className="pf-page" id="main-content">
        <header className="pf-container pf-page-heading">
          <h1>{r.title}</h1>
          <p>{r.subtitle}</p>
        </header>
        <section className="pf-container pf-section pf-resume-summary">
          <div>
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
        <section className="pf-container pf-section">
          <h2>Design philosophy</h2>
          <Paragraphs text={r.philosophy} />
        </section>
        <section className="pf-container pf-section">
          <h2>Experience</h2>
          <Experience rows={r.experience} />
        </section>
        <section className="pf-container pf-section">
          <h2>Skills</h2>
          <div className="pf-resume-skills">
            {r.skills.map((g) => (
              <div key={g.title}>
                <h3>{g.title}</h3>
                <Skills tags={g.tags} />
              </div>
            ))}
          </div>
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
