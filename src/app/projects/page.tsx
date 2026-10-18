import { MediaImage } from "@/components/portfolio/media-image";
import { Icon } from "@/components/portfolio/controls";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { featuredStudies } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  alternates: { canonical: "/projects" },
};
export default function Projects() {

  return (
    <>
      <SiteNav />
      <main className="pf-page" id="main-content">
        <header className="pf-container pf-page-heading">
          <h1>Projects</h1>
        </header>
        <section className="pf-container pf-section pf-project-grid">
          {featuredStudies.map((p) => (
            <article className="pf-project-card" key={p.slug}>
              <Link href={`/projects/${p.slug}`}>
                <MediaImage media={p.hero[0]} alt="" sizes="(max-width: 800px) calc(100vw - 48px), 530px" />
                <h2>{p.title}</h2>
              </Link>
              <p>{p.description}</p>
              {p.sections.length === 0 && <span className="pf-project-status">Project overview</span>}
              <Link className="pf-button" href={`/projects/${p.slug}`} aria-label={`${p.sections.length === 0 ? "View overview of" : "Read more about"} ${p.title}`}>
                <Icon name="imgIconArrow" />
                {p.sections.length === 0 ? "View overview" : "Read more"}
              </Link>
            </article>
          ))}
        </section>
        <section className="pf-container pf-section"><Link className="pf-button" href="/sidequests"><Icon name="imgIconArrow" />Explore sidequests</Link></section>
      </main>
      <SiteFooter />
    </>
  );
}
