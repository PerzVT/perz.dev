import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { LazyVideo } from "@/components/lazy-video";
import { BLUR_DATA_URL } from "@/lib/blur";
import { getProject, getProjects, type ProjectFrontmatter } from "@/lib/content";
import { mdxComponents } from "@/components/mdx";
import { siteConfig } from "@/lib/config";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  // mediaOnly + draft projects have no detail page.
  return getProjects()
    .filter((p) => !p.frontmatter.mediaOnly)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const { title, description, hero, image } = project.frontmatter;
  const canonical = `/projects/${slug}`;
  const ogImage = hero ?? image;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} · ${siteConfig.role}`,
      description,
      url: canonical,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteConfig.role}`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/** Platform-aware external CTA label. */
function ctaLabel(url: string): string {
  if (/itch\.io/i.test(url)) return "Play on itch.io ↗";
  if (/store\.steampowered\.com|steamcommunity\.com/i.test(url))
    return "View on Steam ↗";
  if (/meta\.com\/(experiences|quest)/i.test(url)) return "View on Meta Quest ↗";
  if (/curseforge\.com/i.test(url)) return "View on CurseForge ↗";
  if (/modrinth\.com/i.test(url)) return "View on Modrinth ↗";
  if (/github\.com/i.test(url)) return "View on GitHub ↗";
  return "View project ↗";
}

/** Structured facts for the scan-layer card, dropping empty rows. */
function facts(fm: ProjectFrontmatter): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  if (fm.roles?.length) rows.push({ label: "Roles", value: fm.roles.join(" · ") });
  if (fm.engine) rows.push({ label: "Developed in", value: fm.engine });
  if (fm.duration) rows.push({ label: "Duration", value: fm.duration });
  if (fm.platform) rows.push({ label: "Platform", value: fm.platform });
  if (fm.release) rows.push({ label: "Release", value: String(fm.release) });
  if (fm.employment) rows.push({ label: "Team", value: fm.employment });
  return rows;
}

/** 16:9 hero — video (poster + play on click) or image, with a badge. */
function Hero({ src, poster }: { src: string; poster?: string }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  return (
    <figure className="m-0 mt-[26px] [animation:perzRise_.6s_var(--ease-out)_.16s_both]">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[14px] border border-pz-border bg-pz-surface">
        {isVideo ? (
          <LazyVideo
            src={src}
            poster={poster}
            className="block h-full w-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 1200px) 1160px, 100vw"
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        )}
        <span className="pointer-events-none absolute left-3.5 top-3.5 rounded-md border border-white/15 bg-black/60 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
          Trailer
        </span>
      </div>
      <figcaption className="mt-2.5 text-[11.5px] text-pz-faint">
        Official trailer — poster, plays on click.
      </figcaption>
    </figure>
  );
}

/**
 * Coming-soon state. Same scan-layer chrome (back link, title, hook,
 * optional external CTA) plus a "Coming soon" pill and a shimmer
 * skeleton where the media and write-up will land. Rendered instead of
 * the full case study when frontmatter sets `status: "coming-soon"`.
 */
