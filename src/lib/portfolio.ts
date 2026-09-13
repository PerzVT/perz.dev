import source from "../../content/portfolio/pages.json";

export type Media = {
  src: string;
  alt: string;
  sourceHash?: string;
  video?: string;
};
export type BannerData = {
  images: Media[];
  logo?: string;
  title: string;
  body: string;
  label?: string;
  href?: string;
};
export type ExperienceData = {
  role: string;
  company: string;
  body: string;
  period: string;
  logo?: string;
};
export type ProjectSection =
  | {
      type: "feature";
      title: string;
      body: string;
      media: Media[];
      mediaFirst: boolean;
    }
  | {
      type: "outcomes";
      title: string;
      cards: { title: string; body: string }[];
    };
export type CaseStudy = {
  slug: string;
  figmaNode: string;
  title: string;
  description: string;
  hero: Media[];
  video?: string;
  url?: string;
  contributions: string[];
  facts: { label: string; value: string }[];
  skills: string[];
  gallery: Media[];
  initialSlide: number;
  sections: ProjectSection[];
  banners: BannerData[];
};
export const portfolio = source;
export const caseStudies = source.projects as CaseStudy[];
export const featuredStudies = [
  "highstreet-calamity-vr",
  "supercat",
  "bubble-buddy",
  "lurk",
  "poly-punch-vr",
  "stick-it",
  "bisecthosting",
  "dragoncraft",
  "mythcraft",
].map((slug) => caseStudies.find((p) => p.slug === slug)!);
