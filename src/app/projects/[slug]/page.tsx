import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { LazyVideo } from "@/components/lazy-video";
import { BLUR_DATA_URL } from "@/lib/blur";
import { getProject, getProjects, type ProjectFrontmatter } from "@/lib/content";
import { mdxComponents } from "@/components/mdx";
import { siteConfig } from "@/lib/config";
import { TopNav } from "@/components/top-nav";
import { Footer } from "@/components/footer";
import { CaseToc } from "@/components/case-toc";
import { ItchIcon, MetaIcon, SteamIcon } from "@/components/icons";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  // Skip mediaOnly projects — they don't have a detail page, only
  // a lightbox preview from the grid. Pre-rendering empty routes for
  // them would let users land on a blank article via direct URL.
  const projects = getProjects().filter(
    (p) => !p.frontmatter.mediaOnly,
  );
  return projects.map((p) => ({ slug: p.slug }));
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
  const pageTitle = `${title} — ${siteConfig.name}`;
  const canonical = `/projects/${slug}`;
  const ogImage = hero ?? image;

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/**
 * Project detail page. TopNav + Footer chrome matches the home page
 * so the site reads as one cohesive document. Project content is a
 * centered max-w-3xl article column.
 */
export default async function ProjectPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();
  // mediaOnly projects don't have a detail page — they're surfaced
  // only via the lightbox on the home grid / index. Direct URL
  // navigation 404s. generateStaticParams above also excludes them
  // so the static build doesn't pre-render empty routes.
  if (project.frontmatter.mediaOnly) notFound();

  const { frontmatter, content } = project;
  const isComingSoon = frontmatter.status === "coming-soon";
  // Only the case-study route uses the structured <Context>/<Problem>/etc.
  // components and gets the TOC + two-column layout. Other project pages
  // (loose narrative with markdown headings) render as a centered single
  // column, no TOC. Avoids fake scaffolding around pages that don't have
  // the structure yet.
  const showCaseLayout = Boolean(frontmatter.caseStudy) && !isComingSoon;

  return (
    <>
      <TopNav />
      <main id="main-content" className="relative z-10 min-h-screen pt-20">
        <div
          className={
            showCaseLayout
              ? "mx-auto flex max-w-6xl gap-12 px-6 pb-16 pt-12 sm:px-10 sm:pt-16 lg:gap-16"
              : "mx-auto max-w-3xl px-6 pb-16 pt-12 sm:px-10 sm:pt-16"
          }
        >
          {showCaseLayout && <CaseToc />}
          <article
            className={showCaseLayout ? "w-full max-w-3xl flex-1" : ""}
          >
          {/* Tag row now leads the article — year moves next to the tags
              as a peer piece of metadata instead of competing with the
              headline. This clears a gigantic visual gap previously
              owned by the big Fraunces year numeral and lets the title
              breathe at full width. */}
          {/* Single-rule metadata strip: year + tags joined with the
              same hairline slash. Earlier version used " · " between
              year and tags but " / " between tags, which read as two
              different lists pretending to be one. One separator does
              the whole row. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground/80">
            <span className="tabular-nums text-foreground/80">
              {frontmatter.year}
            </span>
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-x-2 lowercase"
              >
                <span className="text-muted-foreground/40">/</span>
                {tag}
              </span>
            ))}
          </div>

          {/* Lifted to display scale so the project title is the
              largest thing on the page. Previously 36px and out-shouted
              by the hero video below + the case-TOC sidebar. */}
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
            {frontmatter.title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {frontmatter.description}
          </p>

          <ProjectMeta frontmatter={frontmatter} />

          {frontmatter.hero && (
            <HeroMedia src={frontmatter.hero} poster={frontmatter.image} />
          )}

          {frontmatter.url && <ExternalCTA url={frontmatter.url} title={frontmatter.title} />}

          {isComingSoon ? (
            // Coming-soon stub: replaces the case-study body with a
            // small editorial note. No empty cards, no skeleton
            // sections — the page is honest about being in progress
            // without rendering structurally empty UI.
            <div className="mt-12 border-t border-border/60 pt-6">
              <Eyebrow>In progress</Eyebrow>
              <p className="mt-2 max-w-[42rem] text-[15px] italic leading-relaxed text-muted-foreground">
                A full write-up is still being put together — what&apos;s
                here so far is the short version. Reach out if you want
                to see more before it&apos;s typed up.
              </p>
            </div>
          ) : (
            <div className="mt-12 space-y-0">
              <MDXRemote source={content} components={mdxComponents} />
            </div>
          )}
          </article>
        </div>
        <Footer />
      </main>
    </>
  );
}

/**
 * Platform-aware CTA strip. Data-driven — every variant differs only
 * in icon, eyebrow text, and one accent color, so we describe each as
 * a small record and render them through a single <CTALink>. The old
 * version had 4 near-identical inline JSX blocks that drifted apart
 * visually (different eyebrow opacities, subtly different paddings)
 * every time one got tweaked. One renderer keeps them in lockstep.
 */