function ComingSoonPage({ frontmatter }: { frontmatter: ProjectFrontmatter }) {
  return (
    <>
      <SiteNav />
      <main id="main-content">
        <header className="mx-auto max-w-[1160px] scroll-mt-[84px] px-[clamp(20px,4vw,32px)] pb-[clamp(64px,10vh,96px)] pt-[clamp(36px,6vh,60px)]">
          <Link
            href="/projects"
            className="inline-flex items-center gap-[7px] text-[12.5px] font-semibold text-pz-muted transition-colors hover:text-pz-ink"
          >
            <span aria-hidden>←</span> Work
          </Link>

          <div className="mt-4 flex flex-wrap items-end gap-x-[clamp(24px,4vw,48px)] gap-y-5">
            <div className="min-w-[280px] flex-[1_1_480px]">
              <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-pz-border2 bg-pz-raised px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-pz-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-pz-accent" />
                Coming soon
              </div>
              <h1 className="pz-wordmark text-[clamp(32px,4.6vw,50px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-pz-ink">
                {frontmatter.title}
              </h1>
              <p className="mt-3.5 max-w-[60ch] text-[16.5px] leading-[1.6] text-pz-ink2">
                {frontmatter.description}
              </p>
              <p className="mt-2.5 text-[14px] text-pz-muted">
                This case study is in progress. Check back soon.
              </p>
            </div>
            {frontmatter.url && (
              <a
                href={frontmatter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-pz-accent px-[18px] py-[11px] text-[13.5px] font-bold text-pz-canvas transition hover:brightness-110"
              >
                {ctaLabel(frontmatter.url)}
              </a>
            )}
          </div>

          <div className="mt-[34px] animate-pulse" aria-hidden>
            <div className="aspect-[16/9] w-full rounded-[14px] border border-pz-border bg-pz-surface" />
            <div className="mt-6 flex flex-wrap gap-x-[clamp(32px,5vw,60px)] gap-y-6">
              <div className="min-w-[300px] flex-[1.6_1_420px] space-y-3.5">
                <div className="h-3.5 w-40 rounded bg-pz-surface" />
                <div className="h-3 w-full rounded bg-pz-surface" />
                <div className="h-3 w-11/12 rounded bg-pz-surface" />
                <div className="h-3 w-4/5 rounded bg-pz-surface" />
              </div>
              <div className="min-w-[260px] flex-[1_1_300px] space-y-3.5">
                <div className="h-3 w-full rounded bg-pz-surface" />
                <div className="h-3 w-3/4 rounded bg-pz-surface" />
                <div className="h-3 w-5/6 rounded bg-pz-surface" />
              </div>
            </div>
          </div>
        </header>
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * Case study (CaseStudy v2, media-forward). A structured "scan layer"
 * rendered from frontmatter — title, hero, contributions, a facts card,
 * skills, NDA note — then the MDX body carries the media gallery, the
 * modular <Highlight> blocks, and the <Outcome>. 1160 grid; the section
 * kit is add/remove per project.
 */
export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();
  if (project.frontmatter.draft) notFound();
  if (project.frontmatter.mediaOnly) notFound();

  const { frontmatter, content } = project;

  if (frontmatter.status === "coming-soon") {
    return <ComingSoonPage frontmatter={frontmatter} />;
  }

  const rows = facts(frontmatter);
  const contributions = frontmatter.contributions ?? [];
  const skills = frontmatter.skills ?? [];

  return (
    <>
      <SiteNav />
      <main id="main-content">
        {/* ===== Scan layer — readable at a glance ===== */}
        <header
          id="overview"
          className="mx-auto max-w-[1160px] scroll-mt-[84px] px-[clamp(20px,4vw,32px)] pt-[clamp(36px,6vh,60px)]"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-[7px] text-[12.5px] font-semibold text-pz-muted transition-colors hover:text-pz-ink [animation:perzRise_.5s_var(--ease-out)_.02s_both]"
          >
            <span aria-hidden>←</span> Work
          </Link>

          <div className="mt-4 flex flex-wrap items-end gap-x-[clamp(24px,4vw,48px)] gap-y-5 [animation:perzRise_.5s_var(--ease-out)_.08s_both]">
            <div className="min-w-[280px] flex-[1_1_480px]">
              <h1 className="pz-wordmark text-[clamp(32px,4.6vw,50px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-pz-ink">
                {frontmatter.title}
              </h1>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-pz-ink2">
                {frontmatter.description}
              </p>
            </div>
            {frontmatter.url && (
              <a
                href={frontmatter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-pz-accent px-[18px] py-[11px] text-[13.5px] font-bold text-pz-canvas transition hover:brightness-110"
              >
                {ctaLabel(frontmatter.url)}
              </a>
            )}
          </div>

          {frontmatter.hero && (
            <Hero src={frontmatter.hero} poster={frontmatter.image} />
          )}

          <div className="mt-[26px] flex flex-wrap gap-x-[clamp(32px,5vw,60px)] gap-y-8 [animation:perzRise_.5s_var(--ease-out)_.26s_both]">
            {contributions.length > 0 && (
              <div className="min-w-[300px] flex-[1.6_1_420px]">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-pz-muted">
                  Contributions at a glance
                </div>
                <div className="mt-2 flex flex-col">
                  {contributions.map((c, i) => {
                    const [lead, ...rest] = c.split(" ");
                    return (
                      <div
                        key={i}
                        className="grid grid-cols-[40px_1fr] items-baseline gap-3.5 border-b border-pz-border py-[15px]"
                      >
                        <span className="text-[12.5px] font-bold tabular-nums text-pz-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="m-0 text-[15px] leading-[1.6] text-pz-ink2">
                          <strong className="font-semibold text-pz-ink">
                            {lead}
                          </strong>{" "}
                          {rest.join(" ")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {rows.length > 0 && (
              <div className="min-w-[260px] flex-[1_1_300px]">
                <div className="rounded-xl border border-pz-border bg-pz-raised px-[18px] py-1">
                  {rows.map((r, i) => (
                    <div
                      key={r.label}
                      className={`grid grid-cols-[108px_1fr] items-center gap-3 py-3 ${
                        i < rows.length - 1 ? "border-b border-pz-border" : ""
                      }`}
                    >
                      <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-pz-faint">
                        {r.label}
                      </span>
                      <span className="text-[13.5px] font-semibold text-pz-ink">
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {skills.length > 0 && (
            <div className="mt-[26px] border-t border-pz-border pt-[22px] [animation:perzRise_.5s_var(--ease-out)_.3s_both]">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-pz-muted">
                Skills &amp; tools
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-pz-border2 px-2.5 py-1 text-[12.5px] text-pz-ink2"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {frontmatter.confidential && (
            <div
              className="mt-6 flex items-center gap-2.5 rounded-[10px] border px-4 py-3.5 [animation:perzRise_.5s_var(--ease-out)_.32s_both]"
              style={{
                borderColor: "color-mix(in oklab, var(--pz-accent) 35%, transparent)",
                background: "color-mix(in oklab, var(--pz-accent) 8%, transparent)",
              }}
            >
              <span className="text-[13px] leading-[1.5] text-pz-ink2">
                Some numbers redacted under NDA.{" "}
                <Link href="/#contact" className="font-semibold text-pz-accent">
                  Reach out for a walkthrough
                </Link>
                .
              </span>
            </div>
          )}
        </header>

        {/* ===== Media middle + close (MDX) ===== */}
        <article className="mx-auto flex max-w-[1160px] flex-col gap-[clamp(56px,9vh,84px)] px-[clamp(20px,4vw,32px)] pb-[clamp(64px,10vh,96px)] pt-[clamp(52px,8vh,80px)]">
          <MDXRemote source={content} components={mdxComponents} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
