"use client";
import { useState } from "react";
import { Icon } from "./controls";
import quotes from "../../../content/recommendations.json";
export function Recommendations() {
  const [index, setIndex] = useState(0);
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
      <div className="pf-quotes">
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
      <div className="pf-recommendation-nav">
        <button
          className="pf-carousel-arrow"
          aria-label="Previous recommendation"
          onClick={() => move(-1)}
        >
          <Icon name="imgIconLeft" />
        </button>
        <div className="pf-dots">
          {quotes.map((q, i) => (
            <button
              key={q.name}
              aria-label={`Show recommendation from ${q.name}`}
              aria-current={index === i ? "true" : undefined}
              onClick={() => setIndex(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <button
          className="pf-carousel-arrow"
          aria-label="Next recommendation"
          onClick={() => move(1)}
        >
          <Icon name="imgIconRight" />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        Recommendation {index + 1} of {quotes.length}: {quotes[index].name}
      </span>
    </section>
  );
}
