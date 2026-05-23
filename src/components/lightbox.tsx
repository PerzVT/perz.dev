"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Mount sentinel via useSyncExternalStore. Server snapshot returns
// false (no document); client snapshot returns true. Same pattern
// used elsewhere for hydration-safe client-only reads.
const subscribeMount = () => () => {};
const getMountClient = () => true;
const getMountServer = () => false;

/**
 * Image/video lightbox. Portaled to document.body so it escapes any
 * parent stacking context (otherwise the project grid sits inside
 * `<main className="z-10">` and our z-[100] never beats the nav's
 * z-40). Esc / outside-click / X closes; body scroll locked while
 * open so the page underneath doesn't drift.
 *
 * Media sizing: bounded to fit comfortably inside the viewport,
 * leaving a clear gutter around all sides so the overlay reads as
 * a modal, not a takeover. width:auto + height:auto + max
 * constraints lets the media keep its aspect ratio.
 */
export function Lightbox({
  src,
  alt = "",
  type,
  onClose,
}: {
  src: string;
  alt?: string;
  type: "image" | "video";
  onClose: () => void;
}) {
  // Portal target is document.body. SSR-safe — useSyncExternalStore
  // returns false on the server, true on the client after mount.
  // While unmounted (SSR), render nothing.
  const mounted = useSyncExternalStore(
    subscribeMount,
    getMountClient,
    getMountServer,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!mounted) return null;

  const overlay = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm sm:p-12"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="media preview"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-6 sm:top-6"
        aria-label="close preview"
        data-sfx="click"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Media wrapper. max-w / max-h leave a generous gutter on all
          sides; the media keeps its native aspect within those bounds.
          Stop click propagation so clicks on the media don't trigger
          the outside-click close. */}
      <div
        className="flex max-h-[85vh] max-w-[80vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {type === "video" ? (
          <video
            src={src}
            autoPlay
            loop
            playsInline
            controls
            className="max-h-[85vh] max-w-[80vw] rounded-md object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="max-h-[85vh] max-w-[80vw] rounded-md object-contain"
          />
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
