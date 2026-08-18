import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getProjects } from "@/lib/content";

const contentDir = path.join(process.cwd(), "content");

// mtime of each project's MDX file, so "last modified" reflects real
// content changes rather than deploy time. Falls back to deploy time if
// statSync fails. Home page has no single source file, so it always
// uses deploy time.
function projectMtime(slug: string, fallback: Date): Date {
  try {
    return fs.statSync(path.join(contentDir, "projects", `${slug}.mdx`)).mtime;
  } catch {
    return fallback;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  // mediaOnly projects have no detail route (they 404), so they're
  // excluded here just as they are from generateStaticParams. Drafts
  // are already dropped by getProjects().
  const projects = getProjects()
    .filter((p) => !p.frontmatter.mediaOnly)
    // Coming-soon pages are a placeholder sign-in with no content yet.
    .filter((p) => p.frontmatter.status !== "coming-soon")
    .map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: projectMtime(p.slug, now),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/resume`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...projects,
  ];
}
