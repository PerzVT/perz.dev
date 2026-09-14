"use client";
import "./carousel-track.css";
import { useId, useState, useSyncExternalStore } from "react";
import { useCarouselMotion } from "./use-carousel-motion";
import { useAutoAdvance } from "./use-auto-advance";
import { RailNavigation } from "./rail-navigation";
import quotes from "../../../content/recommendations.json";
const subscribeWidth = (notify: () => void) => { const query = matchMedia("(max-width: 800px)"); query.addEventListener("change", notify); return () => query.removeEventListener("change", notify); };
export function Recommendations() {
  const mobile = useSyncExternalStore(subscribeWidth, () => matchMedia("(max-width: 800px)").matches, () => false);
  const id = useId();
  const [index, setIndex] = useState(0);
  const { ref, running } = useAutoAdvance(quotes.length, setIndex, index);
  useCarouselMotion(ref, index, quotes.length);
  const move = (d: number) =>
    setIndex((i) => (i + d + quotes.length) % quotes.length);
  return (
    <section
      className="pf-container pf-section pf-recommendations"
      aria-label="Recommendations"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
      }}
    >
      <h2>Recommendations</h2>
      <div className="pf-recommendation-stage" ref={ref}>
        <div className="pf-track-viewport pf-quotes-viewport" id={id}>
          <div className="pf-stable-track pf-quotes-track" data-motion-track>
            {Array.from({ length: quotes.length * 3 }, (_, slot) => {
              const q = quotes[slot % quotes.length];
              const visible = slot >= quotes.length + index && slot < quotes.length + index + (mobile ? 1 : 3);
              return <article className="pf-quote pf-track-quote" key={slot} inert={!visible} aria-hidden={!visible}
                data-visible-offset={visible ? slot - quotes.length - index : -1}>
                <blockquote>{q.quote}</blockquote>
                <div className="pf-quote-author"><img src={q.avatar} alt="" loading="lazy" />
                  <div><p>{q.name}</p><small>{q.title}</small></div>
                </div>
              </article>;
            })}
          </div>
        </div>
        <RailNavigation
          count={quotes.length}
          index={index}
          label="Recommendations"
          controls={id}
          onSelect={setIndex}
        />
      </div>
      <span className="sr-only" aria-live={running ? "off" : "polite"}>
        Recommendation {index + 1} of {quotes.length}: {quotes[index].name}
      </span>
    </section>
  );
}
