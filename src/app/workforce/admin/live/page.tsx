
"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
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

type LivePosition = {
  lat: number;
  lng: number;
  accM: number;
  zone: string;
  netMatch: boolean | null;
  updatedAt: string;
};

type LiveRow = {
  employeeId: string;
  name: string;
  team: string;
  startedAt: string;
  sessionZone: string;
  position: LivePosition | null;
  flags: string[];
};

type LiveAlert = {
  id: string;
  employee: string;
  kind: string;
  message: string;
  createdAt: string;
};

type Office = {
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  allowedIps: string[];
};

type LiveData = {
  office: Office | null;
  yourIp: string;
  rows: LiveRow[];
  alerts: LiveAlert[];
};

type OfficeForm = {
  lat: string;
  lng: string;
  radiusM: string;
  ips: string;
};

function errorStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return undefined;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function locationAge(updatedAt: string | number | Date): string {
  const timestamp = new Date(updatedAt).getTime();

  if (!Number.isFinite(timestamp)) return "update time unavailable";

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 60_000),
  );

  if (minutes < 1) return "updated less than a minute ago";
  if (minutes === 1) return "updated 1 minute ago";

  return `updated ${minutes} minutes ago`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character] ?? character;
  });
}

function officeFormFromData(office: Office | null): OfficeForm {
  if (!office) {
    return { lat: "", lng: "", radiusM: "150", ips: "" };
  }

  return {
    lat: String(office.lat),
    lng: String(office.lng),
    radiusM: String(office.radiusM),
    ips: office.allowedIps.join(", "),
  };
}

