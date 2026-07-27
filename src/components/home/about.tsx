import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";
import { Button } from "@/components/site/button";
import { siteConfig } from "@/lib/config";
import { SectionHeading } from "@/components/site/section-heading";

/**
 * "About me" — bio beside the photo, the two columns centered against each
 * other vertically. A Read more link leads to the résumé, where the fuller
 * detail (design philosophy, experience) lives. The photo is landscape,
 * cropped into the 4:3 frame with object-cover; set object-position if it
 * clips.
 */
export function About() {
  return (
    <section
      id="about"
      // The one inset panel on the page. It used to be a full-bleed
      // tinted band, but a different background colour is not how this
      // system separates regions — a ringed panel is.
      className="mx-auto mt-[clamp(56px,8vh,88px)] max-w-[1160px] px-[clamp(20px,4vw,32px)]"
    >
      <div className="pz-panel flex flex-wrap items-center gap-[clamp(28px,5vw,56px)] rounded-[var(--r-panel)] p-[clamp(28px,5vw,48px)]">
        <div className="flex-1 basis-[400px]">
          <SectionHeading>About me</SectionHeading>
          <p className="mt-[18px] max-w-[62ch] text-[clamp(15.5px,1.6vw,17px)] leading-[1.8] text-pz-ink2 [text-wrap:pretty]">
            {siteConfig.about}
          </p>
          <Button
            href="/resume"
            variant="secondary"
            className="mt-5 border border-pz-border2"
          >
            Read more
          </Button>
        </div>

        <div className="relative aspect-[4/5] w-full max-w-[340px] flex-1 basis-[260px] overflow-hidden rounded-xl border border-pz-border bg-pz-surface">
          <Image
            src="/percy.jpg"
            alt="Percy"
            fill
            sizes="(min-width: 1160px) 340px, (min-width: 640px) 45vw, 100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
