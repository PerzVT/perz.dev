import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { Carousel } from "@/components/carousel";
import { BrandRow } from "@/components/brand-row";
import { LazyVideo } from "@/components/lazy-video";

// Shared MDX media class — both Figure and Gallery items wear the same
// rounded-card frame, so the rule lives in one place.
const MEDIA_FRAME = "block w-full rounded-lg border border-border bg-card";

/**
 * Inline `<video>` or `<img>` based on the file extension. Authors don't
 * have to pick between an Image and Video MDX component — the path
 * tells us which to mount.
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

/**
 * Figure — inline media in an MDX body. Accepts stills, animated GIFs /
 * AVIFs, or videos (mp4 / webm). The `caption` prop is accepted for
 * backwards compatibility but intentionally not rendered: project pages
 * read better as a visual story, not a gallery wall with museum labels.
 */
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

/**
 * Gallery — multi-image row. Renders a responsive grid; each entry is
 * either a `{ src, caption }` object or a raw image src string.
 */
function Gallery({
  images,
  columns = 2,
}: {
  images: Array<{ src: string; caption?: string; alt?: string } | string>;
  columns?: 2 | 3;
}) {
  const cols = columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`my-8 grid grid-cols-1 gap-4 ${cols}`}>
      {images.map((entry, i) => {
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

/**
 * Callout — an editorial aside.
 *
 * Previous pass used the Bootstrap admonition pattern: coloured left
 * chevron + tinted panel background. That visual pattern shows up in
 * every AI-generated doc template, so it reads as boilerplate even
 * when the content is hand-written.
 *
 * New approach: render the tone as a small inline prefix label and
 * keep the body as regular italic prose, set slightly smaller than
 * the surrounding copy. No border, no colour-wash. Feels like a
 * margin note rather than a system alert.
 */
function Callout({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "warn" | "info";
}) {
  // Label and accent paired by tone. Neutral and warn share "Note." —
  // the colour does the lifting; we don't want a hard "Warning." in an
  // editorial aside. Info reads as "Aside." which feels lighter.
  const TONE = {
    neutral: { label: "Note", color: "text-foreground/70" },
    warn: { label: "Note", color: "text-amber-600 dark:text-amber-300" },
    info: { label: "Aside", color: "text-sky-600 dark:text-sky-300" },
  } as const;
  const { label, color: labelColor } = TONE[tone];
  return (
    <aside className="my-6 flex max-w-[42rem] gap-3 text-[15px] italic leading-relaxed text-muted-foreground">
      <span
        className={`mt-[2px] shrink-0 font-display not-italic text-sm ${labelColor}`}
      >
        {label}.
      </span>
      <div className="[&>p]:m-0">{children}</div>
    </aside>
  );
}

/**
 * Case-study section wrapper — top-level structure for project pages.
 * Each project follows Context → Problem → Approach → Solution →
 * Impact. The wrapper renders as a bordered card with a numbered
 * eyebrow + display title header, followed by the body below.
 *
 * The card framing (rounded border, padding, bg-card surface) breaks
 * each section into a scannable unit — matches the Behance-style
 * case-study reference where each beat lives in its own panel.
 *
 * `data-case-section` + `data-section-id` are read by the page-level
 * sidebar TOC to discover sections at runtime without the MDX file
 * needing to also export a manifest.
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
      className="mt-8 rounded-xl border border-border/60 bg-card/60 p-6 first:mt-0 sm:p-8"
    >
      <header className="mb-5 flex items-baseline gap-3">
        {index && (
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
            {index}
          </span>
        )}
        <h2 className="font-display text-xl text-foreground sm:text-2xl">
          {label}
        </h2>
      </header>
      <div className="[&>:first-child]:mt-0">{children}</div>
    </section>
  );
}

/**
 * Generic case-card wrapper for authors who want their own section
 * labels instead of the fixed Context/Problem/Approach/Solution/Impact
 * names. Same visual treatment (bordered card, numbered eyebrow,
 * display title) and same data attributes so the TOC sidebar picks
 * it up.
 *
 * `index` is optional — if omitted, the card renders without the
 * leading "01" / "02" eyebrow. `label` slugifies to `id` for the TOC
 * link target, unless `id` is supplied explicitly.
 */
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
    <CaseSection
      id={resolvedId}
      index={index ?? ""}
      label={label}
    >
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

/**
 * Legacy alias for the old "Result" lead-in. New pages should use
 * Impact instead (which is the case-study-section-05 + stat grid).
 * Keeping Result here so existing MDX doesn't break mid-migration.
 */
function Result({ children }: { children: ReactNode }) {
  return (
    <CaseSection id="result" index="04" label="Result">
      {children}
    </CaseSection>
  );
}

/**
 * Impact section — Sam-Will-style dark stat grid. Regardless of
 * theme, this block uses the inverted treatment (white-on-dark) so
 * it reads as a "metrics moment" inside the case study. Children
 * are typically a mix of <ImpactStat> tiles and an optional
 * <ImpactQuote>.
 *
 * The dark surface stays muted — no rainbow accents, no charts, no
 * progress bars. Big number, small label, generous breathing room.
 * The grid auto-fits between 1 and 3 columns based on viewport.
 */
function Impact({ children }: { children: ReactNode }) {
  return (
    <section
      id="case-impact"
      data-case-section
      data-section-id="impact"
      data-section-label="Impact"
      className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-card/60 first:mt-0"
    >
      <header className="flex items-baseline gap-3 px-6 pt-6 sm:px-8 sm:pt-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
          05
        </span>
        <h2 className="font-display text-xl text-foreground sm:text-2xl">
          Impact
        </h2>
      </header>
      {/* Stat grid lives inside the card. Generous padding so the
          numbers don't crowd; grid auto-fits 1/2/3 columns. */}
      <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
        <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * One stat tile inside <Impact>. Big number in display weight, small
 * label below. Optional sub-label for unit or context. Sized so 2–3
 * fit per row on desktop without crowding.
 */
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
      <span className="font-display text-4xl leading-none text-foreground sm:text-5xl">
        {number}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {sub && (
        <span className="text-xs leading-relaxed text-muted-foreground/70">
          {sub}
        </span>
      )}
    </div>
  );
}

/**
 * Quote inside <Impact>. Pull-quote treatment with attribution under.
 * Larger type than body, italic, attribution in eyebrow caps. Sits
 * full-width inside the Impact grid by spanning all columns when
 * combined with stat tiles.
 */
function ImpactQuote({
  children,
  attribution,
  role,
}: {
  children: ReactNode;
  /** Speaker name or org. */
  attribution: string;
  /** Optional role/title — "Senior Designer, Acme". */
  role?: string;
}) {
  return (
    <figure className="col-span-full">
      <blockquote className="font-display text-xl italic leading-snug text-foreground sm:text-2xl">
        “{children}”
      </blockquote>
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {attribution}
        {role && (
          <span className="block text-[10px] normal-case tracking-[0.05em] text-muted-foreground/70">
            {role}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Confidential disclaimer — used under image groups with scrubbed numbers.
 */
function Confidential() {
  return (
    <p className="my-4 max-w-[42rem] text-xs italic text-muted-foreground/70">
      Some visuals have numbers hidden for confidentiality, but they illustrate
      the underlying design systems and approach.
    </p>
  );
}

/**
 * Smart link — opens internal anchors in-tab, externals in a new
 * tab. Old version blanket-applied target="_blank" which is wrong
 * for #anchors and same-origin links and breaks back-button flow.
 */
function MdxLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";
  const isExternal = /^https?:\/\//i.test(href);
  // Spread props FIRST, then override target/rel/className so MDX
  // authors can't accidentally weaken the security attributes by
  // setting their own target on the source <a>.
  return (
    <a
      {...props}
      className="text-foreground underline decoration-foreground/30 underline-offset-[3px] transition-colors hover:decoration-foreground"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    />
  );
}

/**
 * Article-body MDX component map.
 *
 * Editorial type system, not a UI kit:
 * - Body is high-contrast foreground/85, not the muted-chrome colour
 *   used for labels and timestamps. Long-form reading wants
 *   foreground; muted is for metadata.
 * - 17px / 1.7 leading on desktop, ~16px on mobile. Below 16 starts
 *   to feel like a docs site instead of a write-up.
 * - Measure clamped to ~68ch (max-w-[42rem]) per text element. The
 *   outer article stays max-w-3xl (48rem) so figures and carousels
 *   can break out of the body column — the column is asymmetric on
 *   purpose, like newspaper text-with-photos layouts.
 * - Heading rhythm: tight top margin (1.5rem) to keep visual link to
 *   the previous paragraph, generous bottom (0.5rem) so the heading
 *   stays close to its own content. Old rhythm pushed h2 12 spacing
 *   away from prose, which read as section divider rather than
 *   continuation.
 * - Lists use foreground-colour markers — Tailwind's default markers
 *   inherit text colour, so dropping body to foreground fixes both.
 * - hr is hairline + tight margin, not a 10-rem moat.
 */
const components: MDXRemoteProps["components"] = {
  h2: (props) => (
    <h2
      className="mb-2 mt-10 font-display text-2xl text-foreground first:mt-0 sm:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-2 mt-7 font-display text-lg text-foreground sm:text-xl"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mb-5 max-w-[42rem] text-[16px] leading-[1.7] text-foreground/85 sm:text-[17px]"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-5 max-w-[42rem] list-outside list-disc space-y-2 pl-5 text-[16px] leading-[1.7] text-foreground/85 marker:text-foreground/40 sm:text-[17px]"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-5 max-w-[42rem] list-outside list-decimal space-y-2 pl-5 text-[16px] leading-[1.7] text-foreground/85 marker:text-foreground/40 sm:text-[17px]"
      {...props}
    />
  ),
  li: (props) => <li {...props} />,
  a: MdxLink,
  code: (props) => (
    <code
      className="rounded-sm bg-card px-1 py-0.5 font-mono text-[0.9em] text-foreground"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-5 max-w-[42rem] overflow-x-auto rounded-md border border-border bg-card p-4 font-mono text-sm leading-relaxed"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 max-w-[36rem] font-display text-xl italic leading-snug text-foreground/90 sm:text-2xl [&>p]:m-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 max-w-[42rem] border-border/60" />,
  img: ({ alt, ...props }) => (
    // Default alt to "" only when the author truly didn't supply one
    // (next-mdx-remote translates ![text](src) into alt={text}). When
    // alt is present, pass it through so screen readers announce real
    // image content instead of skipping it as decorative.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className="my-6 block w-full rounded-lg border border-border bg-card"
      {...props}
    />
  ),
  Figure,
  Gallery,
  Carousel,
  BrandRow,
  Callout,
  // Case-study sections (new structure):
  Context,
  Problem,
  Approach,
  Solution,
  Impact,
  ImpactStat,
  ImpactQuote,
  // Generic case-card — author-defined labels for migrated pages
  // that don't fit the rigid Context/Problem/Approach/Solution/Impact
  // narrative.
  CaseCard,
  // Legacy alias kept so existing MDX files don't error mid-migration.
  // Result reads as a softer "Solution" inline lead-in; new pages
  // should prefer Impact for outcomes.
  Result,
  Confidential,
};

export { components as mdxComponents };
