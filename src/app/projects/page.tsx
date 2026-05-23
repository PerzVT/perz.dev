import type { Metadata } from "next";
import { TopNav } from "@/components/top-nav";
import { Footer } from "@/components/footer";
import { ProjectsIndex } from "@/components/projects-index";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `All projects — ${siteConfig.name}`,
  description: "A complete index of shipped games and design projects.",
  alternates: { canonical: "/projects" },
};

/**
 * Indexed project list — every project sorted by year. Reached via
 * the Projects nav link or directly via URL. TopNav handles the
 * highlighted-current-route signal.
 */
export default function AllProjectsPage() {
  const projects = getProjects().map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    tags: p.frontmatter.tags,
    year: p.frontmatter.year,
    image: p.frontmatter.image || undefined,
    video: p.frontmatter.video || undefined,
    hero: p.frontmatter.hero || undefined,
    mediaOnly: p.frontmatter.mediaOnly ?? false,
    cardStyle: p.frontmatter.cardStyle ?? "cover",
  }));

  return (
    <>
      <TopNav />
      <main id="main-content" className="relative z-10 min-h-screen pt-20">
        <article className="mx-auto max-w-3xl px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
          <header className="mb-12">
            <Eyebrow tone="foreground">Index</Eyebrow>
            <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
              All projects
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {projects.length}{" "}
              {projects.length === 1 ? "entry" : "entries"} — sorted
              newest first.
            </p>
          </header>

          <ProjectsIndex projects={projects} />
        </article>
        <Footer />
      </main>
    </>
  );
}
