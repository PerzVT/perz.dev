import stats from "../../../content/portfolio/resume-stats.json";

export function ModpackUptime() {
  const { uptime, days, modpacks } = stats;
  return <ul className="pf-uptime-list">
    {modpacks.map(name => <li key={name}>
      <div className="pf-uptime-row">
        <span className="pf-service-dot" aria-hidden="true" />
        <strong>{name}</strong>
        <span className="pf-uptime-value">{uptime} uptime</span>
      </div>
      <div className="pf-uptime" role="img" aria-label={`${name}: ${uptime} uptime over ${days} days`}>
        {Array.from({ length: days }, (_, i) => <i key={i} />)}
      </div>
    </li>)}
  </ul>;
}
