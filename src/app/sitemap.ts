import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { caseStudies } from "@/lib/portfolio";
import { indexableProjectSlugs, topLevelRoutes } from "@/lib/routes";

const contentDir = path.join(process.cwd(), "content");

// mtime of each project's source file, so "last modified" reflects real
// content changes rather than deploy time. Falls back to deploy time if
// statSync fails. Top-level pages have no single source file, so they
// always use deploy time.
function projectMtime(slug: string, fallback: Date): Date {
  const source = caseStudies.some((p) => p.slug === slug)
    ? path.join(contentDir, "portfolio", "pages.json")
    : path.join(contentDir, "projects", `${slug}.mdx`);
  try {
    return fs.statSync(source).mtime;
  } catch {
    return fallback;
  }
}

const topLevelPriority: Record<string, { priority: number; changeFrequency: "weekly" | "monthly" }> = {
  "/": { priority: 1, changeFrequency: "weekly" },
  "/sidequests": { priority: 0.8, changeFrequency: "weekly" },
  "/resume": { priority: 0.6, changeFrequency: "monthly" },
  "/contact": { priority: 0.6, changeFrequency: "monthly" },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  return [
    ...topLevelRoutes.map((route) => ({
      url: route === "/" ? base : `${base}${route}`,
      lastModified: now,
      ...(topLevelPriority[route] ?? { priority: 0.6, changeFrequency: "monthly" as const }),
    })),
    ...indexableProjectSlugs().map((slug) => ({
      url: `${base}/projects/${slug}`,
      lastModified: projectMtime(slug, now),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
