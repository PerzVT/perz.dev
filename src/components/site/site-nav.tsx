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
  const projectSlug = pathname.startsWith("/projects/") ? pathname.split("/")[2] : null;
  const caseStudySlugs = ["highstreet-calamity-vr", "supercat", "bubble-buddy", "lurk", "poly-punch-vr", "stick-it", "bisecthosting", "dragoncraft", "mythcraft"];
  const sidequests = pathname === "/sidequests" || (!!projectSlug && !caseStudySlugs.includes(projectSlug));
  return (
    <header className="pf-header">
      <nav className="pf-container pf-nav" aria-label="Main navigation">
        <Link className="pf-brand" href="/" aria-label="Percy, home">
          <img
            className="pf-avatar"
            src="/shared/branding/imgPercyAvatarSvg.svg"
            alt=""
            width={40}
            height={40}
          />
          <span className="pf-open">open to work</span>
        </Link>
        <div className="pf-nav-links">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/projects"
            aria-current={
              pathname.startsWith("/projects") && !sidequests
                ? "page"
                : undefined
            }
          >
            Projects
          </Link>
          <Link
            href="/sidequests"
            aria-current={
              sidequests ? "page" : undefined
            }
          >
            Sidequests
          </Link>
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
