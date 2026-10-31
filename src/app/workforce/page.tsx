"use client";

import LocationReporter from "@/components/workforce/location-reporter";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getPosition } from "@/lib/workforce/client";

type LocationHold = {
  status: string;
  decisionNote: string | null;
  submittedAt: string | null;
};

type OpenSession = {
  startedAt: string;
  active: number;
  idle: number;
  hold: LocationHold | null;
};

type Employee = {
  name: string;
  team: string;
  role: string;
};

type Device = {
  id: string;
  name: string;
  lastSeenAt: string | null;
};

type MeResponse = {
  employee: Employee;
  openSession: OpenSession | null;
  devices: Device[];
};

type AttendanceSession = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  active: number;
  idle: number;
  zone: string | null;
};

type HistoryResponse = {
  sessions: AttendanceSession[];
};

type PairDeviceResponse = {
  code: string;
  expiresAt: string;
};

type ApiErrorShape = {
  status?: number;
  message?: string;
};

function getError(error: unknown): ApiErrorShape {
  if (typeof error !== "object" || error === null) {
    return {};
  }

  const candidate = error as Record<string, unknown>;
  return {
    status:
      typeof candidate.status === "number" ? candidate.status : undefined,
    message:
      typeof candidate.message === "string" ? candidate.message : undefined,
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  const { message } = getError(error);
  return message || fallback;
}

const hms = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));

  return [s / 3600, (s / 60) % 60, s % 60]
    .map((n) => String(Math.floor(n)).padStart(2, "0"))
    .join(":");
};

