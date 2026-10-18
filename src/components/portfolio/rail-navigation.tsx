"use client";
import { Icon } from "./controls";

export function RailNavigation({ count, label, controls, onPrevious, onNext }: {
  count: number; label: string; controls?: string;
  onPrevious: () => void; onNext: () => void;
}) {
  if (count < 2) return null;
  return <div className="pf-rail-navigation">
    <button type="button" className="pf-carousel-arrow pf-prev" aria-label={`Previous ${label.toLowerCase()} item`} aria-controls={controls} onClick={onPrevious}><Icon name="imgIconLeft" /></button>
    <button type="button" className="pf-carousel-arrow pf-next" aria-label={`Next ${label.toLowerCase()} item`} aria-controls={controls} onClick={onNext}><Icon name="imgIconRight" /></button>
  </div>;
}
