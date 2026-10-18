import "./media-treatment.css";
import Link from "next/link";
import { featuredStudies } from "@/lib/portfolio";
import type { CSSProperties } from "react";
import { FigmaShade, bannerShade, heroShade } from "./media-shade";
import { MediaImage } from "./media-image";
import type {
  BannerData,
  CaseStudy,
  ExperienceData,
  Media,
} from "@/lib/portfolio";
import { AmbientVideo, Icon } from "./controls";
import { Carousel } from "./carousel";
import { LockedPreview } from "./locked-preview";
import { SectionIndex } from "./section-index";

export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\n+/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="pf-prose">
            {p}
          </p>
        ))}
    </>
  );
}
export function Hero({
  title,
  description,
  images,
  video,
}: {
  title: string;
  description?: string;
  images: Media[];
  video?: string;
}) {
  return (
    <header className="pf-hero" data-video={video ? "" : undefined} style={{ "--hero-art-ratio": images[0]?.width && images[0]?.height ? images[0].width / images[0].height : 16 / 9 } as CSSProperties}>
      <div className="pf-hero-art">
      {images[0] &&
        (video ? (
          <AmbientVideo
            className="pf-hero-video"
            src={video}
            poster={images[0].src}
            alt={`${title} reel`}
            fit={images[0].fit}
            background={images[0].background}
            posterMedia={images[0]}
          />
        ) : (
          <MediaImage className="pf-hero-image" media={images[0]} alt="" priority />
        ))}
      <FigmaShade className="pf-hero-shade" {...heroShade(images[0]?.sourceHash, title)} />
      {images.slice(1).map((media, i) => media.crop ? (
        <MediaImage key={i} className="pf-hero-layer" media={{ ...media, background: "transparent" }} alt="" priority />
      ) : <img key={i} className="pf-hero-logo" src={media.src} alt="" />)}
      {images.slice(1).map((media, i) => <img key={i} className="pf-hero-mobile-logo" src={media.src} alt="" />)}
      </div>
      <div className="pf-container pf-hero-copy">
        <h1>{title}</h1>
        {description && <p>{title === "Percy" && description.includes("Get in touch") ? <>{description.split("Get in touch")[0]}<Link href="/contact">Get in touch<Icon name="imgIconArrow" /></Link>{description.split("Get in touch")[1]}</> : description}</p>}
      </div>
    </header>
  );
}
export function Skills({ tags }: { tags: string[] }) {
  return (
    <ul className="pf-skills">
      {tags.map((s, i) => (
        <li key={`${s}-${i}`}>{s}</li>
      ))}
    </ul>
  );
}
export function Experience({ rows }: { rows: ExperienceData[] }) {
  return (
    <div className="pf-experience">
      {rows.map((r, i) => (
        <article key={i} className="pf-role">
          {r.logo && (
            <img src={r.logo} alt="" width={44} height={44} loading="lazy" />
          )}
          <div>
            <h3>{r.role}</h3>
            <p className="pf-company">{r.company}</p>
            {r.body && <p>{r.body}</p>}
          </div>
          <p className="pf-period">{r.period}</p>
        </article>
      ))}
    </div>
  );
}
export function Banners({ items }: { items: BannerData[] }) {
  if (!items.length) return null;
  return (
    <section className="pf-container pf-banners">
      {items.map((b, i) => (
        <article className="pf-banner" key={i}>
          {b.images.map((media, layer) => (
            <MediaImage key={`${media.src}-${layer}`} className={`pf-banner-bg ${layer > 0 && b.images.length === 2 ? "pf-banner-foreground" : ""}`}
              media={{ ...media, background: layer ? "transparent" : media.background }} alt="" />
          ))}
          <FigmaShade className="pf-banner-shade" {...bannerShade(b.images[0]?.sourceHash)} />
          <div className="pf-banner-copy">
            {b.images.length === 2 && <img className="pf-banner-mobile-logo" src={b.images[1].src} alt="" loading="lazy" />}
            {b.logo && (
              <img
                className="pf-banner-logo"
                src={b.logo}
                alt=""
                loading="lazy"
              />
            )}
            {b.title && <h3>{b.title}</h3>}
            {b.body && <p>{b.body}</p>}
          </div>
          {b.href && (
            <a className="pf-button" href={b.href}>
              <Icon name="imgIconArrow" />
              {b.label || "View project"}
            </a>
          )}
        </article>
      ))}
    </section>
  );
}
export function CaseStudyBody({ project: p }: { project: CaseStudy }) {
  const next = featuredStudies[(featuredStudies.findIndex(item => item.slug === p.slug) + 1) % featuredStudies.length];
  const contents = p.sections.map((section, i) => ({ title: section.title, id: `project-section-${i}` })).filter(item => item.title.trim());
  const locked = p.status === "coming-soon";
  const gallery = p.gallery.length > 0 && (
    <section className="pf-section" id="project-gallery" data-full-bleed>
      <div className="pf-container">
        <h2>Gallery</h2>
      </div>
      <Carousel
        items={p.gallery}
        initial={p.initialSlide}
        label={`${p.title} gallery`}
      />
    </section>
  );
  const overview = (
    <section className="pf-container pf-section pf-overview">
      <div className="pf-overview-top">
        <div>
          {p.description && (
            <div className="pf-description">
              <Paragraphs text={p.description} />
            </div>
          )}
          <h2>Contributions</h2>
          <ul className="pf-contributions">
            {p.contributions.map((c, i) => (
              <li key={i}><span aria-hidden="true">✦</span><span>{c.replace(/^[•·✦]\s*/, "")}</span></li>
            ))}
          </ul>
        </div>
        <dl className="pf-facts">
          {p.facts.map((f, i) => (
            <div key={i}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="pf-skill-section"><h2>Skills</h2><Skills tags={p.skills} /></div>
    </section>
  );
  if (locked) {
    return (
      <>
        <Hero title={p.title} images={p.hero} video={p.video} />
        {overview}
        <LockedPreview title={p.title} teaser={gallery || undefined}
          primary={next ? { href: `/projects/${next.slug}`, label: `Next project: ${next.title}` } : { href: "/#work", label: "All projects" }}
          secondary={{ href: "/#work", label: "All projects" }} />
      </>
    );
  }
  return (
    <>
      <Hero title={p.title} images={p.hero} video={p.video} />
      {overview}
      {contents.length >= 3 && <SectionIndex items={[...(p.gallery.length > 0 ? [{ id: "project-gallery", title: "Gallery" }] : []), ...contents]} />}
      {gallery}
      {p.sections.map((s, i) =>
        s.type === "feature" ? (
          <section
            key={i}
            id={`project-section-${i}`}
            className={`pf-section pf-feature ${s.mediaFirst ? "pf-quiet" : ""}`}
          >
            <div
              className={`pf-container pf-feature-row ${s.mediaFirst ? "pf-media-first" : ""} ${s.media.length === 0 ? "pf-feature-text-only" : ""}`}
            >
              <div className="pf-feature-copy">
                {s.title.trim() && <h2>{s.title}</h2>}
                {s.body.includes("\n") ? (
                  <ul className="pf-feature-list">
                    {s.body.split(/\n+/).map(line => line.trim()).filter(Boolean).map((line, index) => (
                      <li key={index}><span aria-hidden="true">✦</span><span>{line.replace(/^[•·✦]\s*/, "")}</span></li>
                    ))}
                  </ul>
                ) : <Paragraphs text={s.body} />}
              </div>
              {s.media.length > 0 && <Carousel items={s.media} compact label={s.title || `${p.title} detail`} />}
            </div>
          </section>
        ) : (
          <section key={i} id={`project-section-${i}`} className="pf-container pf-section">
            {s.title.trim() && <h2>{s.title}</h2>}
            <div
              className={`pf-outcomes ${s.title === "Word from Highstreet" ? "pf-letter" : ""}`}
            >
              {s.cards.map((c, j) => (
                <article key={j}>
                  {c.title.startsWith(String.fromCharCode(34)) ? (
                    <>
                      <blockquote>
                        <Paragraphs text={c.title} />
                      </blockquote>
                      <p>{c.body}</p>
                    </>
                  ) : (
                    <>
                      <h3>{c.title}</h3>
                      <Paragraphs text={c.body} />
                    </>
                  )}
                </article>
              ))}
            </div>
          </section>
        ),
      )}
      <Banners items={p.banners} />
      <nav className="pf-container pf-section pf-project-navigation" aria-label="Project navigation"><Link className="pf-outline" href="/#work">All projects</Link>{next && <Link className="pf-button" href={`/projects/${next.slug}`}>Next project: {next.title}</Link>}</nav>
    </>
  );
}
