import { TopNav } from "@/components/top-nav";
import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";
import { DocSection } from "@/components/doc-section";
import { VisualWork } from "@/components/visual-work";
import { Footer } from "@/components/footer";
import { Terminal } from "@/components/terminal";
import { JsonLd } from "@/components/json-ld";
import { CuttingMatBg } from "@/components/cutting-mat-bg";
import { getProjects, getVisual } from "@/lib/content";

/**
 * Home page — Hero → Projects → (Visual if present) → Footer.
 *
 * Work, Education, and Skills sections are intentionally hidden in
 * this pass — the loaders + components still exist (see content/work,
 * content/education, content/skills.json) so reinstating them is a
 * one-line render addition. Top nav also stripped of those entries
 * so the nav doesn't link to sections that don't exist.
 */
export default function Home() {
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
  const visual = getVisual();

  return (
    <>
      <JsonLd />
      <CuttingMatBg />
      <TopNav />
      <main id="main-content" className="relative z-10 pt-20">
        <Hero />

        <DocSection
          id="projects"
          eyebrow="Things I've Built"
          title="Projects"
          width="hero"
        >
          <ProjectGrid projects={projects} />
        </DocSection>

        {visual.length > 0 && (
          <DocSection
            id="visual"
            eyebrow="Selected"
            title="Visual Work"
          >
            <VisualWork pieces={visual} />
          </DocSection>
        )}

        <Footer />
      </main>
      <Terminal slugs={projects.map((p) => p.slug)} />
    </>
  );
}
