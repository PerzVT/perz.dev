import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getProjects } from "@/lib/content";

const contentDir = path.join(process.cwd(), "content");

// Read the mtime of each project's MDX file so search engines see
// "last modified" reflect the actual content change time, not the
// last deploy timestamp. Falls back to the deploy time if statSync
// fails (file moved, etc.). Home page uses the deploy time because
// it has no single canonical source file.
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

  const projects = getProjects().map((p) => ({
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
    ...projects,
  ];
}
