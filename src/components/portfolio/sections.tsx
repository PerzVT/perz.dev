import { MediaImage } from "./media-image";
import type {
  BannerData,
  CaseStudy,
  ExperienceData,
  Media,
} from "@/lib/portfolio";
import { AmbientVideo, Icon } from "./controls";
import { Carousel } from "./carousel";

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
    <header className="pf-hero">
      {images[0] &&
        (video ? (
          <AmbientVideo
            className="pf-hero-video"
            src={video}
            poster={images[0].src}
            alt={`${title} reel`}
            fit={images[0].fit}
            background={images[0].background}
          />
        ) : (
          <img
            className="pf-hero-image"
            src={images[0].src}
            alt=""
            style={{
              objectFit: images[0].fit === "contain" ? "contain" : "cover",
              background: images[0].background,
            }}
            fetchPriority="high"
          />
        ))}
      {images.length > 1 && (
        <img className="pf-hero-logo" src={images[1].src} alt="" />
      )}
      <div className="pf-hero-shade" />
      <div className="pf-container pf-hero-copy">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
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
            <MediaImage key={`${media.src}-${layer}`} className="pf-banner-bg"
              media={{ ...media, background: layer ? "transparent" : media.background }} alt="" />
          ))}
          <div className="pf-banner-copy">
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
  return (
    <>
      <Hero title={p.title} images={p.hero} video={p.video} />
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
                <li key={i}>{c}</li>
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
        <div className="pf-skill-section">
          <h2>Skills</h2>
          <Skills tags={p.skills} />
        </div>
      </section>
      {p.gallery.length > 0 && (
        <section className="pf-section">
          <div className="pf-container">
            <h2>Gallery</h2>
          </div>
          <Carousel
            items={p.gallery}
            initial={p.initialSlide}
            label={`${p.title} gallery`}
          />
        </section>
      )}
      {p.sections.map((s, i) =>
        s.type === "feature" ? (
          <section
            key={i}
            className={`pf-section pf-feature ${s.mediaFirst ? "pf-quiet" : ""}`}
          >
            <div
              className={`pf-container pf-feature-row ${s.mediaFirst ? "pf-media-first" : ""}`}
            >
              <div className="pf-feature-copy">
                <h2>{s.title}</h2>
                <Paragraphs text={s.body} />
              </div>
              <Carousel items={s.media} compact label={s.title} />
            </div>
          </section>
        ) : (
          <section key={i} className="pf-container pf-section">
            <h2>{s.title}</h2>
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
    </>
  );
}
