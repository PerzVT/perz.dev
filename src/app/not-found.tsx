import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** 404. Plain and short, with the two links people actually want. */
export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main
        id="main-content"
        className="mx-auto flex min-h-[62vh] max-w-[1160px] flex-col justify-center px-[clamp(20px,4vw,32px)] py-16"
      >
        <p className="text-[13px] font-bold uppercase tracking-[0.09em] text-pz-accent">
          404
        </p>
        <h1 className="pz-wordmark mt-3 text-[clamp(30px,4.4vw,46px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-pz-ink">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-pz-ink2">
          The link may be out of date, or the page may have moved.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-lg bg-pz-accent px-[18px] py-[11px] text-[13.5px] font-bold text-pz-canvas transition hover:brightness-110"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-pz-border2 px-[18px] py-[11px] text-[13.5px] font-semibold text-pz-ink2 transition-colors hover:border-pz-accent hover:text-pz-accent"
          >
            Work
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
