import stats from "../../../content/portfolio/resume-stats.json";

type Day = { date: string; level: number; count: number };

const DAY = 24 * 60 * 60;

/** Parses the public contribution calendar GitHub serves for a profile. */
async function contributions(user: string): Promise<{ days: Day[]; total: number } | null> {
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: DAY },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const counts = new Map<string, number>();
    for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      counts.set(id, parseInt(text.replace(/,/g, ""), 10) || 0);
    }
    const days: Day[] = [];
    for (const [cell] of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
      const date = cell.match(/data-date="([^"]+)"/)?.[1];
      const id = cell.match(/\bid="([^"]+)"/)?.[1];
      if (!date || !id) continue;
      days.push({ date, level: Number(cell.match(/data-level="(\d)"/)?.[1] ?? 0), count: counts.get(id) ?? 0 });
    }
    if (!days.length) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));
    const heading = html.match(/js-contribution-activity-description[^>]*>\s*([\d,]+)/)?.[1];
    const total = heading ? parseInt(heading.replace(/,/g, ""), 10) : days.reduce((sum, d) => sum + d.count, 0);
    return { days, total };
  } catch {
    return null;
  }
}

function weekday(date: string) {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export async function ActivityPanel() {
  const { user, description } = stats.github;
  const data = await contributions(user);
  if (!data) return null;
  const { days, total } = data;
  const active = days.filter(d => d.count > 0).length;
  let streak = 0, run = 0;
  for (const d of days) { run = d.count ? run + 1 : 0; streak = Math.max(streak, run); }
  const fmt = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return <div className="pf-stat-panel">
    <header className="pf-stat-header">
      <h3>GitHub activity</h3>
      <a href={`https://github.com/${user}`}>@{user}</a>
    </header>
    <p>{description}</p>
    <dl className="pf-stats pf-tracker-stats">
      <div><dt>contributions</dt><dd>{total.toLocaleString("en-US")}</dd></div>
      <div><dt>days with activity</dt><dd>{active}</dd></div>
      <div><dt>longest streak, in days</dt><dd>{streak}</dd></div>
    </dl>
    <div className="pf-heatmap-scroll">
      <div className="pf-heatmap" role="img" aria-label={`${total} contributions from ${fmt(days[0].date)} to ${fmt(days[days.length - 1].date)}`}>
        {days.map((d, i) => <i key={d.date} data-level={d.level} title={`${d.count} on ${fmt(d.date)}`}
          style={i === 0 ? { gridRowStart: weekday(d.date) + 1 } : undefined} />)}
      </div>
    </div>
    <p className="pf-stat-meta">{fmt(days[0].date)} to {fmt(days[days.length - 1].date)}</p>
  </div>;
}

export function ServicePanel() {
  const { description, source, snapshot, modpacks } = stats.service;
  return <div className="pf-stat-panel">
    <header className="pf-stat-header">
      <h3>Modpack service</h3>
      <span className="pf-service-state"><i aria-hidden="true" />All online</span>
    </header>
    <p>{description}</p>
    <ul className="pf-service-list">
      {modpacks.map(m => <li key={m.name}>
        <span className="pf-service-dot" aria-hidden="true" />
        <strong>{m.name}</strong>
        <span className="pf-service-downloads">{m.downloads} downloads</span>
        <span className="pf-service-status">Online</span>
      </li>)}
    </ul>
    <p className="pf-stat-meta">Downloads from <a href={source}>CurseForge</a>, {snapshot}.</p>
  </div>;
}
