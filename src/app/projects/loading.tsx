import { SiteNav } from "@/components/site/site-nav";

/**
 * Route-transition skeleton for the work grid. Mirrors the header + 2:3
 * card grid so navigating to /projects never flashes blank. Reduced-motion
 * users get a static placeholder (the shimmer is disabled globally).
 */
export default function Loading() {
  return (
    <>
      <SiteNav />
      <main id="main-content">
        <div className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(48px,8vh,80px)]">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded-md bg-pz-surface" />
            <div className="mt-3 h-4 w-full max-w-[420px] rounded bg-pz-surface" />
            <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-x-5 gap-y-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[2/3] w-full rounded-[10px] border border-pz-border bg-pz-surface" />
                  <div className="h-4 w-2/3 rounded bg-pz-surface" />
                  <div className="h-3 w-full rounded bg-pz-surface" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
