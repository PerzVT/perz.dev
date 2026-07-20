import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";
import { siteConfig } from "@/lib/config";

/**
 * "About me" — the bio and design-philosophy paragraphs beside the photo.
 * The photo (public/percy.jpg) is landscape, cropped into the 4:5 frame
 * with object-cover; set object-position if the crop clips.
 */
export function About() {
  return (
    <section
      id="about"
      className="mt-[clamp(56px,8vh,88px)] border-y border-pz-border bg-pz-raised transition-colors duration-[450ms]"
    >
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-start gap-[clamp(28px,5vw,56px)] px-[clamp(20px,4vw,32px)] py-[clamp(44px,7vh,64px)]">
        <div className="flex-1 basis-[400px]">
          <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pz-ink">
            About me
          </h2>
          <p className="mt-[18px] max-w-[64ch] text-[clamp(15.5px,1.6vw,17px)] leading-[1.8] text-pz-ink2 [text-wrap:pretty]">
            {siteConfig.about}
          </p>

          <h2 className="mt-8 text-[22px] font-bold tracking-[-0.01em] text-pz-ink">
            My design philosophy
          </h2>
          <p className="mt-[18px] max-w-[64ch] text-[clamp(15.5px,1.6vw,17px)] leading-[1.8] text-pz-ink2 [text-wrap:pretty]">
            {siteConfig.philosophy}
          </p>
        </div>

        <div className="relative aspect-[4/5] min-w-[min(100%,240px)] max-w-[340px] flex-1 basis-[260px] overflow-hidden rounded-[10px] border border-pz-border bg-pz-surface">
          <Image
            src="/percy.jpg"
            alt="Percy"
            fill
            sizes="(min-width: 1160px) 340px, (min-width: 640px) 40vw, 100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
