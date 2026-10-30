

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

type DayRow = { date: string; present: number };
type TeamVisible = {
  team: string;
  hidden: false;
  people: number;
  sessions: number;
  avgSessionMin: number;
  activePct: number;
  remoteSessions: number;
};
type TeamHidden = { team: string; hidden: true };
type AnalyticsData = {
  days: DayRow[];
  teams: (TeamVisible | TeamHidden)[];
  reportsSubmittedPct: number | null;
  minTeam: number;
};

const panel =
  "rounded-2xl border border-white/[0.09] bg-[#111318] shadow-[0_12px_40px_rgba(0,0,0,0.12)]";
const muted = "text-sm text-neutral-400";

function formatDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

function formatDuration(minutes: number) {
  if (!Number.isFinite(minutes) || minutes < 0) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
}

function MetricCard({
  label,
  value,
  detail,
  symbol,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  symbol: string;
  accent: string;
}) {
  return (
    <section className={`${panel} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <p className={muted}>{label}</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${accent}`}>
          {symbol}
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-neutral-500">{detail}</p>
    </section>
  );
}

export default function Analytics() {
  const router = useRouter();
  const [days, setDays] = useState(7);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api(`/admin/analytics?days=${days}`);
      setData(result as AnalyticsData);
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      if (err.status === 401) {
        router.push("/workforce/login");
        return;
      }
      if (err.status === 403) {
        router.push("/workforce");
        return;
      }
      setError(err.message || "Unable to load workforce analytics.");
    } finally {
      setLoading(false);
    }
  }, [days, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const daily = data?.days ?? [];
  const teams = data?.teams ?? [];
  const visibleTeams = teams.filter(
    (team): team is TeamVisible => !team.hidden
  );
  const hiddenCount = teams.filter((team) => team.hidden).length;

  const latestDay = daily.length ? daily[daily.length - 1] : null;
  const totalVisibleSessions = visibleTeams.reduce(
    (sum, team) => sum + team.sessions,
    0
  );
  const totalVisibleRemote = visibleTeams.reduce(
    (sum, team) => sum + team.remoteSessions,
    0
  );
  const maxPresent = Math.max(1, ...daily.map((day) => day.present));
  const reportRate = data?.reportsSubmittedPct;
  const reportValue =
    reportRate == null ? "N/A" : `${reportRate}%`;

  return (
    <main className="min-h-screen bg-[#090a0d] px-4 py-6 text-neutral-100 md:px-8 md:py-9">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="/workforce/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
            >
              <span aria-hidden="true">←</span> Workforce administration
            </a>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Workforce intelligence
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Analytics overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
              Understand attendance patterns, work-session summaries and
              reporting activity across your organization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="analytics-days" className="text-sm text-neutral-400">
              Reporting period
            </label>
            <select
              id="analytics-days"
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="rounded-xl border border-white/10 bg-[#15171d] px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm transition hover:bg-white/10 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-emerald-300">
            Team-level reporting
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1.5">
            No individual rankings
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1.5">
            Minimum team size: {data?.minTeam ?? 3}
          </span>
        </div>

        {error && (
          <section
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4"
          >
            <p className="font-medium text-red-300">Analytics unavailable</p>
            <p className="mt-1 text-sm text-neutral-300">{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-3 text-sm text-red-200 underline underline-offset-4"
            >
              Try again
            </button>
          </section>
        )}

        {loading && !data && !error && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`${panel} h-40 animate-pulse bg-white/[0.025]`}
              />
            ))}
          </div>
        )}

        {data && (
          <>
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">At a glance</h2>
                  <p className={`mt-1 ${muted}`}>
                    A summary of the data available for this period.
                  </p>
                </div>
                {loading && (
                  <span className="text-xs text-neutral-500">Updating…</span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Latest recorded attendance"
                  value={latestDay ? String(latestDay.present) : "—"}
                  detail={
                    latestDay
                      ? `Unique employees with a session starting on ${formatDate(latestDay.date)}`
                      : "No attendance records in this period"
                  }
                  symbol="◎"
                  accent="bg-sky-400/10 text-sky-300"
                />
                <MetricCard
                  label="Visible-team sessions"
                  value={String(totalVisibleSessions)}
                  detail="Sessions in teams whose statistics meet the privacy threshold"
                  symbol="◷"
                  accent="bg-violet-400/10 text-violet-300"
                />
                <MetricCard
                  label="Visible-team remote sessions"
                  value={String(totalVisibleRemote)}
                  detail="Recorded sessions with a REMOTE zone in visible teams"
                  symbol="⌖"
                  accent="bg-cyan-400/10 text-cyan-300"
                />
                <MetricCard
                  label="Hourly report submission"
                  value={reportValue}
                  detail="Submitted reports divided by submitted plus draft reports"
                  symbol="▤"
                  accent="bg-emerald-400/10 text-emerald-300"
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-neutral-500">
                Team session totals exclude hidden teams. Attendance counts are
                organization-wide daily unique-employee counts. The latest
                recorded date may not be today.
              </p>
            </section>

           <section className="grid min-w-0 grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
              <div className={`${panel} p-5 md:p-6`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Attendance trend</h2>
                    <p className={`mt-1 ${muted}`}>
                      Unique employees by session start date
                    </p>
                  </div>
                  <span className="rounded-lg bg-white/[0.05] px-3 py-2 text-xs text-neutral-400">
                    {daily.length} recorded days
                  </span>
                </div>

                {daily.length === 0 ? (
                  <div className="flex min-h-52 items-center justify-center text-center">
                    <div>
                      <p className="text-sm text-neutral-300">No attendance data yet</p>
                      <p className="mt-2 text-xs text-neutral-500">
                        Attendance will appear when work sessions are recorded.
                      </p>
                    </div>
                  </div>
                ) : (

<div className="mt-7 min-w-0">
  <div className="overflow-x-auto">
    <div
      style={{
        minWidth: daily.length > 14 ? `${daily.length * 40}px` : "100%",
      }}
    >
      <div className="flex h-52 items-end gap-2 border-b border-white/[0.08] pb-2 sm:gap-3">
        {daily.map((day) => {
          const height = Math.max(5, (day.present / maxPresent) * 100);

          return (
            <div
              key={day.date}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              title={`${formatDate(day.date)}: ${day.present} unique employees`}
            >
              <span className="text-xs tabular-nums text-neutral-300">
                {day.present}
              </span>

              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-indigo-700 to-sky-400 transition-all"
                  style={{ height: `${height}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 sm:gap-3">
        {daily.map((day) => (
          <div
            key={day.date}
            className="w-8 min-w-8 shrink-0 whitespace-nowrap text-center text-[10px] text-neutral-400"
            title={day.date}
          >
            {formatDate(day.date)}
          </div>
        ))}
      </div>
    </div>
  </div>

  <p className="mt-5 text-xs leading-5 text-neutral-500">
    Each employee is counted once per date, even if they started multiple
    sessions. Dates with no recorded sessions are shown as zero.
  </p>
</div>

                )}
              </div>

              <div className={`${panel} p-5 md:p-6`}>
                <h2 className="text-lg font-semibold">Reporting health</h2>
                <p className={`mt-1 ${muted}`}>
                  Hourly report status summary
                </p>

                <div className="mt-7 flex items-center gap-5">
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[8px] border-white/[0.07]">
                    <div
                      className="absolute inset-[-8px] rounded-full border-[8px] border-emerald-400"
                      style={{
                        clipPath:
                          reportRate == null
                            ? "inset(0 0 0 0)"
                            : `polygon(50% 50%, 50% 0%, ${reportRate >= 50 ? "100% 0%, 100% 100%, " : ""}${reportRate >= 25 ? "50% 100%, " : ""}${reportRate >= 12.5 ? "0% 100%, " : ""}${reportRate >= 0 ? "0% 0%" : "50% 0%"})`,
                        opacity: reportRate == null ? 0.15 : 0.9,
                      }}
                    />
                    <span className="text-xl font-semibold">
                      {reportValue}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-200">
                      {reportRate == null
                        ? "No report data"
                        : reportRate >= 90
                          ? "High submission rate"
                          : reportRate >= 70
                            ? "Moderate submission rate"
                            : "Submission rate needs context"}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      This percentage compares submitted reports with submitted
                      and draft reports. It does not count reports that were
                      never created.
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-sm font-medium">How to interpret this</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-500">
                    Use this rate as a status indicator, not as a complete
                    compliance measure. To calculate expected versus missing
                    reports, NexScope needs an expected-report schedule.
                  </p>
                </div>
              </div>
            </section>

            <section className={`${panel} overflow-hidden`}>
              <div className="flex flex-col gap-2 border-b border-white/[0.07] p-5 md:flex-row md:items-center md:justify-between md:px-6">
                <div>
                  <h2 className="text-lg font-semibold">Team summaries</h2>
                  <p className={`mt-1 ${muted}`}>
                    Aggregated sessions and recorded activity
                  </p>
                </div>
                <span className="text-xs text-neutral-500">
                  {visibleTeams.length} visible · {hiddenCount} hidden
                </span>
              </div>

              {teams.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-neutral-300">No team summaries available</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    Team metrics will appear when session data is available.
                  </p>
                </div>
              ) : (
                <div className="grid gap-px bg-white/[0.06] md:grid-cols-2">
                  {teams.map((team) => (
                    <article
                      key={team.team}
                      className="bg-[#111318] p-5 md:p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-white">{team.team}</h3>
                          <p className="mt-1 text-xs text-neutral-500">
                            {team.hidden
                              ? `Hidden to protect teams below ${data.minTeam} people`
                              : `${team.people} people represented`}
                          </p>
                        </div>
                        {team.hidden ? (
                          <span className="rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1 text-xs text-amber-200">
                            Protected
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1 text-xs text-emerald-200">
                            Aggregated
                          </span>
                        )}
                      </div>

                      {team.hidden ? (
                        <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                          <p className="text-sm text-neutral-400">
                            Team metrics are not displayed because the
                            configured minimum team size has not been met.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-white/[0.035] p-3">
                              <p className="text-xs text-neutral-500">Sessions</p>
                              <p className="mt-1 text-xl font-semibold">
                                {team.sessions}
                              </p>
                            </div>
                            <div className="rounded-xl bg-white/[0.035] p-3">
                              <p className="text-xs text-neutral-500">Avg. duration</p>
                              <p className="mt-1 text-xl font-semibold">
                                {formatDuration(team.avgSessionMin)}
                              </p>
                            </div>
                            <div className="rounded-xl bg-white/[0.035] p-3">
                              <p className="text-xs text-neutral-500">Remote sessions</p>
                              <p className="mt-1 text-xl font-semibold">
                                {team.remoteSessions}
                              </p>
                            </div>
                            <div className="rounded-xl bg-white/[0.035] p-3">
                              <p className="text-xs text-neutral-500">Recorded active time</p>
                              <p className="mt-1 text-xl font-semibold">
                                {team.activePct}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-5">
                            <div className="mb-2 flex justify-between gap-3 text-xs">
                              <span className="text-neutral-400">
                                Active share of recorded active + idle time
                              </span>
                              <span className="text-neutral-300">
                                {team.activePct}%
                              </span>
                            </div>
                            <div
                              className="h-2 overflow-hidden rounded-full bg-white/[0.07]"
                              role="progressbar"
                              aria-label={`${team.team} recorded active-time percentage`}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={Math.max(0, Math.min(100, team.activePct))}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                                style={{
                                  width: `${Math.max(0, Math.min(100, team.activePct))}%`,
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className={`${panel} p-5`}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                    i
                  </span>
                  <div>
                    <h2 className="font-medium">What active time means</h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                      Active-time percentage is calculated from recorded active
                      and idle minutes. It is not a productivity score and
                      should not be used alone to evaluate work quality.
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${panel} p-5`}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                    ◈
                  </span>
                  <div>
                    <h2 className="font-medium">Privacy and data coverage</h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                      Small-team statistics remain hidden. Daily attendance
                      is organization-wide, while team session totals include
                      visible teams only. A missing chart date means no session
                      start was returned for that date, not necessarily that
                      nobody was scheduled to work.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <footer className="border-t border-white/[0.07] pt-5 text-xs leading-5 text-neutral-500">
              Analytics are based on recorded workforce data for the selected
              period. Interpret metrics in context; missing records are not
              proof of absence or non-compliance.
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
