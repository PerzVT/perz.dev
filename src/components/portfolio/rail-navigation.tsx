"use client";
import { useSyncExternalStore } from "react";
import { Icon } from "./controls";

const subscribeWidth = (notify: () => void) => { const q = matchMedia("(max-width: 800px)"); q.addEventListener("change", notify); return () => q.removeEventListener("change", notify); };

/** Arrows beside the slide and a row of position dots under it. Long rails
 *  show a window of dots around the current one. */
export function RailNavigation({ count, index, label, controls, onPrevious, onNext, onSelect }: {
  count: number; index: number; label: string; controls?: string;
  onPrevious: () => void; onNext: () => void; onSelect: (index: number) => void;
}) {
  const mobile = useSyncExternalStore(subscribeWidth, () => matchMedia("(max-width: 800px)").matches, () => false);
  if (count < 2) return null;
  const limit = mobile ? 5 : 7;
  const start = count > limit ? Math.min(Math.max(index - Math.floor(limit / 2), 0), count - limit) : 0;
  const dots = Array.from({ length: Math.min(count, limit) }, (_, i) => start + i);
  const name = label.toLowerCase();
  return <div className="pf-rail-navigation">
    <button type="button" className="pf-carousel-arrow pf-prev" aria-label={`Previous ${name} item`} aria-controls={controls} onClick={onPrevious}><Icon name="imgIconLeft" /></button>
    <div className="pf-dots">{dots.map(i => <button key={i} type="button" aria-label={`Show ${name} item ${i + 1} of ${count}`} aria-current={i === index ? "true" : undefined} aria-controls={controls} onClick={() => onSelect(i)} />)}</div>
    <button type="button" className="pf-carousel-arrow pf-next" aria-label={`Next ${name} item`} aria-controls={controls} onClick={onNext}><Icon name="imgIconRight" /></button>
  </div>;
}
