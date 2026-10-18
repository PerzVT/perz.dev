"use client";
import { useEffect, useRef, useState } from "react";
import type { Media } from "@/lib/portfolio";
import { MediaImage } from "./media-image";
import { Icon } from "./controls";

// Concept art must not leave the site at full resolution, so the viewer shows
// a resized copy from the image optimiser and never links the original file.
const viewerSrc = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=75`;
const block = (event: { preventDefault: () => void }) => event.preventDefault();

export function MediaViewer({ items, index, label, onSelect, onClose }: {
  items: Media[]; index: number; label: string;
  onSelect: (index: number) => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const current = items[index];
  const many = items.length > 1;
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      const carousel = trigger?.closest(".pf-carousel");
      const destination = carousel?.querySelector<HTMLElement>('[data-active="true"] button') || trigger;
      destination?.focus({ preventScroll: true });
    };
  }, []);
  const select = (next: number) => onSelect((next + items.length) % items.length);
  return <dialog ref={dialog} className="pf-media-dialog" aria-label={label}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === dialog.current || (event.target as Element).classList.contains("pf-viewer-stage")) onClose(); }}
    onContextMenu={block} onDragStart={block}
    onKeyDown={event => {
      if (!many) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); select(index - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); select(index + 1); }
    }}>
    <div className="pf-viewer-stage">
      {/* eslint-disable-next-line @next/next/no-img-element -- the optimiser URL is built by hand to cap the size */}
      <img key={current.src} src={viewerSrc(current.src)} alt={current.alt} draggable={false} />
    </div>
    {many && <>
      <button type="button" className="pf-carousel-arrow pf-viewer-prev" aria-label="Previous image" onClick={() => select(index - 1)}><Icon name="imgIconLeft" /></button>
      <button type="button" className="pf-carousel-arrow pf-viewer-next" aria-label="Next image" onClick={() => select(index + 1)}><Icon name="imgIconRight" /></button>
    </>}
    <button type="button" className="pf-carousel-arrow pf-viewer-close" aria-label="Close" onClick={onClose} autoFocus><Icon name="imgIconClose" /></button>
  </dialog>;
}

export function ArtworkLink({ media, className = "sq-art" }: { media: Media; className?: string }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" className={className} aria-label={`View artwork: ${media.alt}`} onClick={() => setOpen(true)}>
    <MediaImage media={media} />
  </button>{open && <MediaViewer items={[media]} index={0} label={media.alt} onSelect={() => {}} onClose={() => setOpen(false)} />}</>;
}
