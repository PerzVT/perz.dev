import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { UptimePanel, showResumeStats } from "@/components/portfolio/resume-stats";

// Sample data until real figures replace it, so the page stays out of search.
export const metadata: Metadata = { title: "Service status", robots: { index: false, follow: true } };

export default function Page() {
  if (!showResumeStats) notFound();
  return <>
    <SiteNav />
    <main className="pf-page pf-tracker-page" id="main-content">
      <header className="pf-container pf-page-heading"><h1>Service status</h1><p>Uptime for the services I host, over the last 90 days.</p></header>
      <section className="pf-container pf-section"><UptimePanel /></section>
      <nav className="pf-container pf-section" aria-label="Tracker navigation"><Link className="pf-outline" href="/resume">Back to résumé</Link></nav>
    </main>
    <SiteFooter />
  </>;
}
