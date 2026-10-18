"use client";
import { useEffect, useRef } from "react";
import "./supercat-attack-study.css";

const attacks = [
  { state: "Running", name: "Lunge", note: "Spring forward into a claw strike.", mode: "lunge" },
  { state: "Sliding", name: "Raking swipe", note: "Sweep through a line of enemies.", mode: "swipe" },
  { state: "Wall contact", name: "Rebound pounce", note: "Push off, strike, then spring away.", mode: "pounce" },
];
export function SupercatAttackStudy() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    const update = () => { el.dataset.playing = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <figure className="sc-attack-study" ref={ref} aria-label="Reconstructed movement-combat concept: one attack input changes with movement state.">
    <header className="sc-study-header"><span className="sc-input">One attack input</span><span className="sc-header-note">Movement selects the attack</span></header>
    <div className="sc-study-rows">{attacks.map((a, i) => <div className="sc-study-row" key={a.mode} style={{ "--sc-delay": `${i * 3}s` } as React.CSSProperties}>
      <svg viewBox="0 0 480 138" role="img" aria-label={`${a.state}: ${a.name}. ${a.note}`} className="sc-scene">
        <text x="0" y="29" className="sc-state">{a.state}</text>
        <text x="480" y="29" textAnchor="end" className="sc-number">0{i + 1}</text>
        <path d="M0 50H480" className="sc-track"/>
        <path d="M0 50H480" pathLength="1" className="sc-signal"/>
        <text x="0" y="91" className="sc-attack-name">{a.name}</text>
        <text x="0" y="124" className="sc-outcome">{a.note}</text>
      </svg>
    </div>)}</div>
    <figcaption>Reconstructed movement-combat concept</figcaption>
  </figure>;
}
