import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/home/hero";
import { SelectedWork } from "@/components/home/selected-work";
import { About } from "@/components/home/about";
import { Experience } from "@/components/home/experience";
import { Recommendations } from "@/components/home/recommendations";
import { Contact } from "@/components/home/contact";
import { EndBanners } from "@/components/home/end-banners";
import { Reveal } from "@/components/site/scroll-reveal";

/**
 * Home (Kerberus v2) — a single self-contained page: hero → selected work
 * (cards link to case studies) → about → experience → recommendations → contact.
 * The theme FAB is global (root layout).
 */
export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteNav />
      <main id="main-content">
        <Hero />
        <Reveal>
          <SelectedWork />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <Recommendations />
        </Reveal>
        <Reveal>
          <EndBanners />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
