
export type SessRow = {
  employeeId: string;
  team: string;
  startedAt: Date;
  endedAt: Date | null;
  zone: string;
  active: number;
  idle: number;
};

type DayRow = {
  date: string;
  present: number;
};

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Team-level numbers only. Teams smaller than minTeam are hidden.
export function aggregate(
  rows: SessRow[],
  teamSizes: Record<string, number>,
  minTeam = 3,
  now = new Date(),
  dateRange?: { start: Date; end: Date },
) {
  const t = new Map<
    string,
    {
      sessions: number;
      mins: number;
      active: number;
      idle: number;
      remote: number;
      people: Set<string>;
    }
  >();

  const days = new Map<string, Set<string>>();

  for (const r of rows) {
    const x = t.get(r.team) ?? {
      sessions: 0,
      mins: 0,
      active: 0,
      idle: 0,
      remote: 0,
      people: new Set<string>(),
    };

    x.sessions++;

    x.mins += Math.max(
      0,
      Math.round(
        ((r.endedAt ?? now).getTime() - r.startedAt.getTime()) / 60000,
      ),
    );

    x.active += r.active;
    x.idle += r.idle;

    if (r.zone === "REMOTE") {
      x.remote++;
    }

    x.people.add(r.employeeId);
    t.set(r.team, x);

    const key = dateKey(r.startedAt);

    if (!days.has(key)) {
      days.set(key, new Set<string>());
    }

    days.get(key)!.add(r.employeeId);
  }

  const teams = [...t.entries()].map(([team, x]) =>
    (teamSizes[team] ?? 0) < minTeam
      ? {
          team,
          hidden: true as const,
        }
      : {
          team,
          hidden: false as const,
          people: x.people.size,
          sessions: x.sessions,
          avgSessionMin: Math.round(x.mins / x.sessions),
          activePct:
            x.active + x.idle > 0
              ? Math.round((100 * x.active) / (x.active + x.idle))
              : 0,
          remoteSessions: x.remote,
        },
  );

  teams.sort((a, b) => a.team.localeCompare(b.team));

  if (dateRange) {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    const startKey = dateKey(start);
    const endKey = dateKey(end);

    // Remove attendance dates outside the requested range.
    for (const key of days.keys()) {
      if (key < startKey || key > endKey) {
        days.delete(key);
      }
    }

    // Fill every calendar date, including dates with zero recorded attendance.
    for (
      const cursor = new Date(start);
      dateKey(cursor) <= endKey;
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    ) {
      const key = dateKey(cursor);

      if (!days.has(key)) {
        days.set(key, new Set<string>());
      }
    }
  }

  const daily: DayRow[] = [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, people]) => ({
      date,
      present: people.size,
    }));

  return {
    teams,
    days: daily,
  };
}
