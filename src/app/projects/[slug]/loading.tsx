import { SiteNav } from "@/components/site/site-nav";

/**
 * Route-transition skeleton for a case study. Shown while the segment's
 * data loads, so navigating from a card never flashes a blank screen —
 * it mirrors the scan-layer shape (title, hook, hero, columns). Uses the
 * shared shimmer; reduced-motion users get a static placeholder.
 */
export default function Loading() {
  return (
    <>
      <SiteNav />
      <main id="main-content">
        <div className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(36px,6vh,60px)]">
          <div className="animate-pulse">
            <div className="h-3 w-16 rounded bg-pz-surface" />
            <div className="mt-5 h-10 w-2/3 max-w-[520px] rounded-md bg-pz-surface" />
            <div className="mt-4 h-4 w-full max-w-[560px] rounded bg-pz-surface" />
            <div className="mt-2 h-4 w-4/5 max-w-[440px] rounded bg-pz-surface" />
            <div className="mt-7 aspect-[16/9] w-full rounded-[14px] border border-pz-border bg-pz-surface" />
            <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
              <div className="min-w-[300px] flex-[1.6_1_420px] space-y-3.5">
                <div className="h-3 w-40 rounded bg-pz-surface" />
                <div className="h-3 w-full rounded bg-pz-surface" />
                <div className="h-3 w-11/12 rounded bg-pz-surface" />
                <div className="h-3 w-4/5 rounded bg-pz-surface" />
              </div>
              <div className="min-w-[260px] flex-[1_1_300px] space-y-3.5">
                <div className="h-3 w-full rounded bg-pz-surface" />
                <div className="h-3 w-3/4 rounded bg-pz-surface" />
                <div className="h-3 w-5/6 rounded bg-pz-surface" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
