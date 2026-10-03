// Pure logic (no database), unit-tested.
export type Win = { start: Date; end: Date; partial: boolean };
const H = 3600_000;

// Hour windows measured from the session start. Open sessions: complete hours only.
// Ended sessions: complete hours plus a final partial window if at least one minute is left.
export function hourWindows(start: Date, now: Date, endedAt: Date | null): Win[] {
  const out: Win[] = [];
  const end = (endedAt ?? now).getTime();
  let s = start.getTime();
  while (s < end) {
    const e = s + H;
    if (e <= end) out.push({ start: new Date(s), end: new Date(e), partial: false });
    else { if (endedAt && end - s >= 60_000) out.push({ start: new Date(s), end: endedAt, partial: true }); break; }
    s = e;
  }
  return out;
}

export function summarize(rows: { appName: string; idle: boolean }[]) {
  let active = 0, idle = 0;
  const apps = new Map<string, number>();
  for (const r of rows) {
    if (r.idle) idle++;
    else { active++; apps.set(r.appName, (apps.get(r.appName) ?? 0) + 1); }
  }
  const topApps = [...apps.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([app, min]) => ({ app, min }));
  return { active, idle, topApps };
}

// Rule-based starting point; the employee edits it. No productivity judgement.
export function draftNote(r: { activeMin: number; topApps: { app: string; min: number }[]; project?: string | null }) {
  if (!r.topApps.length) return "No tracked activity this hour — add a manual summary.";
  const top = r.topApps.slice(0, 2).map((a) => `${a.app} (${a.min}m)`).join(" and ");
  return `Worked mostly in ${top} — ${r.activeMin} active minutes${r.project && r.project !== "—" ? " on " + r.project : ""}. Please edit before submitting.`;
}
