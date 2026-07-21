import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Carousel } from "@/components/carousel";
import { BrandRow } from "@/components/brand-row";
import { LazyVideo } from "@/components/lazy-video";
import { MediaReel } from "@/components/case-study/media-reel";

// Shared MDX media frame — Kerberus v2 surface + hairline border.
const MEDIA_FRAME = "block w-full rounded-lg border border-pz-border bg-pz-surface";

/**
 * Inline `<video>` or `<img>` based on the file extension. Authors don't
 * pick between an Image and Video component — the path tells us which.
 * (Article-body stills stay raw <img> for now; a next/image pass with
 * server-measured dimensions is a separate perf follow-up.)
 */
function MdxMedia({ src, alt = "" }: { src: string; alt?: string }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  if (isVideo) {
    return <LazyVideo src={src} className={MEDIA_FRAME} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={MEDIA_FRAME} />
  );
}

/** Figure — inline media in an MDX body (still, GIF/AVIF, or video). */
function Figure({
  src,
  alt = "",
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <MdxMedia src={src} alt={alt} />
    </figure>
  );
}

/** Gallery — responsive multi-image row. */
function Gallery({
  images,
  srcs,
  columns = 2,
}: {
  images?: Array<{ src: string; caption?: string; alt?: string } | string>;
  /** Comma-separated paths — MDX-friendly alternative to `images`. */
  srcs?: string;
  columns?: 2 | 3;
}) {
  const list = srcs
    ? srcs.split(",").map((s) => s.trim()).filter(Boolean)
    : images ?? [];
  const cols = columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`my-8 grid grid-cols-1 gap-4 ${cols}`}>
      {list.map((entry, i) => {
        const item = typeof entry === "string" ? { src: entry } : entry;
        return (
          <figure key={i} className="m-0">
            <MdxMedia src={item.src} alt={item.alt ?? ""} />
          </figure>
        );
      })}
    </div>
  );
}

/** Callout — an editorial margin note, not a system alert. */
function Callout({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "warn" | "info";
}) {
  const label = tone === "info" ? "Aside" : "Note";
  return (
    <aside className="my-6 flex max-w-[62ch] gap-3 text-[15px] italic leading-relaxed text-pz-ink2">
      <span className="mt-[2px] shrink-0 text-sm font-semibold not-italic text-pz-accent">
        {label}.
      </span>
      <div className="[&>p]:m-0">{children}</div>
    </aside>
  );
}

/**
 * Case-study section — flat editorial block: a small numbered eyebrow, a
 * plain display heading, then the body. No card framing (Kerberus v2
 * reads as an open editorial spine, not stacked panels). data-* attrs
 * are retained as harmless anchors.
 */
function CaseSection({
  id,
  index,
  label,
  children,
}: {
  id: string;
  index: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`case-${id}`}
      data-case-section
      data-section-id={id}
      data-section-label={label}
      className="mt-[clamp(40px,6vh,60px)] first:mt-0"
    >
      {index && (
        <div className="text-xs font-semibold text-pz-faint">{index}</div>
      )}
      <h2 className="mt-2 text-[22px] font-bold tracking-[-0.012em] text-pz-ink">
        {label}
      </h2>
      <div className="mt-3.5 [&>:first-child]:mt-0">{children}</div>
    </section>
  );
}

/** Generic case-card — author-defined section label + optional index. */
function CaseCard({
  label,
  index,
  id,
  children,
}: {
  label: string;
  index?: string;
  id?: string;
  children: ReactNode;
}) {
  const resolvedId =
    id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return (
    <CaseSection id={resolvedId} index={index ?? ""} label={label}>
      {children}
    </CaseSection>
  );
}

function Context({ children }: { children: ReactNode }) {
  return (
    <CaseSection id="context" index="01" label="Context">
      {children}
    </CaseSection>
  );
}
function Problem({ children }: { children: ReactNode }) {
  return (
    <CaseSection id="problem" index="02" label="Problem">
      {children}
    </CaseSection>
  );
}
function Approach({ children }: { children: ReactNode }) {
  return (
    <CaseSection id="approach" index="03" label="Approach">
      {children}
    </CaseSection>
  );
}
function Solution({ children }: { children: ReactNode }) {
  return (
    <CaseSection id="solution" index="04" label="Solution">
      {children}
    </CaseSection>
  );
}
/** Legacy alias kept so existing MDX doesn't break. */
function Result({ children }: { children: ReactNode }) {
  return (
    <CaseSection id="result" index="04" label="Result">
      {children}
    </CaseSection>
  );
}

