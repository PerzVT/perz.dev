import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { AccessGate } from "@/components/portfolio/access-gate";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Enter code to view", robots: { index: false, follow: false } };

export default function Access() {
  const length = process.env.ACCESS_CODE?.length || 6;
  return <>
    <SiteNav />
    <main id="main-content" className="pf-page pf-container pf-access">
      <div className="pf-access-card">
        <h1>Enter code to view</h1>
        <p>Hey, thanks for your interest! To get access, reach out to me at <a href={siteConfig.links.email}>{siteConfig.email}</a>.</p>
        <AccessGate length={length} />
      </div>
    </main>
    <SiteFooter />
  </>;
}
