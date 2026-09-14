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
                <img
                  src={p.hero[0].src}
                  alt={p.title}
                  loading="lazy"
                  style={{
                    objectFit:
                      p.hero[0].fit === "contain" ? "contain" : "cover",
                    background: p.hero[0].background,
                  }}
                />
                <h2>{p.title}</h2>
              </Link>
              <p>{p.description}</p>
              <Link className="pf-button" href={`/projects/${p.slug}`}>
                <Icon name="imgIconArrow" />
                Read More
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
