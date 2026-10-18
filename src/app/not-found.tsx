import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };
export default function NotFound() {
  return <><SiteNav /><main id="main-content" className="pf-page pf-container pf-section pf-not-found">
    <p>404</p><h1>This page doesn&apos;t exist.</h1><p>The link may be out of date, or the page may have moved.</p>
    <div className="pf-actions"><Link className="pf-button" href="/">Home</Link><Link className="pf-button pf-secondary" href="/projects">Projects</Link></div>
  </main><SiteFooter /></>;
}
