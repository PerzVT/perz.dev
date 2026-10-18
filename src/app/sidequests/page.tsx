import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { SidequestCards } from "@/components/portfolio/sidequests";
export const metadata: Metadata = { title: "Sidequests", alternates: { canonical: "/sidequests" } };
export default function Sidequests() {
  return <><SiteNav /><main className="pf-page" id="main-content">
    <header className="pf-container sq-intro"><h1>Sidequests</h1>
      <p>Just funny little things I make on the side. The crackhead energy pent up in me makes me go on sidequests which eats up all my personal time.</p>
      <details className="sq-intro-more"><summary>More about my sidequests</summary>
      <p>I end up making tools or solutions to problems which I encounter with the hopes of never having to deal with it again. which never works.</p>
      <p>I also have a lot of game ideas which I will make some day. If you would like to make any together, reach out! I love to collaborate.</p></details>
    </header>
    <section className="pf-container" aria-label="Sidequest collection"><SidequestCards /></section>
    <section className="sq-learning"><div className="pf-container"><h2>My learning corner</h2><p>Resource recommendations are coming soon.</p></div></section>
  </main><SiteFooter /></>;
}