type CTAVariant = {
  eyebrow: string;
  Icon?: React.ComponentType<{ className?: string }>;
  /** Applied to the whole card. Defaults to the neutral surface. */
  card?: string;
  /** Applied to the icon only, so we can accent the icon without
   *  repainting the whole card (see Meta variant). */
  accent?: string;
};

const NEUTRAL_CARD =
  "border border-border bg-card text-foreground hover:bg-card/80";

function ExternalCTA({ url, title }: { url: string; title: string }) {
  const isItch = /itch\.io/i.test(url);
  const isSteam = /store\.steampowered\.com|steamcommunity\.com/i.test(url);
  const isMeta = /meta\.com\/(experiences|quest)/i.test(url);

  const variant: CTAVariant = isItch
    ? {
        eyebrow: "Play on itch.io",
        Icon: ItchIcon,
        card: "bg-[#fa5c5c] text-white hover:bg-[#ff6d6d]",
      }
    : isSteam
      ? {
          eyebrow: "View on Steam",
          Icon: SteamIcon,
          card: "bg-[#1b2838] text-white hover:bg-[#243447]",
        }
      : isMeta
        ? {
            eyebrow: "View on Meta Quest",
            Icon: MetaIcon,
            card: NEUTRAL_CARD,
            accent: "text-[#0064e0] dark:text-[#4e9dff]",
          }
        : { eyebrow: "Open project", card: NEUTRAL_CARD };

  return <CTALink url={url} title={title} variant={variant} />;
}

function CTALink({
  url,
  title,
  variant,
}: {
  url: string;
  title: string;
  variant: CTAVariant;
}) {
  const { Icon, eyebrow, card, accent } = variant;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        // No hover lift on the card itself. The arrow's translate is
        // the affordance — lifting the whole card adds the SaaS-template
        // "I'm a button now" feel. Card just shifts background tint.
        "group mt-10 flex w-full items-center justify-between gap-4 rounded-xl px-6 py-5 transition-colors",
        card,
      ].join(" ")}
    >
      <span className="flex items-center gap-4">
        {Icon && (
          <Icon
            className={[
              "h-8 w-8 shrink-0",
              accent ?? "text-current",
            ].join(" ")}
          />
        )}
        <span className="flex flex-col leading-tight">
          <Eyebrow tone={accent ? "accent" : card?.includes("text-white") ? "on-color" : "muted"} className={accent}>
            {eyebrow}
          </Eyebrow>
          <span className="font-display text-xl sm:text-2xl">{title}</span>
        </span>
      </span>
      <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}


/**
 * Hero media wrapper. Videos (mp4/webm) render as looping muted
 * <video>; everything else as <img> (animated GIFs/AVIFs loop natively).
 * When a still image is available alongside a video (`image` in the
 * frontmatter), we pass it in as a poster so the first frame isn't a
 * black flash before the video decodes.
 */
function HeroMedia({ src, poster }: { src: string; poster?: string }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  // No card border, no card-tint background. The hero IS the visual —
  // wrapping it in a thumbnail frame turned every project into a
  // product-card preview. A simple rounded mask is enough; the page
  // background sits underneath if the asset has transparency.
  //
  // Image variant uses next/image with priority — this is the LCP
  // element on every project detail page. Sizes hint matches the
  // case-study column width.
  return (
    <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl">
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
          sizes="(min-width: 1024px) 768px, 100vw"
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
 * Editorial credit list. Previously: 3-column bordered card with a
 * separate dt/dd block per field, every label in tight uppercase
 * tracking. Felt like a Jira ticket more than a write-up.
 *
 * Now: inline key → value rows with a hair-rule separator. The label
 * stays low-contrast and sentence-case; the value takes the emphasis.
 * Roles (the only multi-value field) still stack vertically inside
 * their value cell.
 */
function ProjectMeta({ frontmatter }: { frontmatter: ProjectFrontmatter }) {
  const rows: Array<[string, React.ReactNode]> = [];

  if (frontmatter.roles && frontmatter.roles.length > 0) {
    rows.push([
      "Roles",
      <div key="roles" className="flex flex-col gap-0.5">
        {frontmatter.roles.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>,
    ]);
  }
  if (frontmatter.engine) rows.push(["Engine", frontmatter.engine]);
  if (frontmatter.duration) rows.push(["Duration", frontmatter.duration]);
  if (frontmatter.platform) rows.push(["Platform", frontmatter.platform]);
  if (frontmatter.release) rows.push(["Release", frontmatter.release]);
  // Renamed from "Context" to avoid clashing with the new <Context />
  // case-study section that opens project narratives. The metadata
  // row is about who paid for / commissioned the work, so "Employment"
  // is the more accurate label anyway.
  if (frontmatter.employment) rows.push(["Employment", frontmatter.employment]);

  if (rows.length === 0) return null;

  return (
    <dl className="mt-8 divide-y divide-border/60 border-y border-border/60">
      {rows.map(([label, value]) => (
        <div
          key={String(label)}
          className="grid grid-cols-[7rem_1fr] items-baseline gap-x-6 py-3 sm:grid-cols-[8rem_1fr]"
        >
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="text-sm leading-relaxed text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
