import { Banner } from "@/components/site/banner";
import { siteConfig } from "@/lib/config";

/**
 * End-of-page CTA banners, above the contact section. One <Banner> per
 * outbound call to action so they read as a family.
 *
 * TODO (owner): the BisectHosting affiliate banner goes here, above the
 * Kerberus one. It needs two things I don't have — the affiliate URL and
 * the banner artwork ("PLAY WITH FRIENDS", the one with the promo code).
 * Drop the art in public/ and send the link, then add:
 *
 *   <Banner
 *     image="/bisecthosting-banner.png"
 *     eyebrow="Partner"
 *     title="Play with friends"
 *     body="..."
 *     ctaLabel="Start hosting"
 *     ctaHref="<affiliate link>"
 *     accent={{ bg: "#e8434f", fg: "#ffffff" }}
 *   />
 */
export function EndBanners() {
  return (
    <section className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vh,88px)]">
      <Banner
        image="/Kerberusgg.png"
        imageAlt=""
        eyebrow="Kerberus"
        title="Come build worlds with us."
        body="Modded servers, packs, and the people who make them. The Discord is where it all happens."
        ctaLabel="Join the Discord"
        ctaHref={siteConfig.links.discord}
        accent={{ bg: "#5865f2", fg: "#ffffff" }}
      />
    </section>
  );
}
