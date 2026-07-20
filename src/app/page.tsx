import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/home/hero";
import { SelectedWork } from "@/components/home/selected-work";
import { About } from "@/components/home/about";
import { Experience } from "@/components/home/experience";
import { Recommendations } from "@/components/home/recommendations";
import { Contact } from "@/components/home/contact";

/**
 * Home (Kerberus v2) — a single self-contained page: hero → selected work
 * (quick-view sheets) → about → experience → recommendations → contact.
 * The theme FAB is global (root layout).
 */
export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteNav />
      <main id="main-content">
        <Hero />
        <SelectedWork />
        <About />
        <Experience />
        <Recommendations />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
