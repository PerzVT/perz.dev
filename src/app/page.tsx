import { Recommendations } from "@/components/portfolio/recommendations";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import {
  Banners,
  Experience,
  Hero,
  Paragraphs,
} from "@/components/portfolio/sections";
import { FeaturedCarousel } from "@/components/portfolio/featured-carousel";
import { portfolio } from "@/lib/portfolio";
import { featuredProjects } from "@/lib/featured-layout";
import type { Metadata } from "next";

// Carried here rather than on the root layout, where it would also label the
// 404 and error pages as the homepage.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const h = portfolio.home;
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pf-page pf-home">
        <Hero title={h.title} images={h.hero} description={h.intro} action={{ href: "/contact", label: "Get in touch" }} />
        <section className="pf-section" id="work">
          <div className="pf-container">
            <h2>Featured work</h2>
          </div>
          <FeaturedCarousel projects={featuredProjects} />
        </section>
        <section className="pf-section pf-about">
          <div className="pf-container pf-about-grid">
            <div>
              <h2>{h.about.title}</h2>
              <Paragraphs text={h.about.body} />
            </div>
            <img
              className="pf-about-photo"
              src={h.about.image}
              alt="Percy at a games event booth"
              loading="lazy"
            />
          </div>
        </section>
        <section className="pf-container pf-section">
          <h2>Experience</h2>
          <Experience rows={h.experience} />
        </section>
        <Recommendations />
        <Banners items={h.banners} />
      </main>
      <SiteFooter />
    </>
  );
}
