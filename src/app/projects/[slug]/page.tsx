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

/** Condensed one-line metadata strip from the frontmatter. */
function metaLine(fm: ProjectFrontmatter): string {
  const parts: string[] = [];
  if (fm.roles?.length) parts.push(fm.roles.join(", "));
  if (fm.engine) parts.push(fm.engine);
  if (fm.platform) parts.push(fm.platform);
  if (fm.duration) parts.push(fm.duration);
  else if (fm.release) parts.push(String(fm.release));
  if (fm.employment) parts.push(fm.employment);
  return parts.join(" · ");
}

/** Platform-aware external CTA label. */
function ctaLabel(url: string): string {
  if (/itch\.io/i.test(url)) return "Play on itch.io ↗";
  if (/store\.steampowered\.com|steamcommunity\.com/i.test(url))
    return "View on Steam ↗";
  if (/meta\.com\/(experiences|quest)/i.test(url)) return "View on Meta Quest ↗";
  return "View project ↗";
}

function HeroMedia({ src, poster }: { src: string; poster?: string }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  return (
    <div className="relative mt-[30px] aspect-[16/9] w-full overflow-hidden rounded-xl border border-pz-border bg-pz-surface [animation:perzRise_.6s_var(--ease-out)_.3s_both]">
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
          sizes="(min-width: 940px) 900px, 100vw"
          priority
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
      )}
    </div>
  );
}

/**
 * Case study (Kerberus v2). Re-skinned MDX-driven route: shared chrome,
 * breadcrumb, condensed meta line, NDA note, single 900px editorial
 * column. Real content + the Context/Problem/Approach/Solution/Impact
 * vocabulary are preserved (restyled in mdx.tsx).
 */
export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();
  if (project.frontmatter.draft) notFound();
  if (project.frontmatter.mediaOnly) notFound();

  const { frontmatter, content } = project;
  const isComingSoon = frontmatter.status === "coming-soon";
  const meta = metaLine(frontmatter);

  return (
    <>
      <SiteNav />
      <main id="main-content">
        <header className="mx-auto max-w-[900px] px-[clamp(20px,4vw,32px)] pt-[clamp(44px,7vh,72px)]">
          <div className="text-[13px] text-pz-faint [animation:perzRise_.5s_var(--ease-out)_.04s_both]">
            <Link
              href="/projects"
              className="text-pz-muted transition-colors hover:text-pz-ink"
            >
              My work
            </Link>{" "}
            / {frontmatter.title}
          </div>
          <h1 className="mt-[18px] text-[clamp(30px,4.2vw,44px)] font-bold leading-[1.05] tracking-[-0.02em] text-pz-ink [animation:perzRise_.5s_var(--ease-out)_.1s_both]">
            {frontmatter.title}
          </h1>
          <p className="mt-3.5 max-w-[56ch] text-base leading-[1.65] text-pz-ink2 [animation:perzRise_.5s_var(--ease-out)_.16s_both]">
            {frontmatter.description}
          </p>
          {meta && (
            <div className="mt-4 text-[13px] leading-[1.8] text-pz-muted [animation:perzRise_.5s_var(--ease-out)_.2s_both]">
              {meta}
            </div>
          )}
          {(frontmatter.url || frontmatter.confidential) && (
            <div className="mt-[18px] flex flex-wrap items-center gap-[18px] [animation:perzRise_.5s_var(--ease-out)_.24s_both]">
              {frontmatter.url && (
                <a
                  href={frontmatter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-pz-accent"
                >
                  {ctaLabel(frontmatter.url)}
                </a>
              )}
              {frontmatter.confidential && (
                <span className="text-[12.5px] text-pz-faint">
                  Some numbers redacted under NDA — walked through live in
                  interviews.
                </span>
              )}
            </div>
          )}
          {frontmatter.hero && (
            <HeroMedia src={frontmatter.hero} poster={frontmatter.image} />
          )}
        </header>

        <article className="mx-auto flex max-w-[900px] flex-col px-[clamp(20px,4vw,32px)] pb-[clamp(64px,10vh,96px)] pt-[clamp(44px,7vh,64px)]">
          {isComingSoon ? (
            <div className="border-t border-pz-border pt-6">
              <div className="text-xs font-semibold text-pz-accent">
                In progress
              </div>
              <p className="mt-2 max-w-[62ch] text-[15px] italic leading-relaxed text-pz-ink2">
                A full write-up is still being put together — what&apos;s here so
                far is the short version. Reach out if you want to see more before
                it&apos;s typed up.
              </p>
            </div>
          ) : (
            <MDXRemote source={content} components={mdxComponents} />
          )}

          <div className="mt-[clamp(40px,6vh,60px)] flex flex-wrap justify-between gap-4 border-t border-pz-border pt-5">
            <Link
              href="/projects"
              className="text-[13.5px] font-semibold text-pz-ink2 transition-colors hover:text-pz-ink"
            >
              ← All work
            </Link>
            <Link
              href="/#contact"
              className="text-[13.5px] font-semibold text-pz-accent"
            >
              Want the full walkthrough? Get in touch →
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
