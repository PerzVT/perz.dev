"use client";
import { useId, useSyncExternalStore } from "react";
import { useLoopingCarousel } from "./use-looping-carousel";
import { RailNavigation } from "./rail-navigation";
import quotes from "../../../content/recommendations.json";
const subscribeWidth = (notify: () => void) => { const query = matchMedia("(max-width: 800px)"); query.addEventListener("change", notify); return () => query.removeEventListener("change", notify); };

export function Recommendations() {
  const mobile = useSyncExternalStore(subscribeWidth, () => matchMedia("(max-width: 800px)").matches, () => false);
  const id = useId();
  const { ref, viewportRef, index, running, previous, next } = useLoopingCarousel(quotes.length, 0, "start");
  return <section className="pf-container pf-section pf-recommendations" aria-label="Recommendations" aria-roledescription="carousel" tabIndex={0}
    onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
    }}>
    <h2>Recommendations</h2>
    <div className="pf-recommendation-stage" ref={ref}>
      <div ref={viewportRef} className="pf-track-viewport pf-quotes-viewport" id={id}>
        <div className="pf-stable-track pf-quotes-track">
          {quotes.map((quote, item) => {
            const offset = (item - index + quotes.length) % quotes.length;
            const visible = offset < (mobile ? 1 : 3);
            return <article className="pf-quote pf-track-quote" key={quote.name} inert={!visible} aria-hidden={!visible} data-visible-offset={visible ? offset : -1}>
              <blockquote>{quote.quote}</blockquote>
              <div className="pf-quote-author"><img src={quote.avatar} alt="" loading="lazy" draggable={false} />
                <div><p>{quote.name}</p><small>{quote.title}</small></div>
              </div>
            </article>;
          })}
        </div>
      </div>
      <RailNavigation count={quotes.length} label="Recommendations" controls={id} onPrevious={previous} onNext={next} />
    </div>
    <span className="sr-only" aria-live={running ? "off" : "polite"}>Recommendation {index + 1} of {quotes.length}: {quotes[index].name}</span>
  </section>;
}
