"use client";
import { useId, useState } from "react";
import { useCarouselMotion } from "./use-carousel-motion";
import { useAutoAdvance } from "./use-auto-advance";
import { RailNavigation } from "./rail-navigation";
import quotes from "../../../content/recommendations.json";
export function Recommendations() {
  const id = useId();
  const [index, setIndex] = useState(0);
  const rotation = useAutoAdvance(quotes.length, setIndex, index);
  useCarouselMotion(rotation.ref, index, quotes.length);
  const move = (d: number) =>
    setIndex((i) => (i + d + quotes.length) % quotes.length);
  return (
    <section
      className="pf-container pf-section pf-recommendations"
      aria-label="Recommendations"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "ArrowRight") move(1);
        if (e.key === "ArrowLeft") move(-1);
      }}
    >
      <h2>Recommendations</h2>
      <div className="pf-recommendation-stage" ref={rotation.ref}>
        <div className="pf-quotes" data-motion-rail id={id}>
          {[0, 1, 2].map((offset) => {
            const q = quotes[(index + offset) % quotes.length];
            return (
              <article className="pf-quote" key={q.name}>
                <blockquote>{q.quote}</blockquote>
                <div className="pf-quote-author">
                  <img src={q.avatar} alt="" loading="lazy" />
                  <div>
                    <p>{q.name}</p>
                    <small>{q.title}</small>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <RailNavigation
          count={quotes.length}
          index={index}
          label="Recommendations"
          controls={id}
          onSelect={setIndex}
        />
      </div>
      <span className="sr-only" aria-live={rotation.running ? "off" : "polite"}>
        Recommendation {index + 1} of {quotes.length}: {quotes[index].name}
      </span>
    </section>
  );
}
