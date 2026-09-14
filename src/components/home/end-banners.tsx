import { Banner } from "@/components/site/banner";
import { siteConfig } from "@/lib/config";

/**
 * End-of-page CTA banners, above contact. One <Banner> per outbound CTA.
 *
 * PLACEHOLDER ART: the BisectHosting banner uses a solid-colour stand-in
 * (public/shared/placeholders/placeholder-bisecthosting-banner.png, 2000x500). Replace that
 * file in place once the owner has real artwork.
 *
 * PLACEHOLDER LINK: ctaHref points at bisecthosting.com, not the
 * affiliate URL. Swap it before production.
 */
export function EndBanners() {
  return (
    <section className="mx-auto flex max-w-[1160px] flex-col gap-4 px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vh,88px)]">
      <Banner
        image="/shared/placeholders/placeholder-bisecthosting-banner.png"
        imageAlt=""
        eyebrow="BisectHosting"
        dotColor="#e8434f"
        title="Play with friends."
        body="Servers for the games you actually play."
        ctaLabel="Start hosting"
        ctaHref="https://www.bisecthosting.com/"
      />
      <Banner
        image="/projects/kerberus-modded-suite/gallery/Kerberusgg.png"
        imageAlt=""
        eyebrow="Kerberus"
        dotColor="#5865f2"
        title="Come build worlds with us."
        body="Modded servers, packs, and the people who make them."
        ctaLabel="Join the Discord"
        ctaHref={siteConfig.links.discord}
      />
    </section>
  );
}
