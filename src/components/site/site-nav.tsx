"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { AudioToggle, ThemeToggle, Icon } from "@/components/portfolio/controls";

/** Sidequest detail pages live under /projects/, so only the page that renders
 *  one can say which nav link is current. */
export function SiteNav({ section }: { section?: "sidequests" }) {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const trigger = useRef<HTMLButtonElement>(null);
  const sidequests = section === "sidequests" || pathname === "/sidequests";
  const links = [
    { href: "/", label: "Home", current: pathname === "/" },
    { href: "/projects", label: "Projects", current: pathname.startsWith("/projects") && !sidequests },
    { href: "/sidequests", label: "Sidequests", current: sidequests },
    { href: "/resume", label: "Résumé", current: pathname.startsWith("/resume") },
    { href: "/contact", label: "Contact", current: pathname === "/contact" },
  ];
  return <header className="pf-header"><nav className="pf-container pf-nav" aria-label="Main navigation" onKeyDown={event => {
    if (event.key === "Escape" && menuOpen) { setMenuPath(null); trigger.current?.focus(); }
  }}>
    <Link className="pf-brand" href="/" aria-label="Percy, home"><img className="pf-avatar" src="/shared/branding/imgPercyAvatarSvg.svg" alt="" width={40} height={40} /><span className="pf-open">open to work</span></Link>
    <div className="pf-nav-links pf-desktop-links">{links.map(link => <Link key={link.href} href={link.href} className={link.href === "/contact" ? "pf-outline" : undefined} aria-current={link.current ? "page" : undefined} onClick={() => setMenuPath(null)}>{link.href === "/contact" && <Icon name="imgIconArrow" />}{link.label}</Link>)}</div>
    <div className="pf-nav-controls"><AudioToggle /><ThemeToggle />
      <button ref={trigger} className="pf-outline pf-menu-toggle" aria-expanded={menuOpen} aria-controls="portfolio-navigation" onClick={() => setMenuPath(menuOpen ? null : pathname)}>{menuOpen ? "Close" : "Menu"}</button>
    </div>
    <div className="pf-nav-links pf-mobile-links" id="portfolio-navigation" data-open={menuOpen}>{links.map(link => <Link key={link.href} href={link.href} className={link.href === "/contact" ? "pf-outline" : undefined} aria-current={link.current ? "page" : undefined} onClick={() => setMenuPath(null)}>{link.href === "/contact" && <Icon name="imgIconArrow" />}{link.label}</Link>)}</div>
  </nav></header>;
}
