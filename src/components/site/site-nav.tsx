"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioToggle,
  ThemeToggle,
  Icon,
} from "@/components/portfolio/controls";

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="pf-header">
      <nav className="pf-container pf-nav" aria-label="Main navigation">
        <Link className="pf-brand" href="/" aria-label="Percy, home">
          <img
            className="pf-avatar"
            src="/figma/imgPercyAvatarSvg.svg"
            alt=""
            width={40}
            height={40}
          />
          <span className="pf-open">open to work</span>
        </Link>
        <div className="pf-nav-links">
          <Link
            href="/projects"
            aria-current={pathname === "/projects" ? "page" : undefined}
          >
            Projects
          </Link>
          <Link href="/projects#sidequests">Sidequests</Link>
          <Link
            href="/resume"
            aria-current={pathname === "/resume" ? "page" : undefined}
          >
            Résumé
          </Link>
          <Link
            className="pf-outline"
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            <Icon name="imgIconArrow" />
            Contact
          </Link>
        </div>
        <div className="pf-nav-controls">
          <AudioToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
