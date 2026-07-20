import { siteConfig } from "@/lib/config";

/**
 * "About me" — the owner's approved paragraph beside a reserved portrait
 * frame. No photo asset exists yet, so the frame is a labelled
 * placeholder (keeps the comp's two-column silhouette); drop a photo at
 * /public and swap the placeholder for next/image when supplied.
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
        </div>
        <div className="relative aspect-[4/5] min-w-[min(100%,240px)] max-w-[340px] flex-1 basis-[260px] overflow-hidden rounded-[10px] border border-pz-border bg-pz-surface">
          <span className="absolute inset-0 flex items-center justify-center text-[13px] text-pz-faint">
            Photo — owner supplies
          </span>
        </div>
      </div>
    </section>
  );
}
