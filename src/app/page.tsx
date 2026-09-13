import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import {
  Banners,
  Experience,
  Hero,
  Paragraphs,
} from "@/components/portfolio/sections";
import { Carousel } from "@/components/portfolio/carousel";
import { featuredStudies, portfolio } from "@/lib/portfolio";

export default function Home() {
  const h = portfolio.home;
  const slides = featuredStudies.map((p) => ({
    ...p.hero[0],
    title: p.title,
    description:
      p.slug === "highstreet-calamity-vr"
        ? "Multiplayer VR roguelike"
        : p.facts.find((f) => f.label === "Development")?.value,
    href: `/projects/${p.slug}`,
    external: p.url,
    externalLabel:
      p.slug === "highstreet-calamity-vr" ? "Meta Quest" : undefined,
  }));
  const centered = [...slides.slice(5), ...slides.slice(0, 5)];
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pf-page pf-home">
        <Hero
          title={h.title}
          images={h.hero}
          description={h.intro}
          video={h.video}
        />
        <section className="pf-section" id="work">
          <div className="pf-container">
            <h2>Featured work</h2>
          </div>
          <Carousel items={centered} initial={4} label="Featured work" />
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
        <section className="pf-container pf-section">
          <h2>Recommendations</h2>
          <div className="pf-quotes">
            {h.quotes.map((q) => (
              <article className="pf-quote" key={q.name}>
                <blockquote>{q.quote}</blockquote>
                <div className="pf-quote-author">
                  <img src={q.image} alt="" loading="lazy" />
                  <div>
                    <p>{q.name}</p>
                    <small>{q.role}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <Banners items={h.banners} />
      </main>
      <SiteFooter />
    </>
  );
}
