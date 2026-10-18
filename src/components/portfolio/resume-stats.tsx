import stats from "../../../content/portfolio/resume-stats.json";

/**
 * Sample figures stand in until real data exists, and render everywhere
 * except Vercel production, so a placeholder can never reach the live site.
 * Replace the values and set "sample": false in resume-stats.json to publish.
 */
export const showResumeStats = !stats.sample || process.env.VERCEL_ENV !== "production";

// Deterministic, so the sample data does not change between builds.
function seeded(count: number, seed: number): number[] {
  let s = seed;
  return Array.from({ length: count }, () => { s = (s * 16807) % 2147483647; return s / 2147483647; });
}

const WEEKS = 52;
const DAYS = 90;
const DAY_MINUTES = 24 * 60;

function sampleActivity(): number[] {
  return seeded(WEEKS * 7, 7).map(r => (r < 0.45 ? 0 : r < 0.75 ? 1 : r < 0.92 ? 2 : 3));
}

/** Per-day uptime over the window, with the downtime that makes the headline figure. */
function sampleUptime(): number[] {
  const target = parseFloat(stats.reliability.value) / 100;
  const down = Math.round((1 - target) * DAYS * DAY_MINUTES);
  const days = Array<number>(DAYS).fill(1);
  [[23, 0.5], [57, 0.3], [81, 0.2]].forEach(([day, share]) => { days[day] = 1 - (down * share) / DAY_MINUTES; });
  return days;
}

export function ActivityPanel() {
  const { description, period } = stats.activity;
  const days = sampleActivity();
  const active = days.filter(Boolean).length;
  let streak = 0, run = 0;
  for (const d of days) { run = d ? run + 1 : 0; streak = Math.max(streak, run); }
  return <div className="pf-stat-panel">
    <dl className="pf-stats pf-tracker-stats">
      <div><dt>days with activity</dt><dd>{active}</dd></div>
      <div><dt>of the last 52 weeks</dt><dd>{Math.round((active / days.length) * 100)}%</dd></div>
      <div><dt>longest streak, in days</dt><dd>{streak}</dd></div>
    </dl>
    <p>{description}</p>
    <div className="pf-heatmap-scroll">
      <div className="pf-heatmap" role="img" aria-label={`Activity: ${period}`}>
        {days.map((level, i) => <i key={i} data-level={level} />)}
      </div>
    </div>
    <p className="pf-stat-meta">{period}</p>
  </div>;
}

export function UptimePanel() {
  const { title, description, value, source } = stats.reliability;
  const days = sampleUptime();
  const incidents = days.filter(d => d < 1).length;
  return <div className="pf-stat-panel">
    <h2>{title}</h2>
    <p>{description}</p>
    <p className="pf-stat-value">{value}</p>
    <div className="pf-uptime" role="img" aria-label={`${DAYS} days, ${incidents} with downtime`}>
      {days.map((d, i) => <i key={i} data-state={d === 1 ? "up" : d > 0.99 ? "dip" : "down"} title={`${(d * 100).toFixed(2)}%`} />)}
    </div>
    <p className="pf-stat-meta">{DAYS} days ago · {incidents} days with downtime · today</p>
    <p className="pf-stat-meta">{source}</p>
  </div>;
}
