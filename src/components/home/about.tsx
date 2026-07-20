import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import { siteConfig } from "@/lib/config";

/**
 * "About me" — a centered block: photo, short bio, and a Read more button
 * to the résumé, where the fuller detail (design philosophy, experience)
 * lives. The photo is landscape, cropped into the 4:3 frame with
 * object-cover; set object-position if it clips.
 */
export function About() {
  return (
    <section
      id="about"
      className="mt-[clamp(56px,8vh,88px)] border-y border-pz-border bg-pz-raised transition-colors duration-[450ms]"
    >
      <div className="mx-auto flex max-w-[680px] flex-col items-center px-[clamp(20px,4vw,32px)] py-[clamp(48px,8vh,72px)] text-center">
        <div className="relative aspect-[4/3] w-[min(100%,420px)] overflow-hidden rounded-xl border border-pz-border bg-pz-surface">
          <Image
            src="/percy.jpg"
            alt="Percy"
            fill
            sizes="(min-width: 680px) 420px, 100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>

        <h2 className="mt-8 text-[22px] font-bold tracking-[-0.01em] text-pz-ink">
          About me
        </h2>
        <p className="mt-4 text-[clamp(15.5px,1.6vw,17px)] leading-[1.8] text-pz-ink2 [text-wrap:pretty]">
          {siteConfig.about}
        </p>

        <Link
          href="/resume"
          className="mt-7 inline-flex items-center gap-2 rounded-lg border border-pz-border2 px-4 py-2.5 text-[13px] font-semibold text-pz-ink2 transition-colors hover:border-pz-accent hover:text-pz-accent"
        >
          Read more <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
