"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { AudioToggle, ThemeToggle, Icon } from "@/components/portfolio/controls";

export type NavProject = { slug: string; title: string; image?: string; position?: string; link?: string };
type MenuKey = "projects" | "sidequests";

function ProjectList({ items, pathname, onPick }: { items: NavProject[]; pathname: string; onPick: () => void }) {
  return <ul>{items.map(item => {
    const inner = <>
      {item.image
        ? <Image src={item.image} alt="" width={192} height={108} sizes="96px" style={{ objectPosition: item.position } as CSSProperties} />
        : <span className="pf-menu-thumb" aria-hidden="true" />}
      <span>{item.title}</span>
    </>;
    return <li key={item.slug}>{item.link
      ? <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={onPick}>{inner}</a>
      : <Link href={`/projects/${item.slug}`} aria-current={pathname === `/projects/${item.slug}` ? "page" : undefined} onClick={onPick}>{inner}</Link>}</li>;
  })}</ul>;
}

/** Sidequest detail pages live under /projects/, so only the page that renders
 *  one can say which nav item is current. Without lists (the error page, which
 *  cannot load content) the menus fall back to plain links. */
export function SiteNavClient({ section, projects = [], sidequests = [] }: {
  section?: "sidequests"; projects?: NavProject[]; sidequests?: NavProject[];
}) {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [open, setOpen] = useState<{ key: MenuKey; path: string } | null>(null);
  const menuOpen = menuPath === pathname;
  const openMenu = open?.path === pathname ? open.key : null;
  const trigger = useRef<HTMLButtonElement>(null);
  const buttons: Record<MenuKey, RefObject<HTMLButtonElement | null>> = { projects: useRef(null), sidequests: useRef(null) };
  const onSidequest = section === "sidequests";
  const onCaseStudy = !onSidequest && pathname.startsWith("/projects/");

  useEffect(() => {
    if (!openMenu) return;
    const close = (event: PointerEvent) => {
      if (!(event.target as Element).closest?.(".pf-nav-menu")) setOpen(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [openMenu]);

  const closeAll = () => { setMenuPath(null); setOpen(null); };
  const link = (href: string, label: string, current: boolean) =>
    <Link key={href} href={href} aria-current={current ? "page" : undefined} onClick={closeAll}>{label}</Link>;
  const contact = <Link key="/contact" href="/contact" className="pf-outline" aria-current={pathname === "/contact" ? "page" : undefined} onClick={closeAll}><Icon name="imgIconArrow" />Contact</Link>;
  const menu = (key: MenuKey, label: string, items: NavProject[], current: boolean, fallback: string) => items.length === 0
    ? link(fallback, label, current)
    : <div className="pf-nav-menu" key={key}>
      <button ref={buttons[key]} type="button" className="pf-nav-menu-button" data-current={current} aria-expanded={openMenu === key} aria-controls={`${key}-menu`}
        onClick={() => setOpen(openMenu === key ? null : { key, path: pathname })}>{label}<Icon name="imgIconRight" /></button>
      <div className="pf-projects-menu" id={`${key}-menu`} hidden={openMenu !== key}><ProjectList items={items} pathname={pathname} onPick={closeAll} /></div>
    </div>;

  return <header className="pf-header"><nav className="pf-container pf-nav" aria-label="Main navigation" onKeyDown={event => {
    if (event.key !== "Escape") return;
    if (openMenu) { buttons[openMenu].current?.focus(); setOpen(null); }
    else if (menuOpen) { setMenuPath(null); trigger.current?.focus(); }
  }}>
    <Link className="pf-brand" href="/" aria-label="Percy, home"><img className="pf-avatar" src="/shared/branding/imgPercyAvatarSvg.svg" alt="" width={40} height={40} /><span className="pf-open">open to work</span></Link>
    <div className="pf-nav-links pf-desktop-links">
      {link("/", "Home", pathname === "/")}
      {menu("projects", "Projects", projects, onCaseStudy, "/#work")}
      {menu("sidequests", "Sidequests", sidequests, onSidequest, "/")}
      {link("/resume", "Résumé", pathname.startsWith("/resume"))}
      {contact}
    </div>
    <div className="pf-nav-controls"><AudioToggle /><ThemeToggle />
      <button ref={trigger} className="pf-outline pf-menu-toggle" aria-expanded={menuOpen} aria-controls="portfolio-navigation" onClick={() => setMenuPath(menuOpen ? null : pathname)}>{menuOpen ? "Close" : "Menu"}</button>
    </div>
    <div className="pf-nav-links pf-mobile-links" id="portfolio-navigation" data-open={menuOpen}>
      {link("/", "Home", pathname === "/")}
      {link("/resume", "Résumé", pathname.startsWith("/resume"))}
      {contact}
      {projects.length > 0 && <div className="pf-mobile-projects"><p>Projects</p><ProjectList items={projects} pathname={pathname} onPick={closeAll} /></div>}
      {sidequests.length > 0 && <div className="pf-mobile-projects"><p>Sidequests</p><ProjectList items={sidequests} pathname={pathname} onPick={closeAll} /></div>}
    </div>
  </nav></header>;
}
