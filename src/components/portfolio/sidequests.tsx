import { ArtworkLink } from "./media-viewer";
import { LockedPreview } from "./locked-preview";
import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, resolveImg } from "@/lib/content";
import { pendingArtwork, sidequestProjects } from "@/lib/sidequests";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero, Skills } from "./sections";
import { Icon, SectionVideo } from "./controls";
import "./sidequests.css";

const heroDimensions: Record<string, {width: number; height: number}> = {
  "kerberus-modded-suite": {width:2400,height:3600},
  "highstreet-echoes-of-solera": {width:2400,height:3600},
};

function Art({ src, title }: { src: string; title: string }) {
  if (/\.(mp4|webm)$/i.test(src)) return <SectionVideo src={src} alt={title} />;
  return <ArtworkLink media={{src, alt: title, fit: "contain"}} />;
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
  const others = sidequestProjects().filter(p => !p.frontmatter.link);
  const nextQuest = others[(others.findIndex(p => p.slug === slug) + 1) % others.length];
  const next = nextQuest && nextQuest.slug !== slug ? { href: `/projects/${nextQuest.slug}`, label: `Next sidequest: ${nextQuest.frontmatter.title}` } : { href: "/#work", label: "Featured work" };
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
          primary={next} secondary={{ href: "/#work", label: "Featured work" }} />
      : <>
        {content.trim() && <MDXRemote source={content} components={components} />}
        <nav className="pf-container pf-section pf-project-navigation" aria-label="Sidequest navigation"><Link className="pf-outline" href="/#work">Featured work</Link><Link className="pf-button" href={next.href}>{next.label}</Link></nav>
      </>}
  </main><SiteFooter /></>;
}




