import { ArtworkLink } from "./media-viewer";
import { LockedPreview } from "./locked-preview";
import { MediaImage } from "./media-image";
import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects, resolveImg } from "@/lib/content";
import { caseStudies } from "@/lib/portfolio";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero, Skills } from "./sections";
import { Icon, SectionVideo } from "./controls";
import "./sidequests.css";

// These supplied files are plain color placeholders, not project artwork.
const pendingArtwork = new Set(["kerberus-pack-manager", "slime-dragon"]);
const heroDimensions: Record<string, {width: number; height: number}> = {
  "kerberus-modded-suite": {width:2400,height:3600},
  "highstreet-echoes-of-solera": {width:2400,height:3600},
};
export function sidequestProjects() {
  return getProjects().filter(p => !caseStudies.some(c => c.slug === p.slug));
}
function Art({ src, title }: { src: string; title: string }) {
  if (/\.(mp4|webm)$/i.test(src)) return <SectionVideo src={src} alt={title} />;
  return <ArtworkLink media={{src, alt: title, fit: "contain"}} />;
}
export function SidequestCards() {
  const projects = sidequestProjects();
  const dragoncraft = getProjects().find(p => p.slug === "dragoncraft");
  const collection = (dragoncraft ? [...projects, dragoncraft] : projects).sort((a, b) => Number(pendingArtwork.has(a.slug)) - Number(pendingArtwork.has(b.slug)));
  return <div className="pf-project-grid sq-collection">{collection.map(p => {
    const src = pendingArtwork.has(p.slug) ? null : caseStudies.find(c => c.slug === p.slug)?.hero[0]?.src ?? resolveImg(p.slug, p.frontmatter.image);
    return <article className="pf-project-card" key={p.slug}>
      {src && <Link href={`/projects/${p.slug}`} tabIndex={-1} aria-hidden="true">{heroDimensions[p.slug] && <img className="sq-poster-backdrop" src={src} alt="" loading="lazy" />}<MediaImage media={{src, alt: "", fit: heroDimensions[p.slug] ? "contain" : "cover"}} className={`sq-card-art ${heroDimensions[p.slug] ? "sq-card-poster" : ""}`} sizes="(max-width: 800px) calc(100vw - 48px), 530px" /></Link>}
      <h2>{p.frontmatter.title}</h2>
      <p>{caseStudies.find(c => c.slug === p.slug)?.description || p.frontmatter.description}</p>
      {p.frontmatter.status === "coming-soon" && <span className="pf-project-status">Coming soon</span>}
      <Link className="pf-button" href={`/projects/${p.slug}`} aria-label={`${p.frontmatter.mediaOnly ? "View artwork for" : p.frontmatter.status === "coming-soon" ? "Preview" : "Read more about"} ${p.frontmatter.title}`}><Icon name="imgIconArrow" />{p.frontmatter.mediaOnly ? "View artwork" : p.frontmatter.status === "coming-soon" ? "View preview" : "Read more"}</Link>
    </article>;
  })}</div>;
}
function Highlight({ title, body, image, flip }: { title: string; body: string; image?: string; flip?: boolean }) {
  return <section className={`sq-detail-section ${flip ? "pf-quiet" : ""}`}><div className={`pf-container ${image ? "sq-paired" : "sq-reading"}`}><div><h2>{title}</h2><p>{body}</p></div>{image && <Art src={image} title={title} />}</div></section>;
}
function Columns({ children }: { children: ReactNode }) { return <section className="pf-container sq-columns">{children}</section>; }
function Column({ title, body, image }: { title: string; body: string; image?: string }) { return <article className="pf-project-card">{image && <Art src={image} title={title} />}<h3>{title}</h3><p>{body}</p></article>; }
function Outcome({ title, children }: { title: string; children: ReactNode }) { return <section className="pf-container sq-detail-section sq-outcome"><h2>{title}</h2>{children}</section>; }
function OutcomePoints({ children }: { children: ReactNode }) { return <ul className="sq-outcome-points">{children}</ul>; }
function OutcomePoint({ children }: { children: ReactNode }) { return <li><span aria-hidden="true">✦</span><div>{children}</div></li>; }
const components = { Highlight, Columns, Column, Outcome, OutcomePoints, OutcomePoint };

export default async function SidequestDetail({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.frontmatter.draft) notFound();
  const { frontmatter: f, content } = project;
  const art = pendingArtwork.has(slug) ? null : resolveImg(slug, f.hero ?? f.image);
  const facts = [
    ["Role", f.roles?.join(" · ")], ["Team", f.employment],
    ["Development", f.engine], ["Period", f.duration ?? String(f.year)],
    ["Platform", f.platform], ["Status", f.status === "coming-soon" ? "Coming soon" : undefined],
  ].filter((row): row is [string,string] => Boolean(row[1]));
  return <><SiteNav section="sidequests" /><main id="main-content" className={`pf-page sq-page ${f.mediaOnly ? "sq-media-only" : !art ? "sq-text-only" : ""}`}>
    {art && !f.mediaOnly ? <Hero title={f.title} description={f.description} images={[{src:art,alt:f.title,fit:"contain",...heroDimensions[slug]}]} /> : <header className="pf-container pf-page-heading sq-intro"><h1>{f.title}</h1><p>{f.description}</p></header>}
    {f.mediaOnly && art && <section className="pf-container pf-section"><Art src={art} title={f.title} /></section>}
    <section className="pf-container pf-section"><div className={`pf-overview-top ${f.mediaOnly ? "sq-art-facts" : ""}`}><div>
      {f.contributions?.length ? <><h2>Contributions</h2><ul className="pf-feature-list">{f.contributions.map(c => <li key={c}><span aria-hidden="true">✦</span><span>{c}</span></li>)}</ul></> : null}

      {f.url && <a href={f.url} className="pf-button"><Icon name="imgIconArrow" />View project</a>}
    </div><dl className="pf-facts">{facts.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>{f.skills?.length ? <div className="pf-skill-section"><h2>Skills</h2><Skills tags={f.skills} /></div> : null}</section>
    {f.status === "coming-soon"
      ? <LockedPreview title={f.title} teaser={content.trim() ? <MDXRemote source={content} components={components} /> : undefined}
          primary={{ href: "/sidequests", label: "All sidequests" }} secondary={{ href: "/projects", label: "Projects" }} />
      : <>
        {content.trim() && <MDXRemote source={content} components={components} />}
        <nav className="pf-container pf-section" aria-label="Sidequest navigation"><Link className="pf-outline" href="/sidequests">All sidequests</Link></nav>
      </>}
  </main><SiteFooter /></>;
}




