import source from "../../content/portfolio/pages.json";

export type Media = {
  src: string;
  alt: string;
  sourceHash?: string;
  fit?: string;
  background?: string;
  crop?: number[][];
  frame?: number[];
  width?: number;
  height?: number;
  video?: string;
};
export type BannerData = {
  images: Media[];
  /** The design kit's art-tile wash: "indigo" (default), "blue", "green" or
   *  "terracotta". Any other value falls back to indigo. */
  tone?: string;
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
      /** `figure` names a built page in the project's public figures folder;
       *  cards that carry one render as alternating rows beside it. */
      cards: { title: string; body: string; figure?: string }[];
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
  /** "coming-soon" shows the hero and overview, then ends the page at a
   *  locked panel. Omit it once the write-up is ready. */
  status?: "live" | "coming-soon";
};
export const portfolio = source;
export const caseStudies = source.projects as CaseStudy[];

/** Display order for the home carousel and the projects grid. */
const featuredOrder = [
  "highstreet-calamity-vr",
  "supercat",
  "bubble-buddy",
  "lurk",
  "poly-punch-vr",
  "stick-it",
  "bisecthosting",
  "dragoncraft",
  "mythcraft",
];

export const featuredStudies = featuredOrder.map((slug) => {
  const study = caseStudies.find((p) => p.slug === slug);
  if (!study) {
    throw new Error(
      `featuredOrder lists "${slug}", which is not a project in content/portfolio/pages.json.`,
    );
  }
  return study;
});
