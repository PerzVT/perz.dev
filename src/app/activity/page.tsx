import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ActivityPanel, showResumeStats } from "@/components/portfolio/resume-stats";

// Sample data until real figures replace it, so the page stays out of search.
export const metadata: Metadata = { title: "GitHub activity", robots: { index: false, follow: true } };

export default function Page() {
  if (!showResumeStats) notFound();
  return <>
    <SiteNav />
    <main className="pf-page pf-tracker-page" id="main-content">
      <header className="pf-container pf-page-heading"><h1>GitHub activity</h1><p>Contributions and modpack releases across the last year.</p></header>
      <section className="pf-container pf-section"><ActivityPanel /></section>
      <nav className="pf-container pf-section" aria-label="Tracker navigation"><Link className="pf-outline" href="/resume">Back to résumé</Link></nav>
    </main>
    <SiteFooter />
  </>;
}
