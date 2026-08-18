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
import { ComingSoonGate } from "@/components/site/coming-soon-gate";

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
    </figure>
  );
}

/**
 * Coming-soon state: a decorative "locked" login screen (ComingSoonGate),
 * shown instead of the full case study when frontmatter sets
 * `status: "coming-soon"`. The gate is not real auth — see the component.
 */
function ComingSoonPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content">
        <ComingSoonGate />
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
    return <ComingSoonPage />;
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
          <div className="flex flex-wrap items-end gap-x-[clamp(24px,4vw,48px)] gap-y-5 [animation:perzRise_.5s_var(--ease-out)_.08s_both]">
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
                <h2 className="text-[17px] font-bold tracking-[-0.01em] text-pz-ink">
                  Contributions
                </h2>
                <ul className="mt-3 flex list-none flex-col gap-3 p-0">
                  {contributions.map((c, i) => {
                    const [lead, ...rest] = c.split(" ");
                    return (
                      <li
                        key={i}
                        className="grid grid-cols-[16px_1fr] gap-2 text-[15px] leading-[1.6] text-pz-ink2"
                      >
                        <span
                          aria-hidden
                          className="mt-[9px] h-[6px] w-[6px] rounded-full bg-pz-accent"
                        />
                        <span>
                          <strong className="font-semibold text-pz-ink">
                            {lead}
                          </strong>{" "}
                          {rest.join(" ")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
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
                Some details redacted under NDA.{" "}
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
