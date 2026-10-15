
"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

const card = "rounded-2xl border border-white/10 bg-neutral-900 p-4";
const inp = "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm";

const COLOR: Record<string, string> = {
  OFFICE: "#34d399",
  REMOTE: "#60a5fa",
  OUTSIDE: "#f87171",
  UNKNOWN: "#9ca3af",
};

const FLAG: Record<string, string> = {
  LOCATION_UNKNOWN: "Location unknown",
  AGENT_OFFLINE: "Agent offline",
};

function locationAge(updatedAt: string | number | Date) {
  const timestamp = new Date(updatedAt).getTime();

  if (!Number.isFinite(timestamp)) return "update time unavailable";

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));

  if (minutes < 1) return "updated less than a minute ago";
  if (minutes === 1) return "updated 1 minute ago";

  return `updated ${minutes} minutes ago`;
}

export default function LiveMap() {
  const router = useRouter();

  const [d, setD] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const el = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const layer = useRef<any>(null);
  const LRef = useRef<any>(null);

  const load = useCallback(async () => {
    try {
      const r = await api("/admin/live");
      setD(r);

      setForm((f: any) =>
        f ??
        (r.office
          ? {
              lat: String(r.office.lat),
              lng: String(r.office.lng),
              radiusM: String(r.office.radiusM),
              ips: r.office.allowedIps.join(", "),
            }
          : { lat: "", lng: "", radiusM: "150", ips: "" }),
      );
    } catch (e: any) {
      if (e.status === 401) router.push("/workforce/login");
      else if (e.status === 403) router.push("/workforce");
    }
  }, [router]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, [load]);

  // Create the map once the office location is available.
  useEffect(() => {
    if (!d?.office || map.current || !el.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !el.current) return;

      LRef.current = L;

      const instance = L.map(el.current).setView(
        [d.office.lat, d.office.lng],
        17,
      );

      map.current = instance;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(instance);

      layer.current = L.layerGroup().addTo(instance);

      setD((current: any) => (current ? { ...current } : current));
    })();

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      layer.current = null;
      LRef.current = null;
    };
    // Map creation is tied to the office coordinates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d?.office?.lat, d?.office?.lng]);

  const focusEmployee = (employee: any) => {
    if (!map.current || !employee.position) return;

    setSelectedEmployee(employee.employeeId);

    map.current.flyTo(
      [employee.position.lat, employee.position.lng],
      17,
      { duration: 1.2 },
    );
  };

  const focusOffice = () => {
    if (!map.current || !d?.office) return;

    setSelectedEmployee(null);

    map.current.flyTo([d.office.lat, d.office.lng], 17, {
      duration: 1.2,
    });
  };

  // Redraw markers when data or employee selection changes.
  useEffect(() => {
    const L = LRef.current;

    if (!L || !layer.current || !d?.office) return;

    layer.current.clearLayers();

    L.circle([d.office.lat, d.office.lng], {
      radius: d.office.radiusM,
      color: "#818cf8",
      weight: 2,
      dashArray: "6",
      fillOpacity: 0.08,
    }).addTo(layer.current);

    d.rows.forEach((r: any) => {
      if (!r.position) return;

      const isStale = r.flags?.includes("LOCATION_UNKNOWN") ?? false;
      const isSelected = selectedEmployee === r.employeeId;

      const zoneColor = COLOR[r.position.zone] ?? COLOR.UNKNOWN;
      const markerColor = isStale ? "#fbbf24" : zoneColor;

      // Keep the last known accuracy ring visible, but fade it if stale.
      L.circle([r.position.lat, r.position.lng], {
        radius: Math.max(0, Number(r.position.accM) || 0),
        color: markerColor,
        weight: 1,
        opacity: isStale ? 0.7 : 0.4,
        dashArray: isStale ? "4 5" : undefined,
        fillOpacity: isStale ? 0.025 : 0.08,
      }).addTo(layer.current);

      const marker = L.circleMarker(
        [r.position.lat, r.position.lng],
        {
          radius: isSelected ? 11 : 8,
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: isStale ? 0.55 : 0.9,
          weight: isSelected ? 4 : 2,
          dashArray: isStale ? "4 3" : undefined,
        },
      );

      const status = isStale ? " · LOCATION STALE" : "";
      const tooltipName = String(r.name).replace(/[&<>"']/g, "");
      const tooltipText =
        `${tooltipName} · ${String(r.position.zone).toLowerCase()}${status}`;

      marker
        .bindTooltip(tooltipText)
        .on("click", () => focusEmployee(r))
        .addTo(layer.current);

      if (isSelected) {
        const safeName = String(r.name).replace(/[&<>"']/g, "");
        const age = locationAge(r.position.updatedAt);
        const popupStatus = isStale
          ? "<br/><strong>LOCATION STALE</strong>"
          : "<br/>Location status: recent";

        marker
          .bindPopup(
            `<strong>${safeName}</strong><br/>` +
              `${String(r.position.zone).toLowerCase()}<br/>` +
              `${age}${popupStatus}`,
          )
          .openPopup();
      }
    });
  }, [d, selectedEmployee]);

  const resolve = async (id: string) => {
    try {
      await api(`/admin/alerts/${id}`, {
        method: "PATCH",
        body: {},
      });
      await load();
    } catch (e: any) {
      setMsg(e.message || "Could not resolve alert");
    }
  };

  const saveOffice = async () => {
    setMsg("");

    try {
      await api("/admin/office", {
        method: "PATCH",
        body: {
          lat: Number(form.lat),
          lng: Number(form.lng),
          radiusM: Number(form.radiusM),
          allowedIps: form.ips
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
        },
      });

      setMsg("Office saved");

      map.current?.remove();
      map.current = null;
      layer.current = null;
      LRef.current = null;

      await load();
    } catch (e: any) {
      setMsg(e.message || "Could not save office settings");
    }
  };

  if (!d) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-neutral-400">
        Loading…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-4 text-neutral-100 md:p-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Live Locations</h1>
            <p className="text-sm text-neutral-400">
              Open work sessions only · latest known position · employees can
              see what is recorded about them
            </p>
          </div>

          <a className="text-sm text-indigo-300" href="/workforce/admin">
            ← Command Center
          </a>
        </header>

        {d.office ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-neutral-400">
                {selectedEmployee
                  ? "Viewing selected employee location"
                  : "Viewing office location"}
              </p>

              <button
                type="button"
                onClick={focusOffice}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
              >
                Back to Office
              </button>
            </div>

            <div
              ref={el}
              className="h-[420px] w-full rounded-2xl border border-white/10"
            />
          </div>
        ) : (
          <div className={card + " text-sm text-neutral-400"}>
            Set the office location below to see the map.
          </div>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-400">
          <span>
            <span className="text-emerald-400">●</span> Office
          </span>
          <span>
            <span className="text-blue-400">●</span> Approved remote
          </span>
          <span>
            <span className="text-red-400">●</span> Outside
          </span>
          <span>
            <span className="text-amber-300">◌</span> Location stale
          </span>
          <span>Dashed circle = office geofence</span>
          <span>Thin ring = GPS accuracy</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className={card + " space-y-2"}>
            <b>Working now ({d.rows.length})</b>

            {d.rows.length === 0 && (
              <p className="text-sm text-neutral-400">
                Nobody has an open session.
              </p>
            )}

            {d.rows.map((r: any) => {
              const isStale =
                r.flags?.includes("LOCATION_UNKNOWN") ?? false;

              return (
                <div
                  key={r.employeeId}
                  role={r.position ? "button" : undefined}
                  tabIndex={r.position ? 0 : undefined}
                  onClick={() => focusEmployee(r)}
                  onKeyDown={(e) => {
                    if (
                      r.position &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      focusEmployee(r);
                    }
                  }}
                  className={`rounded-lg border p-2 text-sm ${
                    isStale
                      ? "border-amber-400/40 bg-amber-400/5"
                      : "border-white/10"
                  } ${
                    r.position
                      ? "cursor-pointer transition hover:border-indigo-400 hover:bg-white/5"
                      : "opacity-70"
                  } ${
                    selectedEmployee === r.employeeId
                      ? "border-indigo-400 bg-indigo-500/10"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>{r.name}</b>

                    <span
                      style={{
                        color: isStale
                          ? "#fbbf24"
                          : COLOR[r.position?.zone ?? "UNKNOWN"],
                      }}
                    >
                      {isStale
                        ? "location stale"
                        : (r.position?.zone ?? "UNKNOWN").toLowerCase()}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-400">
                    {r.team} · since{" "}
                    {new Date(r.startedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {r.position
                      ? ` · ±${r.position.accM} m · ${locationAge(r.position.updatedAt)}`
                      : " · no location recorded yet"}
                    {r.position?.netMatch === true
                      ? " · office network ✓"
                      : r.position?.netMatch === false
                        ? " · not on office network"
                        : ""}
                  </div>

                  {r.flags?.map((f: string) => (
                    <div
                      key={f}
                      className={`text-xs ${
                        f === "LOCATION_UNKNOWN"
                          ? "text-amber-300"
                          : "text-red-300"
                      }`}
                    >
                      ⚠ {FLAG[f] ?? f}
                    </div>
                  ))}

                  {isStale && (
                    <p className="mt-1 text-xs text-amber-200/80">
                      This is the last known position, not a confirmed current
                      location. The work session remains open.
                    </p>
                  )}
                </div>
              );
            })}
          </section>

          <section className={card + " space-y-2"}>
            <b>Open alerts ({d.alerts.length})</b>

            {d.alerts.length === 0 && (
              <p className="text-sm text-neutral-400">No open alerts.</p>
            )}

            {d.alerts.map((a: any) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-2 text-sm"
              >
                <span>
                  <b>{a.employee}</b> — {a.message}
                  <div className="text-xs text-neutral-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                </span>

                <button
                  className="text-xs text-indigo-300"
                  onClick={() => resolve(a.id)}
                >
                  Resolve
                </button>
              </div>
            ))}
          </section>
        </div>

        <details className={card}>
          <summary className="cursor-pointer font-medium">
            Office settings
          </summary>

          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <input
              className={inp}
              placeholder="Latitude"
              value={form?.lat ?? ""}
              onChange={(e) =>
                setForm({ ...form, lat: e.target.value })
              }
            />

            <input
              className={inp}
              placeholder="Longitude"
              value={form?.lng ?? ""}
              onChange={(e) =>
                setForm({ ...form, lng: e.target.value })
              }
            />

            <input
              className={inp}
              placeholder="Radius (m)"
              value={form?.radiusM ?? ""}
              onChange={(e) =>
                setForm({ ...form, radiusM: e.target.value })
              }
            />

            <input
              className={inp}
              placeholder="Office public IPs, comma separated"
              value={form?.ips ?? ""}
              onChange={(e) =>
                setForm({ ...form, ips: e.target.value })
              }
            />
          </div>

          <p className="mt-2 text-xs text-neutral-400">
            Your current address as the server sees it:{" "}
            <b>{d.yourIp}</b>. Use it only if you are on the office network.
            Office IPs are a secondary signal; configure them only if the
            office has a fixed public IP.
          </p>

          <button
            className="mt-2 rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-medium"
            onClick={saveOffice}
          >
            Save office
          </button>

          {msg && (
            <span className="ml-3 text-sm text-indigo-300">{msg}</span>
          )}
        </details>
      </div>
    </main>
  );
}
