import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { featuredStudies } from "@/lib/portfolio";
import { getProjects } from "@/lib/content";
export const metadata: Metadata = {
  title: "Work",
  alternates: { canonical: "/projects" },
};
export default function Projects() {
  const personal = getProjects().filter(
    (p) => !featuredStudies.some((c) => c.slug === p.slug),
  );
  return (
    <>
      <SiteNav />
      <main className="pf-page" id="main-content">
        <header className="pf-container pf-page-heading">
          <h1>Work</h1>
        </header>
        <section className="pf-container pf-section pf-project-grid">
          {featuredStudies.map((p) => (
            <article className="pf-project-card" key={p.slug}>
              <Link href={`/projects/${p.slug}`}>
                <img src={p.hero[0].src} alt={p.title} loading="lazy" />
                <h2>{p.title}</h2>
              </Link>
              <p>{p.description}</p>
              <Link className="pf-button" href={`/projects/${p.slug}`}>
                Read More
              </Link>
            </article>
          ))}
        </section>
        <section className="pf-container pf-section" id="sidequests">
          <h2>Sidequests</h2>
          <div className="pf-project-grid">
            {personal.map((p) => (
              <article className="pf-project-card" key={p.slug}>
                {p.frontmatter.image && (
                  <img
                    src={p.frontmatter.image}
                    alt={p.frontmatter.title}
                    loading="lazy"
                  />
                )}
                <h3>{p.frontmatter.title}</h3>
                <p>{p.frontmatter.description}</p>
                {!p.frontmatter.mediaOnly && (
                  <Link href={`/projects/${p.slug}`}>Read More</Link>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
