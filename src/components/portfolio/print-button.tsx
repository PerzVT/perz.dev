"use client";
export function PrintButton() {
  return <button className="pf-button pf-print-action" onClick={() => window.print()}>Print / save PDF</button>;
}
