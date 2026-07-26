"use client";

import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * Route-level error boundary. Keeps the site chrome so a failure still
 * looks like the site, offers a retry (`reset` re-renders the segment)
 * and a way out. The error message itself isn't printed — it can carry
 * internals, and it means nothing to a visitor.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <SiteNav />
      <main
        id="main-content"
        className="mx-auto flex min-h-[62vh] max-w-[1160px] flex-col justify-center px-[clamp(20px,4vw,32px)] py-16"
      >
        <h1 className="pz-wordmark text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-pz-ink">
          Something broke.
        </h1>
        <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-pz-ink2">
          That one is on me, not you. Try again, or head back and take
          another route.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-pz-accent px-[18px] py-[11px] text-[13.5px] font-bold text-pz-canvas transition hover:brightness-110"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-pz-border2 px-[18px] py-[11px] text-[13.5px] font-semibold text-pz-ink2 transition-colors hover:border-pz-accent hover:text-pz-accent"
          >
            Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