/** Impact — a flat section with a stat grid (pz surface tiles). */
function Impact({ children }: { children: ReactNode }) {
  return (
    <section
      id="case-impact"
      data-case-section
      data-section-id="impact"
      data-section-label="Impact"
      className="mt-[clamp(40px,6vh,60px)] first:mt-0"
    >
      <div className="text-xs font-semibold text-pz-faint">05</div>
      <h2 className="mt-2 text-[22px] font-bold tracking-[-0.012em] text-pz-ink">
        Impact
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

/** One stat tile inside <Impact>. */
function ImpactStat({
  number,
  label,
  sub,
}: {
  number: ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-4xl font-bold leading-none tracking-[-0.02em] text-pz-ink sm:text-5xl">
        {number}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pz-muted">
        {label}
      </span>
      {sub && <span className="text-xs leading-relaxed text-pz-faint">{sub}</span>}
    </div>
  );
}

/** Pull-quote inside <Impact>. */
function ImpactQuote({
  children,
  attribution,
  role,
}: {
  children: ReactNode;
  attribution: string;
  role?: string;
}) {
  return (
    <figure className="col-span-full">
      <blockquote className="text-xl font-semibold italic leading-snug tracking-[-0.01em] text-pz-ink sm:text-2xl">
        “{children}”
      </blockquote>
      <figcaption className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-pz-muted">
        {attribution}
        {role && (
          <span className="block text-[10px] font-normal normal-case tracking-normal text-pz-faint">
            {role}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------
// CaseStudy v2 media-forward vocabulary (matches the "CaseStudy v2" comp).
// A modular kit: <MediaReel> for the gameplay gallery, <Highlight> blocks
// (duplicate or drop one per project), and <Outcome> with <OutcomePoint>
// cards to close. The scan layer (title, hero, facts, contributions,
// skills) is rendered by the page from frontmatter, not MDX.
// ---------------------------------------------------------------------

/** A modular highlight block: eyebrow + title + body on one side, media
 *  (the children) on the other. `flip` puts the media first. */
function Highlight({
  n,
  kicker,
  title,
  body,
  flip,
  children,
}: {
  n: string;
  kicker: string;
  title: string;
  body: string;
  flip?: boolean;
  children?: ReactNode;
}) {
  const id = kicker
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return (
    <section
      id={id}
      data-case-section
      className="flex scroll-mt-[84px] flex-wrap items-center gap-x-[clamp(32px,5vw,56px)] gap-y-7"
    >
      <div className={`min-w-[280px] flex-[1_1_300px] ${flip ? "md:order-2" : ""}`}>
        <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-pz-accent">
          Highlight {n} · {kicker}
        </div>
        <h2 className="mt-2.5 text-[21px] font-bold tracking-[-0.012em] text-pz-ink">
          {title}
        </h2>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.7] text-pz-ink2">
          {body}
        </p>
      </div>
      {children && (
        <div
          className={`min-w-[300px] flex-[1.45_1_400px] [&>*]:my-0 ${flip ? "md:order-1" : ""}`}
        >
          {children}
        </div>
      )}
    </section>
  );
}

/** Case-study close: an "Outcome" section with a lead paragraph and a
 *  stack of <OutcomePoint> cards. */
function Outcome({
  title = "Where it landed.",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id="outcome" data-case-section className="scroll-mt-[84px]">
      <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-pz-accent">
        Outcome
      </div>
      <h2 className="mt-2.5 text-[22px] font-bold tracking-[-0.012em] text-pz-ink">
        {title}
      </h2>
      <div className="mt-3.5 [&>:first-child]:mt-0">{children}</div>
    </section>
  );
}

/** The stack of outcome cards inside <Outcome>. */
function OutcomePoints({ children }: { children: ReactNode }) {
  return <div className="mt-[22px] flex flex-col gap-3">{children}</div>;
}

/** One checkmark outcome card. Use <strong> to emphasise the lead. */
function OutcomePoint({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-pz-border bg-pz-raised px-[18px] py-4">
      <Check
        className="mt-0.5 h-4 w-4 flex-none text-pz-accent"
        strokeWidth={2.4}
        aria-hidden
      />
      <p className="m-0 text-[15px] leading-[1.6] text-pz-ink2 [&>strong]:font-semibold [&>strong]:text-pz-ink">
        {children}
      </p>
    </div>
  );
}

/** Confidential disclaimer under image groups with scrubbed numbers. */
function Confidential() {
  return (
    <p className="my-4 max-w-[62ch] text-xs italic text-pz-faint">
      Some visuals have numbers hidden for confidentiality, but they illustrate
      the underlying design systems and approach.
    </p>
  );
}

/** Smart link — internal anchors in-tab, externals in a new tab. */
function MdxLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";
  const isExternal = /^https?:\/\//i.test(href);
  return (
    <a
      {...props}
      className="text-pz-ink underline decoration-pz-border2 underline-offset-[3px] transition-colors hover:decoration-pz-accent"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    />
  );
}

/** Article-body MDX component map (Kerberus v2 editorial type). */
const components: MDXRemoteProps["components"] = {
  h2: (props) => (
    <h2
      className="mb-2 mt-10 text-2xl font-bold tracking-[-0.015em] text-pz-ink first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-2 mt-7 text-lg font-bold tracking-[-0.01em] text-pz-ink"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mb-5 max-w-[62ch] text-[15px] leading-[1.75] text-pz-ink2"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-5 max-w-[62ch] list-outside list-disc space-y-2 pl-5 text-[15px] leading-[1.75] text-pz-ink2 marker:text-pz-faint"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-5 max-w-[62ch] list-outside list-decimal space-y-2 pl-5 text-[15px] leading-[1.75] text-pz-ink2 marker:text-pz-faint"
      {...props}
    />
  ),
  li: (props) => <li {...props} />,
  a: MdxLink,
  code: (props) => (
    <code
      className="rounded-sm bg-pz-surface px-1 py-0.5 font-mono text-[0.9em] text-pz-ink"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-5 max-w-[62ch] overflow-x-auto rounded-md border border-pz-border bg-pz-surface p-4 font-mono text-sm leading-relaxed text-pz-ink2"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 max-w-[54ch] text-xl font-semibold italic leading-snug tracking-[-0.01em] text-pz-ink [&>p]:m-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 max-w-[62ch] border-pz-border" />,
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className="my-6 block w-full rounded-lg border border-pz-border bg-pz-surface"
      {...props}
    />
  ),
  Figure,
  Gallery,
  Carousel,
  BrandRow,
  Callout,
  Context,
  Problem,
  Approach,
  Solution,
  Impact,
  ImpactStat,
  ImpactQuote,
  CaseCard,
  Result,
  Confidential,
  MediaReel,
  Reel: MediaReel,
  Highlight,
  Outcome,
  OutcomePoints,
  OutcomePoint,
};

export { components as mdxComponents };
