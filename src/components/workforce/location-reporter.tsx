
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, getPosition } from "@/lib/workforce/client";

type LocationEvent = {
  id: string;
  at: string;
  kind: string;
  distM: number;
  accM: number;
  result: string;
};

const REPORT_INTERVAL_MS = 5 * 60 * 1000;
const RETRY_DELAY_MS = 15 * 1000;

export default function LocationReporter({
  active,
}: {
  active: boolean;
}) {
  const [last, setLast] = useState<string | null>(null);
  const [zone, setZone] = useState("");
  const [err, setErr] = useState("");
  const [events, setEvents] = useState<LocationEvent[]>([]);
  const [retrying, setRetrying] = useState(false);

  const inFlight = useRef(false);
  const mounted = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const send = useCallback(async (): Promise<boolean> => {
    if (inFlight.current) return false;

    inFlight.current = true;

    try {
      const p = await getPosition();

      const r = await api<{ zone: string; nextPingSec: number }>(
        "/location/ping",
        {
          body: {
            lat: p.coords.latitude,
            lng: p.coords.longitude,
            accuracy: p.coords.accuracy,
          },
        },
      );

      setZone(r.zone.toLowerCase());

      if (r.zone === "UNKNOWN") {
        setErr(
          "Location received, but it could not be verified. The last known zone is preserved.",
        );
        setRetrying(false);
        return true;
      }

      setLast(new Date().toLocaleTimeString());
      setErr("");
      setRetrying(false);
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update location.";

      setErr(message);
      return false;
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    if (!active) {
      setRetrying(false);
      return () => {
        mounted.current = false;
      };
    }

    let cancelled = false;

    const clearTimer = () => {
      if (timer.current !== undefined) {
        window.clearTimeout(timer.current);
        timer.current = undefined;
      }
    };

    const schedule = (delay: number) => {
      clearTimer();
      if (cancelled || document.visibilityState !== "visible") return;

      timer.current = window.setTimeout(() => {
        timer.current = undefined;
        void run();
      }, delay);
    };

    const run = async () => {
      if (cancelled || document.visibilityState !== "visible") return;

      const success = await send();

      if (cancelled) return;

      schedule(success ? REPORT_INTERVAL_MS : RETRY_DELAY_MS);

      if (!success) setRetrying(true);
    };

    const refreshWhenActive = () => {
      if (document.visibilityState !== "visible") {
        clearTimer();
        return;
      }

      // A fresh ping on return prevents waiting for the old timer.
      void run();
    };

    document.addEventListener("visibilitychange", refreshWhenActive);
    window.addEventListener("focus", refreshWhenActive);
    window.addEventListener("online", refreshWhenActive);

    // Initial location ping.
    void run();

    return () => {
      cancelled = true;
      mounted.current = false;
      clearTimer();
      document.removeEventListener("visibilitychange", refreshWhenActive);
      window.removeEventListener("focus", refreshWhenActive);
      window.removeEventListener("online", refreshWhenActive);
    };
  }, [active, send]);

  useEffect(() => {
    if (!active) {
      setEvents([]);
      return;
    }

    let cancelled = false;

    const loadEvents = async () => {
      try {
        const r = await api<{ events: LocationEvent[] }>("/location/mine");
        if (!cancelled) setEvents(r.events ?? []);
      } catch {
        // Event history is optional; do not interrupt location reporting.
      }
    };

    void loadEvents();
    const timer = window.setInterval(loadEvents, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [active]);

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-white">📍 Location sharing</h2>
        <span
          className={`text-xs ${
            active ? "text-emerald-400" : "text-neutral-400"
          }`}
        >
          {active ? "ON — active work session only" : "OFF"}
        </span>
      </div>

      <p className="mt-2 text-xs text-neutral-400">
        While your work session is active, the browser attempts to update
        your location every five minutes and when you return to this tab.
        Temporary failures are retried after 15 seconds while the page is
        visible. Only the latest position is intended to be stored.
      </p>

      {active && (
        <p className="mt-2 text-sm text-neutral-300">
          {last
            ? `Last successful update ${last} · zone: ${zone}`
            : "Waiting for the first successful location update…"}
        </p>
      )}

      {active && retrying && (
        <p className="mt-2 text-sm text-amber-400">
          Location update failed. Retrying in 15 seconds.
        </p>
      )}

      {active && err && (
        <p className="mt-1 text-sm text-amber-400">{err}</p>
      )}

      {active && events.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-neutral-400">
            Records administrators can see about you:
          </p>
          <ul className="mt-1 space-y-1 text-xs text-neutral-300">
            {events.slice(0, 6).map((event) => (
              <li key={event.id}>
                {new Date(event.at).toLocaleString()} ·{" "}
                {event.kind.toLowerCase().replace("_", " ")} ·{" "}
                {event.distM} m (±{event.accM} m) ·{" "}
                {event.result.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
