"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { Media } from "@/lib/portfolio";
import { MediaImage } from "./media-image";

export function MediaViewer({ items, index, label, onSelect, onClose }: {
  items: Media[]; index: number; label: string;
  onSelect: (index: number) => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const [zoomed, setZoomed] = useState(false);
  const imageArea = useRef<HTMLDivElement>(null);
  const current = items[index];
  useEffect(() => {
    const node = dialog.current!;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      const carousel = trigger?.closest(".pf-carousel");
      const destination = carousel?.querySelector<HTMLElement>('[data-active="true"] a, [data-active="true"] button') || trigger;
      destination?.focus({ preventScroll: true });
    };
  }, []);
  function select(next: number) {
    onSelect((next + items.length) % items.length);
    setZoomed(false);
    imageArea.current?.scrollTo(0, 0);
  }
  return <dialog ref={dialog} className="pf-media-dialog" aria-labelledby={title}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === dialog.current) onClose(); }}
    onKeyDown={(event) => {
      if (zoomed) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); select(index - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); select(index + 1); }
    }}>
    <div className="pf-viewer-panel">
      <header className="pf-viewer-header"><div><h2 id={title}>{label}</h2><p role="status">{current.alt}</p></div>
        <button className="pf-outline" onClick={onClose} autoFocus>Close</button>
      </header>
        <div ref={imageArea} className="pf-viewer-image" data-zoomed={zoomed} tabIndex={0} aria-label="Full-size artwork">
          <img src={current.src} alt={current.alt} />
        </div>
        <div className="pf-viewer-actions">
          {items.length > 1 && <button className="pf-outline" onClick={() => select(index - 1)}>Previous image</button>}
          <button className="pf-outline" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{zoomed ? "Fit image" : "Original size"}</button>
          {items.length > 1 && <button className="pf-outline" onClick={() => select(index + 1)}>Next image</button>}
          <a className="pf-outline" href={current.src} target="_blank" rel="noreferrer">Open original image</a>
        </div>
    </div>
  </dialog>;
}

export function ArtworkLink({ media, className = "sq-art" }: { media: Media; className?: string }) {
  const [open, setOpen] = useState(false);
  return <><a className={className} href={media.src} aria-label={`View full artwork: ${media.alt}`} onClick={(e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); setOpen(true);
  }}><MediaImage media={media} /></a>{open && <MediaViewer items={[media]} index={0} label={media.alt} onSelect={() => {}} onClose={() => setOpen(false)} />}</>;
}