const dur = (m: number) =>
  `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

const card = "rounded-2xl border border-white/10 bg-neutral-900 p-4";
const btn = "rounded-lg px-4 py-2 font-medium disabled:opacity-50";

export default function EmployeeDashboard() {
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [hist, setHist] = useState<AttendanceSession[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const [msg, setMsg] = useState<{
    t: "err" | "ok";
    s: string;
  } | null>(null);

  const [blocked, setBlocked] = useState(false);
  const [reason, setReason] = useState("");

  const [code, setCode] = useState<PairDeviceResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [holdBusy, setHoldBusy] = useState(false);

  const loadInProgressRef = useRef(false);
  const mountedRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const load = useCallback(async () => {
    if (loadInProgressRef.current) return;

    loadInProgressRef.current = true;

    try {
      const [profile, history] = await Promise.all([
        api<MeResponse>("/me"),
        api<HistoryResponse>("/sessions?limit=10"),
      ]);

      if (!mountedRef.current) return;

      setMe(profile);
      setHist(history.sessions);
      hasLoadedRef.current = true;
    } catch (error: unknown) {
      if (!mountedRef.current) return;

      const { status } = getError(error);

      if (status === 401) {
        router.push("/workforce/login");
      } else if (!hasLoadedRef.current) {
        setMsg({
          t: "err",
          s: getErrorMessage(
            error,
            "Unable to load your dashboard. Please try again.",
          ),
        });
      }
    } finally {
      loadInProgressRef.current = false;
    }
  }, [router]);

  useEffect(() => {
    mountedRef.current = true;

    void load();

    const refreshInterval = window.setInterval(() => {
      void load();
    }, 15000);

    const clockInterval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(refreshInterval);
      window.clearInterval(clockInterval);
    };
  }, [load]);


  async function act(fn: () => Promise<void>) {
    setMsg(null);
    setBusy(true);

    try {
      await fn();
      await load();
    } catch (error: unknown) {
      const { status } = getError(error);
      setMsg({
        t: "err",
        s: getErrorMessage(error, "The action could not be completed."),
      });

      if (status === 403) {
        setBlocked(true);
      }
    } finally {
      setBusy(false);
    }
  }

  const checkIn = () =>
    act(async () => {
      setBlocked(false);

      const position = await getPosition();

      await api("/session/start", {
        body: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        },
      });

      setMsg({
        t: "ok",
        s: "Checked in",
      });
    });

  const checkOut = () =>
    act(async () => {
      let body: { lat?: number; lng?: number; accuracy?: number } = {};

      try {
        const position = await getPosition();

        body = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
      } catch {
        // Checking out remains possible if location access is unavailable.
      }

      await api("/session/end", { body });

      setMsg({
        t: "ok",
        s: "Checked out — monitoring stopped",
      });
    });

  const requestRemote = () =>
    act(async () => {
      await api("/remote-requests", {
        body: { reason },
      });

      setBlocked(false);
      setReason("");

      setMsg({
        t: "ok",
        s: "Request sent to an administrator",
      });
    });

  const pair = () =>
    act(async () => {
      const pairing = await api<PairDeviceResponse>("/devices/pair", {
        method: "POST",
        body: {},
      });
      setCode(pairing);
    });

  const revoke = (id: string) =>
    act(async () => {
      await api(`/devices/${id}`, {
        method: "PATCH",
        body: {},
      });
    });

  const submitExplanation = async () => {
    setMsg(null);
    setHoldBusy(true);

    try {
      await api("/location-hold", {
        method: "POST",
        body: { explanation: explanation.trim() },
      });

      setExplanation("");
      setMsg({
        t: "ok",
        s: "Explanation submitted. Tracking remains on hold until an administrator reviews it.",
      });

      await load();
    } catch (error: unknown) {
      setMsg({
        t: "err",
        s: getErrorMessage(
          error,
          "Unable to submit your explanation."
        ),
      });
    } finally {
      setHoldBusy(false);
    }
  };

  const logout = async () => {
    try {
      await api("/auth/logout", { body: {} });
    } finally {
      router.push("/workforce/login");
    }
  };

  if (!me) {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-neutral-400">
      <div className="mx-auto max-w-lg space-y-4">
        {msg?.t === "err" ? (
          <>
            <h1 className="text-xl font-semibold text-red-400">
              Could not load your dashboard
            </h1>

            <p className="text-sm text-neutral-300">
              {msg.s}
            </p>

            <button
              type="button"
              onClick={() => {
                setMsg(null);
                void load();
              }}
              className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400"
            >
              Retry
            </button>
          </>
        ) : (
          <p>Loading your dashboard...</p>
        )}
      </div>
    </main>
  );
}

  const session = me.openSession;
  const hold = session?.hold ?? null;
  const holdActive = Boolean(hold && hold.status !== "APPROVED");

  return (
    <main className="min-h-screen bg-neutral-950 p-4 text-neutral-100 md:p-8">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">My Dashboard</h1>
            <p className="text-sm text-neutral-400">
              {me.employee.name} {me.employee.team}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link
              className="text-indigo-300 hover:text-indigo-200"
              href="/workforce/reports"
            >
              Reports
            </Link>

            {me.employee.role === "ADMIN" && (
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/workforce/admin"
              >
                Admin
              </Link>
            )}

            <button
              type="button"
              className="text-neutral-400 hover:text-white"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* SESSION STATUS */}
        <div
          className={`${card} flex items-center gap-3 ${
            session ? "border-emerald-500/40" : ""
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              session ? "bg-emerald-400" : "bg-neutral-500"
            }`}
          />
          <b>
            {session
              ? "Work session active — NexScope monitoring enabled."
              : "Work session ended — monitoring disabled."}
          </b>
        </div>

        {/* LOCATION HOLD */}
        {holdActive && (
          <div className={`${card} space-y-4 border-amber-500/40`}>
            <div>
              <h2 className="text-lg font-semibold text-amber-400">
                Location monitoring is on hold
              </h2>
              <p className="mt-1 text-sm text-neutral-300">
                You have left the office geofence. Your desktop agent must
                remain paused until an administrator approves your explanation.
              </p>
            </div>

            {hold?.decisionNote && (
              <p className="text-sm text-neutral-300">
                Admin note: {hold.decisionNote}
              </p>
            )}

            {hold?.submittedAt ? (
              <p className="text-sm text-amber-300">
                Your explanation has been submitted. Waiting for administrator
                review.
              </p>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void submitExplanation();
                }}
                className="space-y-3"
              >
                <label
                  className="block text-sm font-medium"
                  htmlFor="hold-explanation"
                >
                  Explain why you left the office
                </label>

                <textarea
                  id="hold-explanation"
                  value={explanation}
                  onChange={(event) => setExplanation(event.target.value)}
                  minLength={3}
                  maxLength={1000}
                  required
                  rows={4}
                  placeholder="Enter your explanation (3–1000 characters)"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-sm text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
                  disabled={holdBusy}
                />

                <button
                  type="submit"
                  disabled={holdBusy || explanation.trim().length < 3}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {holdBusy ? "Submitting..." : "Submit explanation"}
                </button>
              </form>
            )}
          </div>
        )}

        <LocationReporter active={Boolean(session) && !holdActive} />

        {/* SESSION STATS */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className={card}>
            <p className="text-xs text-neutral-400">Check-in</p>
            <p className="text-2xl font-semibold">
              {session
                ? new Date(session.startedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </p>
          </div>

          <div className={card}>
            <p className="text-xs text-neutral-400">Session</p>
            <p className="text-2xl font-semibold">
              {session
                ? hms(now - new Date(session.startedAt).getTime())
                : "00:00:00"}
            </p>
          </div>

          <div className={card}>
            <p className="text-xs text-neutral-400">Active (agent)</p>
            <p className="text-2xl font-semibold text-emerald-400">
              {dur(session?.active ?? 0)}
            </p>
          </div>

          <div className={card}>
            <p className="text-xs text-neutral-400">Idle (agent)</p>
            <p className="text-2xl font-semibold text-amber-400">
              {dur(session?.idle ?? 0)}
            </p>
          </div>
        </div>

        {/* CHECK IN / CHECK OUT */}
        <div className={`${card} space-y-3`}>
          {session ? (
            <button
              type="button"
              disabled={busy}
              onClick={checkOut}
              className={`${btn} bg-red-500`}
            >
              Check out
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={checkIn}
              className={`${btn} bg-indigo-500`}
            >
              Check in (uses your location)
            </button>
          )}

          <p className="text-xs text-neutral-400">
            Location is read only when you check in or out. Active/idle minutes
            come from the desktop agent.
          </p>

          {msg && (
            <p
              className={`text-sm ${
                msg.t === "err" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {msg.s}
            </p>
          )}

          {blocked && !session && (
            <div className="space-y-2 rounded-lg border border-amber-500/30 p-3">
              <p className="text-sm">
                Need to work remotely? Ask an administrator.
              </p>

              <textarea
                className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm"
                placeholder="Reason (e.g. client visit)"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />

              <button
                type="button"
                disabled={busy || reason.trim().length < 3}
                onClick={requestRemote}
                className={`${btn} bg-amber-500 text-black`}
              >
                Request remote approval
              </button>
            </div>
          )}
        </div>

        {/* DESKTOP AGENT */}
        <div className={`${card} space-y-2`}>
          <div className="flex items-center justify-between">
            <b>My computers (desktop agent)</b>

            <button
              type="button"
              disabled={busy}
              onClick={pair}
              className={`${btn} bg-white/10 text-sm`}
            >
              Add this PC
            </button>
          </div>

          {code && (
            <p className="rounded-lg bg-indigo-500/10 p-3 text-sm">
              Enter this code in the agent within 10 minutes:{" "}
              <b className="font-mono text-lg tracking-widest">{code.code}</b>
            </p>
          )}

          {me.devices.length === 0 ? (
            <p className="text-sm text-neutral-400">No computer paired yet.</p>
          ) : (
            me.devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {device.name}{" "}
                  <span className="text-neutral-500">
                    last seen{" "}
                    {device.lastSeenAt
                      ? new Date(device.lastSeenAt).toLocaleTimeString()
                      : "never"}
                  </span>
                </span>

                <button
                  type="button"
                  className="text-red-400"
                  onClick={() => revoke(device.id)}
                >
                  Revoke
                </button>
              </div>
            ))
          )}
        </div>

        {/* RECENT ATTENDANCE */}
        <div className={card}>
          <b>Recent attendance</b>

          <table className="mt-2 w-full text-sm">
            <thead className="text-left text-neutral-400">
              <tr>
                <th>Date</th>
                <th>In</th>
                <th>Out</th>
                <th>Active</th>
                <th>Idle</th>
                <th>Zone</th>
              </tr>
            </thead>

            <tbody>
              {hist.map((attendance) => (
                <tr
                  key={attendance.id}
                  className="border-t border-white/5"
                >
                  <td>
                    {new Date(attendance.startedAt).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(attendance.startedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>
                    {attendance.endedAt
                      ? new Date(attendance.endedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "in progress"}
                  </td>

                  <td>{dur(attendance.active ?? 0)}</td>
                  <td>{dur(attendance.idle ?? 0)}</td>
                  <td>{attendance.zone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
