import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { CaseStudyBody } from "@/components/portfolio/sections";
import { caseStudies } from "@/lib/portfolio";
import { getProjects } from "@/lib/content";
import SidequestDetail from "@/components/portfolio/sidequests";
import {
  generateMetadata as legacyMetadata,
} from "@/components/portfolio/legacy-project";
type Params = Promise<{ slug: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...new Set([
      ...caseStudies.map((p) => p.slug),
      ...getProjects()

        .map((p) => p.slug),
    ]),
  ].map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = caseStudies.find((p) => p.slug === slug);
  return p
    ? {
        title: p.title,
        description: p.description,
        alternates: { canonical: `/projects/${slug}` },
        openGraph: {
          title: p.title,
          description: p.description,
          images: [p.hero[0].src],
        },
      }
    : legacyMetadata({ params });
}
export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = caseStudies.find((p) => p.slug === slug);
  if (!p) {
    if (!getProjects().some((p) => p.slug === slug)) notFound();
    return <SidequestDetail params={params} />;
  }
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pf-page">
        <CaseStudyBody project={p} />
      </main>
      <SiteFooter />
    </>
  );
}
