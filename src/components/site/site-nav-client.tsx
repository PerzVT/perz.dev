"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AudioToggle, ThemeToggle, Icon } from "@/components/portfolio/controls";

export type NavProject = { slug: string; title: string; image: string; position: string; locked: boolean };

/** Sidequest detail pages live under /projects/, so only the page that renders
 *  one can say which nav link is current. Without `projects` (the error page,
 *  which cannot load content) Projects falls back to a plain link. */
export function SiteNavClient({ section, projects = [] }: { section?: "sidequests"; projects?: NavProject[] }) {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [projectsPath, setProjectsPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const projectsOpen = projectsPath === pathname;
  const trigger = useRef<HTMLButtonElement>(null);
  const projectsButton = useRef<HTMLButtonElement>(null);
  const projectsMenu = useRef<HTMLDivElement>(null);
  const sidequests = section === "sidequests" || pathname === "/sidequests";
  const onCaseStudy = !sidequests && pathname.startsWith("/projects/");

  useEffect(() => {
    if (!projectsOpen) return;
    const close = (event: PointerEvent) => {
      if (!projectsMenu.current?.contains(event.target as Node)) setProjectsPath(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [projectsOpen]);

  const closeAll = () => { setMenuPath(null); setProjectsPath(null); };
  const link = (href: string, label: string, current: boolean) =>
    <Link key={href} href={href} aria-current={current ? "page" : undefined} onClick={closeAll}>{label}</Link>;
  const contact = <Link key="/contact" href="/contact" className="pf-outline" aria-current={pathname === "/contact" ? "page" : undefined} onClick={closeAll}><Icon name="imgIconArrow" />Contact</Link>;
  const projectLinks = projects.map(project => <li key={project.slug}>
    <Link href={`/projects/${project.slug}`} aria-current={pathname === `/projects/${project.slug}` ? "page" : undefined} onClick={closeAll}>
      <Image src={project.image} alt="" width={192} height={108} sizes="96px" style={{ objectPosition: project.position } as CSSProperties} />
      <span>{project.title}{project.locked && <small>Coming soon</small>}</span>
    </Link>
  </li>);

  return <header className="pf-header"><nav className="pf-container pf-nav" aria-label="Main navigation" onKeyDown={event => {
    if (event.key !== "Escape") return;
    if (projectsOpen) { setProjectsPath(null); projectsButton.current?.focus(); }
    else if (menuOpen) { setMenuPath(null); trigger.current?.focus(); }
  }}>
    <Link className="pf-brand" href="/" aria-label="Percy, home"><img className="pf-avatar" src="/shared/branding/imgPercyAvatarSvg.svg" alt="" width={40} height={40} /><span className="pf-open">open to work</span></Link>
    <div className="pf-nav-links pf-desktop-links">
      {link("/", "Home", pathname === "/")}
      {projects.length > 0
        ? <div className="pf-nav-menu" ref={projectsMenu}>
          <button ref={projectsButton} type="button" className="pf-nav-menu-button" data-current={onCaseStudy} aria-expanded={projectsOpen} aria-controls="projects-menu"
            onClick={() => setProjectsPath(projectsOpen ? null : pathname)}>Projects<Icon name="imgIconRight" /></button>
          <div className="pf-projects-menu" id="projects-menu" hidden={!projectsOpen}><ul>{projectLinks}</ul></div>
        </div>
        : link("/#work", "Projects", onCaseStudy)}
      {link("/sidequests", "Sidequests", sidequests)}
      {link("/resume", "Résumé", pathname.startsWith("/resume"))}
      {contact}
    </div>
    <div className="pf-nav-controls"><AudioToggle /><ThemeToggle />
      <button ref={trigger} className="pf-outline pf-menu-toggle" aria-expanded={menuOpen} aria-controls="portfolio-navigation" onClick={() => setMenuPath(menuOpen ? null : pathname)}>{menuOpen ? "Close" : "Menu"}</button>
    </div>
    <div className="pf-nav-links pf-mobile-links" id="portfolio-navigation" data-open={menuOpen}>
      {link("/", "Home", pathname === "/")}
      {link("/sidequests", "Sidequests", sidequests)}
      {link("/resume", "Résumé", pathname.startsWith("/resume"))}
      {contact}
      {projects.length > 0 && <div className="pf-mobile-projects"><p>Projects</p><ul>{projectLinks}</ul></div>}
    </div>
  </nav></header>;
}