export default function LiveMap() {
  const router = useRouter();

  const [d, setD] = useState<LiveData | null>(null);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<OfficeForm | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapVersion, setMapVersion] = useState(0);

  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await api<LiveData>("/admin/live");

      setD(result);
      setForm((current) => current ?? officeFormFromData(result.office));
    } catch (error: unknown) {
      const status = errorStatus(error);

      if (status === 401) {
        router.push("/workforce/login");
      } else if (status === 403) {
        router.push("/workforce");
      } else {
        setMsg(errorMessage(error, "Could not load live locations"));
      }
    }
  }, [router]);

  // Load immediately and refresh every 15 seconds.
  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      if (cancelled) return;
      await load();
    };

    void refresh();

    const timer = window.setInterval(() => {
      void refresh();
    }, 15_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [load]);

  const officeLat = d?.office?.lat;
  const officeLng = d?.office?.lng;

  // Initialize Leaflet only after the office coordinates and map container exist.
  useEffect(() => {
    if (
      officeLat == null ||
      officeLng == null ||
      !el.current
    ) {
      setMapReady(false);
      return;
    }

    let cancelled = false;
    let createdMap: LeafletMap | null = null;

    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        if (cancelled || !el.current) return;

        const instance = L.map(el.current).setView(
          [officeLat, officeLng],
          17,
        );

        createdMap = instance;
        map.current = instance;
        LRef.current = L;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(instance);

        layer.current = L.layerGroup().addTo(instance);

        if (!cancelled) {
          setMapReady(true);
        }
      } catch {
        if (!cancelled) {
          setMsg("Could not initialize the map. Please refresh the page.");
        }
      }
    };

    void initializeMap();

    return () => {
      cancelled = true;

      createdMap?.remove();

      if (map.current === createdMap) {
        map.current = null;
        layer.current = null;
        LRef.current = null;
      }
    };
  }, [officeLat, officeLng, mapVersion]);

  const focusEmployee = useCallback((employee: LiveRow) => {
    const position = employee.position;

    if (!map.current || !position) return;

    setSelectedEmployee(employee.employeeId);

    map.current.flyTo([position.lat, position.lng], 17, {
      duration: 1.2,
    });
  }, []);

  const focusOffice = () => {
  if (!map.current || !d?.office) return;

  setSelectedEmployee(null);

  map.current.flyTo([d.office.lat, d.office.lng], 17, {
    duration: 1.2,
  });
};

  // Redraw the geofence, accuracy rings, markers and selected employee popup.
  useEffect(() => {
    const L = LRef.current;
    const currentLayer = layer.current;
    const office = d?.office;

    if (!mapReady || !L || !currentLayer || !office) return;

    currentLayer.clearLayers();

    L.circle([office.lat, office.lng], {
      radius: office.radiusM,
      color: "#818cf8",
      weight: 2,
      dashArray: "6",
      fillOpacity: 0.08,
    }).addTo(currentLayer);

    d.rows.forEach((row) => {
      const position = row.position;

      if (!position) return;

      const isStale = row.flags.includes("LOCATION_UNKNOWN");
      const isSelected = selectedEmployee === row.employeeId;
      const zoneColor = COLOR[position.zone] ?? COLOR.UNKNOWN;
      const markerColor = isStale ? "#fbbf24" : zoneColor;

      L.circle([position.lat, position.lng], {
        radius: Math.max(0, Number(position.accM) || 0),
        color: markerColor,
        weight: 1,
        opacity: isStale ? 0.7 : 0.4,
        dashArray: isStale ? "4 5" : undefined,
        fillOpacity: isStale ? 0.025 : 0.08,
      }).addTo(currentLayer);

      const marker = L.circleMarker(
        [position.lat, position.lng],
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
      const tooltipText =
        `${escapeHtml(row.name)} · ` +
        `${escapeHtml(position.zone.toLowerCase())}${status}`;

      marker
        .bindTooltip(tooltipText)
        .on("click", () => focusEmployee(row))
        .addTo(currentLayer);

      if (isSelected) {
        const age = locationAge(position.updatedAt);
        const popupStatus = isStale
          ? "<br/><strong>LOCATION STALE</strong>"
          : "<br/>Location status: recent";

        marker
          .bindPopup(
            `<strong>${escapeHtml(row.name)}</strong><br/>` +
              `${escapeHtml(position.zone.toLowerCase())}<br/>` +
              `${escapeHtml(age)}${popupStatus}`,
          )
          .openPopup();
      }
    });
  }, [d, selectedEmployee, mapReady, focusEmployee]);

  const resolve = async (id: string) => {
    setMsg("");

    try {
      await api(`/admin/alerts/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: {},
      });

      await load();
      setMsg("Alert resolved");
    } catch (error: unknown) {
      setMsg(errorMessage(error, "Could not resolve alert"));
    }
  };

  const saveOffice = async () => {
    if (!form) return;

    const lat = Number(form.lat);
    const lng = Number(form.lng);
    const radiusM = Number(form.radiusM);

    if (
      !form.lat.trim() ||
      !form.lng.trim() ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      setMsg("Enter a valid latitude and longitude.");
      return;
    }

    if (
      !form.radiusM.trim() ||
      !Number.isFinite(radiusM) ||
      radiusM <= 0
    ) {
      setMsg("Enter a valid positive office radius.");
      return;
    }

    setMsg("");

    try {
      await api("/admin/office", {
        method: "PATCH",
        body: {
          lat,
          lng,
          radiusM,
          allowedIps: form.ips
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        },
      });

      setMsg("Office saved");

      // Recreate the map even if the office coordinates did not change.
      setMapReady(false);
      setMapVersion((version) => version + 1);

      await load();
    } catch (error: unknown) {
      setMsg(errorMessage(error, "Could not save office settings"));
    }
  };

  if (!d) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-neutral-400">
        {msg || "Loading…"}
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

          <a
            className="text-sm text-indigo-300"
            href="/workforce/admin"
          >
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
          <div className={`${card} text-sm text-neutral-400`}>
            Set the office location below to see the map.
          </div>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-400">
          <span><span className="text-emerald-400">●</span> Office</span>
          <span><span className="text-blue-400">●</span> Approved remote</span>
          <span><span className="text-red-400">●</span> Outside</span>
          <span><span className="text-amber-300">◌</span> Location stale</span>
          <span>Dashed circle = office geofence</span>
          <span>Thin ring = GPS accuracy</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className={`${card} space-y-2`}>
            <b>Working now ({d.rows.length})</b>

            {d.rows.length === 0 && (
              <p className="text-sm text-neutral-400">
                Nobody has an open session.
              </p>
            )}

            {d.rows.map((row) => {
              const isStale = row.flags.includes("LOCATION_UNKNOWN");

              return (
                <div
                  key={row.employeeId}
                  role={row.position ? "button" : undefined}
                  tabIndex={row.position ? 0 : undefined}
                  onClick={() => focusEmployee(row)}
                  onKeyDown={(event) => {
                    if (
                      row.position &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      focusEmployee(row);
                    }
                  }}
                  className={`rounded-lg border p-2 text-sm ${
                    isStale
                      ? "border-amber-400/40 bg-amber-400/5"
                      : "border-white/10"
                  } ${
                    row.position
                      ? "cursor-pointer transition hover:border-indigo-400 hover:bg-white/5"
                      : "opacity-70"
                  } ${
                    selectedEmployee === row.employeeId
                      ? "border-indigo-400 bg-indigo-500/10"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>{row.name}</b>

                    <span
                      style={{
                        color: isStale
                          ? "#fbbf24"
                          : COLOR[row.position?.zone ?? "UNKNOWN"],
                      }}
                    >
                      {isStale
                        ? "location stale"
                        : (row.position?.zone ?? "UNKNOWN").toLowerCase()}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-400">
                    {row.team} · since{" "}
                    {new Date(row.startedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {row.position
                      ? ` · ±${row.position.accM} m · ${locationAge(row.position.updatedAt)}`
                      : " · no location recorded yet"}
                    {row.position?.netMatch === true
                      ? " · office network ✓"
                      : row.position?.netMatch === false
                        ? " · not on office network"
                        : ""}
                  </div>

                  {row.flags.map((flag) => (
                    <div
                      key={flag}
                      className={`text-xs ${
                        flag === "LOCATION_UNKNOWN"
                          ? "text-amber-300"
                          : "text-red-300"
                      }`}
                    >
                      ⚠ {FLAG[flag] ?? flag}
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

          <section className={`${card} space-y-2`}>
            <b>Open alerts ({d.alerts.length})</b>

            {d.alerts.length === 0 && (
              <p className="text-sm text-neutral-400">No open alerts.</p>
            )}

            {d.alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-2 text-sm"
              >
                <span>
                  <b>{alert.employee}</b> — {alert.message}
                  <div className="text-xs text-neutral-400">
                    {new Date(alert.createdAt).toLocaleString()}
                  </div>
                </span>

                <button
                  type="button"
                  className="text-xs text-indigo-300"
                  onClick={() => void resolve(alert.id)}
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
              inputMode="decimal"
              value={form?.lat ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...(current ?? officeFormFromData(d.office)),
                  lat: event.target.value,
                }))
              }
            />

            <input
              className={inp}
              placeholder="Longitude"
              inputMode="decimal"
              value={form?.lng ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...(current ?? officeFormFromData(d.office)),
                  lng: event.target.value,
                }))
              }
            />

            <input
              className={inp}
              placeholder="Radius (m)"
              inputMode="decimal"
              value={form?.radiusM ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...(current ?? officeFormFromData(d.office)),
                  radiusM: event.target.value,
                }))
              }
            />

            <input
              className={inp}
              placeholder="Office public IPs, comma separated"
              value={form?.ips ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...(current ?? officeFormFromData(d.office)),
                  ips: event.target.value,
                }))
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
            type="button"
            className="mt-2 rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-medium"
            onClick={() => void saveOffice()}
          >
            Save office
          </button>

          {msg && (
            <p role="status" className="mt-2 text-sm text-indigo-300">
              {msg}
            </p>
          )}
        </details>
      </div>
    </main>
  );
}
