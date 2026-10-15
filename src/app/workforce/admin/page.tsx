"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

const dur = (m: number) =>
  `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

const card =
  "rounded-2xl border border-white/10 bg-neutral-900 p-4";

const inp =
  "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500";

type LocationHold = {
  id: string;
  employeeId: string;
  sessionId: string;
  startedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  explanation: string | null;
  submittedAt: string | null;
  decisionNote: string | null;
  employee: {
    name: string;
    email: string;
    team: string;
  } | null;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [ov, setOv] = useState<any>(null);
  const [reqs, setReqs] = useState<any[]>([]);
  const [holds, setHolds] = useState<LocationHold[]>([]);
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [reviewingHold, setReviewingHold] = useState<string | null>(null);

  const [nf, setNf] = useState({
    name: "",
    email: "",
    team: "General",
    password: "",
  });

  const load = useCallback(async () => {
    try {
      const [overview, requests, holdData] = await Promise.all([
        api("/admin/overview"),
        api("/remote-requests"),
        api("/admin/holds"),
      ]);

      setOv(overview);
      setReqs(requests.requests ?? []);
      setHolds(holdData.holds ?? []);
    } catch (e: any) {
      if (e.status === 401) {
        router.push("/workforce/login");
      } else if (e.status === 403) {
        router.push("/workforce");
      } else {
        setMsg(e.message || "Unable to refresh workforce data.");
      }
    }
  }, [router]);

  useEffect(() => {
    load();

    const timer = setInterval(load, 10000);

    return () => clearInterval(timer);
  }, [load]);

  const run = async (
    fn: () => Promise<any>,
    ok: string
  ) => {
    setMsg("");

    try {
      await fn();
      setMsg(ok);
      await load();
    } catch (e: any) {
      setMsg(e.message || "The action could not be completed.");
    }
  };

  const decide = (
    id: string,
    decision: "APPROVED" | "DENIED"
  ) =>
    run(
      () =>
        api(`/remote-requests/${id}`, {
          method: "PATCH",
          body: {
            decision,
            hours: 8,
          },
        }),
      `Request ${decision.toLowerCase()}`
    );

  const decideHold = async (
    id: string,
    decision: "APPROVE" | "REJECT"
  ) => {
    setMsg("");
    setReviewingHold(id);

    try {
      await api(`/admin/holds/${id}`, {
        method: "PATCH",
        body: {
          decision,
          decisionNote: decisionNotes[id] ?? "",
        },
      });

      setMsg(
        decision === "APPROVE"
          ? "Location hold approved. Tracking can resume if the session is still open."
          : "Location hold rejected. Tracking remains on hold."
      );

      setDecisionNotes((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });

      await load();
    } catch (e: any) {
      setMsg(e.message || "Unable to review the location hold.");
    } finally {
      setReviewingHold(null);
    }
  };

  const add = () =>
    run(
      async () => {
        await api("/admin/employees", {
          body: nf,
        });

        setNf({
          name: "",
          email: "",
          team: "General",
          password: "",
        });
      },
      "Employee created — they set up 2FA at first sign-in"
    );

  const toggle = (id: string) =>
    run(
      () =>
        api(`/admin/employees/${id}`, {
          method: "PATCH",
          body: {
            active: false,
          },
        }),
      "Employee disabled"
    );

  const logout = async () => {
    await api("/auth/logout", {
      body: {},
    });

    router.push("/workforce/login");
  };

  if (!ov) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-neutral-400">
        Loading…
        {msg && <p className="mt-3 text-sm text-amber-400">{msg}</p>}
      </main>
    );
  }

  const pending = reqs.filter(
    (request) => request.status === "PENDING"
  );

  const pendingHolds = holds.filter(
    (hold) => hold.status === "PENDING"
  );

  const rejectedHolds = holds.filter(
    (hold) => hold.status === "REJECTED"
  );

  return (
    <main className="min-h-screen bg-neutral-950 p-4 text-neutral-100 md:p-8">
      <div className="mx-auto max-w-5xl space-y-4">

        {/* HEADER */}
        <header className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              Command Center
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Workforce operations and monitoring
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a
              href="/workforce"
              className="rounded-lg px-3 py-2 text-indigo-300 transition hover:bg-white/5 hover:text-indigo-200"
            >
              My dashboard
            </a>

            <a
              href="/workforce/admin/reports"
              className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white transition hover:bg-indigo-400"
            >
              Hourly Reports
            </a>

            <button
              className="rounded-lg px-3 py-2 text-neutral-400 transition hover:bg-white/5 hover:text-white"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* QUICK NAVIGATION */}
        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/workforce/admin/reports"
            className="group rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 transition hover:border-indigo-400/60 hover:bg-indigo-500/15"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">
                  Hourly Reports
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                  Review employee work reports, activity, projects and uploaded evidence.
                </p>
              </div>
              <span className="text-xl text-indigo-300 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </a>

          <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
            <p className="font-semibold text-white">
              Workforce Overview
            </p>
            <p className="mt-1 text-sm text-neutral-400">
              Live attendance, desktop agent status and remote-work requests.
            </p>
          </div>

          <a
            href="/workforce/admin/live"
            className="group rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 transition hover:border-emerald-400/60 hover:bg-emerald-500/10"
          >
            <p className="font-semibold text-white">Live Location</p>
            <p className="mt-1 text-sm text-neutral-400">
              View active-session locations, office zones and location alerts.
            </p>
          </a>

          <a
            href="/workforce/admin/analytics"
            className="group rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4 transition hover:border-indigo-400/60 hover:bg-indigo-500/10"
          >
            <p className="font-semibold text-white">Workforce Analytics</p>
            <p className="mt-1 text-sm text-neutral-400">
              Review team-level attendance, session and reporting metrics.
            </p>
          </a>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Working", ov.counts.working, "text-emerald-400"],
            ["Checked out", ov.counts.out, "text-amber-400"],
            ["Offline", ov.counts.offline, "text-neutral-400"],
            ["Pending requests", ov.counts.pendingRequests, "text-indigo-300"],
          ].map(([key, value, color]: any) => (
            <div key={key} className={card}>
              <p className="text-xs text-neutral-400">{key}</p>
              <p className={`text-3xl font-semibold ${color}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* MESSAGE */}
        {msg && (
          <p className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-sm text-indigo-300">
            {msg}
          </p>
        )}

        {/* LOCATION HOLD REVIEW */}
        <section className={card + " space-y-4"}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold">Location Hold Review</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Review explanations from employees who left the office geofence during an office-based session.
              </p>
            </div>

            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-300">
              {pendingHolds.length} pending
            </span>
          </div>

          {holds.length === 0 && (
            <p className="rounded-lg border border-white/5 bg-white/[0.02] p-4 text-sm text-neutral-400">
              No active location holds.
            </p>
          )}

          {pendingHolds.map((hold) => (
            <article
              key={hold.id}
              className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {hold.employee?.name ?? "Unknown employee"}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {hold.employee?.email ?? hold.employeeId}
                  </p>
                  <p className="text-sm text-neutral-400">
                    Team: {hold.employee?.team ?? "Unknown"}
                  </p>
                </div>

                <span className="rounded-full border border-amber-500/30 px-2 py-1 text-xs text-amber-300">
                  {hold.submittedAt ? "Explanation submitted" : "Awaiting explanation"}
                </span>
              </div>

              <div className="text-sm text-neutral-400">
                <p>
                  Hold started:{" "}
                  {new Date(hold.startedAt).toLocaleString()}
                </p>
                <p className="mt-1">
                  Session ID: <span className="font-mono text-xs">{hold.sessionId}</span>
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Employee explanation
                </p>
                <p className="whitespace-pre-wrap text-sm">
                  {hold.explanation || "The employee has not submitted an explanation yet."}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-neutral-400">
                  Decision note (optional)
                </label>
                <textarea
                  className={inp + " min-h-20 w-full"}
                  maxLength={1000}
                  placeholder="Add a note explaining this decision..."
                  value={decisionNotes[hold.id] ?? ""}
                  onChange={(event) =>
                    setDecisionNotes((previous) => ({
                      ...previous,
                      [hold.id]: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    !hold.explanation?.trim() ||
                    !hold.submittedAt ||
                    reviewingHold !== null
                  }
                  onClick={() => decideHold(hold.id, "APPROVE")}
                >
                  {reviewingHold === hold.id ? "Reviewing…" : "Approve & Resume"}
                </button>

                <button
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    !hold.explanation?.trim() ||
                    !hold.submittedAt ||
                    reviewingHold !== null
                  }
                  onClick={() => decideHold(hold.id, "REJECT")}
                >
                  Reject & Keep on Hold
                </button>
              </div>

              {(!hold.explanation || !hold.submittedAt) && (
                <p className="text-xs text-neutral-500">
                  Review actions become available after the employee submits an explanation.
                </p>
              )}
            </article>
          ))}

          {rejectedHolds.length > 0 && (
            <div className="space-y-2 border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium text-red-300">
                Rejected holds still active ({rejectedHolds.length})
              </h3>
              <p className="text-xs text-neutral-400">
                These sessions remain held. Returning to the office does not resume tracking, and rejected holds require a separate explicit resolution workflow.
              </p>

              {rejectedHolds.map((hold) => (
                <div
                  key={hold.id}
                  className="rounded-lg border border-red-500/20 p-3 text-sm"
                >
                  <p className="font-medium">
                    {hold.employee?.name ?? "Unknown employee"}
                  </p>
                  <p className="mt-1 text-neutral-400">
                    {hold.decisionNote || "No administrator decision note."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* WORKFORCE TABLE */}
        <div className={card + " overflow-x-auto"}>
          <div className="flex items-center justify-between">
            <b>Workforce</b>
            <a
              href="/workforce/admin/reports"
              className="text-sm text-indigo-300 hover:text-indigo-200"
            >
              View reports →
            </a>
          </div>

          <table className="mt-2 w-full min-w-[640px] text-sm">
            <thead className="text-left text-neutral-400">
              <tr>
                <th>Employee</th>
                <th>Team</th>
                <th>Status</th>
                <th>Since</th>
                <th>Active</th>
                <th>Idle</th>
                <th>Agent</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {ov.rows.map((r: any) => (
                <tr
                  key={r.id}
                  className="border-t border-white/5"
                >
                  <td>
                    {r.name}
                    {r.alert && (
                      <div className="text-xs text-amber-400">
                        ⚠ {r.alert}
                      </div>
                    )}
                  </td>

                  <td>{r.team}</td>

                  <td
                    className={
                      r.status === "working"
                        ? "text-emerald-400"
                        : "text-neutral-400"
                    }
                  >
                    {r.status}
                    {r.zone ? ` (${r.zone.toLowerCase()})` : ""}
                  </td>

                  <td>
                    {r.startedAt
                      ? new Date(r.startedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>

                  <td>{dur(r.activeMin)}</td>
                  <td>{dur(r.idleMin)}</td>

                  <td
                    className={
                      r.agentOnline
                        ? "text-emerald-400"
                        : "text-neutral-500"
                    }
                  >
                    {r.agentOnline ? "● online" : "○ offline"}
                  </td>

                  <td>
                    <button
                      className="text-xs text-red-400"
                      onClick={() => toggle(r.id)}
                    >
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REMOTE REQUESTS + ADD EMPLOYEE */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* REMOTE REQUESTS */}
          <div className={card + " space-y-2"}>
            <b>Remote work requests</b>

            {pending.length === 0 && (
              <p className="text-sm text-neutral-400">
                Nothing pending.
              </p>
            )}

            {pending.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-white/10 p-3 text-sm"
              >
                <p>
                  <b>{request.employee.name}</b> — {request.reason}
                </p>

                <div className="mt-2 flex gap-2">
                  <button
                    className="rounded bg-emerald-500 px-3 py-1"
                    onClick={() => decide(request.id, "APPROVED")}
                  >
                    Approve (8 h)
                  </button>

                  <button
                    className="rounded bg-white/10 px-3 py-1"
                    onClick={() => decide(request.id, "DENIED")}
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD EMPLOYEE */}
          <div className={card + " space-y-2"}>
            <b>Add employee</b>

            <input
              className={inp + " w-full"}
              placeholder="Full name"
              value={nf.name}
              onChange={(event) =>
                setNf({
                  ...nf,
                  name: event.target.value,
                })
              }
            />

            <input
              className={inp + " w-full"}
              type="email"
              placeholder="Email"
              autoComplete="off"
              value={nf.email}
              onChange={(event) =>
                setNf({
                  ...nf,
                  email: event.target.value,
                })
              }
            />

            <input
              className={inp + " w-full"}
              placeholder="Team"
              value={nf.team}
              onChange={(event) =>
                setNf({
                  ...nf,
                  team: event.target.value,
                })
              }
            />

            <input
              className={inp + " w-full"}
              type="password"
              placeholder="Temporary password (10+ characters)"
              autoComplete="new-password"
              value={nf.password}
              onChange={(event) =>
                setNf({
                  ...nf,
                  password: event.target.value,
                })
              }
            />

            <button
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium disabled:opacity-50"
              disabled={
                !nf.name.trim() ||
                !nf.email.trim() ||
                nf.password.length < 10
              }
              onClick={add}
            >
              Create employee
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}