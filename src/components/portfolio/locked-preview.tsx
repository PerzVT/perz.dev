import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./controls";
import "./locked-preview.css";

type Action = { href: string; label: string };

/**
 * Ends a page whose write-up is not ready: the content above stays readable,
 * an optional teaser fades out underneath, and the page stops at this panel.
 * The teaser is inert, so its links and carousels cannot be reached.
 */
export function LockedPreview({ title, teaser, primary, secondary }: {
  title: string;
  teaser?: ReactNode;
  primary: Action;
  secondary: Action;
}) {
  return <section className="pf-locked" aria-labelledby="locked-heading">
    {teaser && <div className="pf-locked-teaser" inert aria-hidden="true">{teaser}</div>}
    <div className="pf-container">
      <div className="pf-locked-panel">
        <h2 id="locked-heading">Full write-up coming soon</h2>
        <p>I&apos;m still writing up {title}. The overview above is current.</p>
        <div className="pf-actions">
          <Link className="pf-button" href={primary.href}><Icon name="imgIconArrow" />{primary.label}</Link>
          <Link className="pf-outline" href={secondary.href}>{secondary.label}</Link>
        </div>
      </div>
    </div>
  </section>;
}
