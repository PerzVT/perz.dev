import stats from "../../../content/portfolio/resume-stats.json";

/**
 * Sample figures stand in until real data exists, and render everywhere
 * except Vercel production, so a placeholder can never reach the live site.
 * Replace the values and set "sample": false in resume-stats.json to publish.
 */
export const showResumeStats = !stats.sample || process.env.VERCEL_ENV !== "production";

// Deterministic, so the sample grid does not change between builds.
function sampleActivity(weeks: number): number[] {
  let seed = 7;
  return Array.from({ length: weeks * 7 }, () => {
    seed = (seed * 16807) % 2147483647;
    const roll = seed / 2147483647;
    return roll < 0.45 ? 0 : roll < 0.75 ? 1 : roll < 0.92 ? 2 : 3;
  });
}

export function ActivityHeatmap() {
  const { title, description, period } = stats.activity;
  const days = sampleActivity(52);
  return <section className="pf-container pf-section" aria-labelledby="activity-heading">
    <h2 id="activity-heading">{title}</h2>
    <div className="pf-stat-panel">
      <p>{description}</p>
      <div className="pf-heatmap-scroll">
        <div className="pf-heatmap" role="img" aria-label={`${title}: ${period}`}>
          {days.map((level, i) => <i key={i} data-level={level} />)}
        </div>
      </div>
      <p className="pf-stat-meta">{period}</p>
    </div>
  </section>;
}

export function ServiceReliability() {
  const { title, description, value, source } = stats.reliability;
  return <section className="pf-container pf-section" aria-labelledby="reliability-heading">
    <h2 id="reliability-heading">Service reliability</h2>
    <div className="pf-stat-panel">
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="pf-stat-value">{value}</p>
      <p className="pf-stat-meta">{source}</p>
    </div>
  </section>;
}
