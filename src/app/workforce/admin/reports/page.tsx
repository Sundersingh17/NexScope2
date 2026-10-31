"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

type EmployeeOption = {
  id: string;
  name: string;
  team: string | null;
};

type TopApp = {
  app: string;
  min?: number;
};

type ReportRow = {
  id: string;
  employee: string;
  team: string | null;
  periodStart: string;
  periodEnd: string;
  activeMin: number | null;
  idleMin: number | null;
  topApps?: TopApp[] | null;
  files: number;
  status: string;
};

type OverviewResponse = {
  rows: EmployeeOption[];
};

type ReportsResponse = {
  reports: ReportRow[];
};

type ApiErrorLike = {
  status?: number;
  message?: string;
};

const card = "rounded-2xl border border-white/10 bg-neutral-900 p-4";
const sel =
  "rounded-lg border border-white/10 bg-neutral-900 px-2 py-1.5 text-sm";

const fmt = (d: string) =>
  new Date(d).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

function getApiError(error: unknown): ApiErrorLike {
  if (typeof error !== "object" || error === null) {
    return { message: "An unexpected error occurred." };
  }

  const candidate = error as { status?: unknown; message?: unknown };
  return {
    status:
      typeof candidate.status === "number" ? candidate.status : undefined,
    message:
      typeof candidate.message === "string"
        ? candidate.message
        : "An unexpected error occurred.",
  };
}

export default function AdminReports() {
  const router = useRouter();

  const [emps, setEmps] = useState<EmployeeOption[]>([]);
  const [employeesLoaded, setEmployeesLoaded] = useState(false);
  const [f, setF] = useState({
    employeeId: "",
    team: "",
    status: "",
  });
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setErr("");

    try {
      if (!employeesLoaded) {
        const overview = await api<OverviewResponse>("/admin/overview");
        setEmps(overview.rows);
        setEmployeesLoaded(true);
      }

      const q = new URLSearchParams();
      if (f.employeeId) q.set("employeeId", f.employeeId);
      if (f.team) q.set("team", f.team);
      if (f.status) q.set("status", f.status);

      const result = await api<ReportsResponse>(
        "/admin/reports?" + q.toString()
      );

      setRows(result.reports);
    } catch (error: unknown) {
      const apiError = getApiError(error);

      if (apiError.status === 401) {
        router.push("/workforce/login");
      } else if (apiError.status === 403) {
        router.push("/workforce");
      } else {
        setErr(apiError.message ?? "Unable to load reports.");
      }
    }
  }, [employeesLoaded, f, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const openReport = (id: string) => {
    router.push(`/workforce/admin/reports/${id}`);
  };

  const teams = [...new Set(emps.map((employee) => employee.team).filter(
    (team): team is string => Boolean(team)
  ))];

  return (
    <main className="min-h-screen bg-neutral-950 p-4 text-neutral-100 md:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Hourly Reports</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Review employee work reports, activity and evidence.
            </p>
          </div>

          <Link
            className="text-sm text-indigo-300 hover:text-indigo-200"
            href="/workforce/admin"
          >
            ← Command Center
          </Link>
        </header>

        <p className="text-sm text-neutral-400">
          Opening a report or downloading a file is recorded, and the employee
          can see it.
        </p>

        <div className="flex flex-wrap gap-2">
          <select
            className={sel}
            value={f.employeeId}
            onChange={(event) =>
              setF((current) => ({
                ...current,
                employeeId: event.target.value,
              }))
            }
          >
            <option value="">All employees</option>
            {emps.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>

          <select
            className={sel}
            value={f.team}
            onChange={(event) =>
              setF((current) => ({
                ...current,
                team: event.target.value,
              }))
            }
          >
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          <select
            className={sel}
            value={f.status}
            onChange={(event) =>
              setF((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
          >
            <option value="">Any status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="DRAFT">Pending</option>
          </select>
        </div>

        {err && <p className="text-sm text-red-400">{err}</p>}

        <div className={card + " overflow-x-auto"}>
          <table className="w-full min-w-[820px] text-sm">
            <thead className="text-left text-neutral-400">
              <tr>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Period</th>
                <th className="pb-3">Active</th>
                <th className="pb-3">Idle</th>
                <th className="pb-3">Top app</th>
                <th className="pb-3">Files</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((report) => (
                <tr
                  key={report.id}
                  className="border-t border-white/5"
                >
                  <td className="py-3">
                    <div>{report.employee}</div>
                    <div className="text-xs text-neutral-500">
                      {report.team ?? "—"}
                    </div>
                  </td>

                  <td className="whitespace-nowrap py-3">
                    {new Date(report.periodStart).toLocaleDateString()}{" "}
                    {fmt(report.periodStart)}
                    {"–"}
                    {fmt(report.periodEnd)}
                  </td>

                  <td className="py-3">{report.activeMin ?? 0}m</td>
                  <td className="py-3">{report.idleMin ?? 0}m</td>
                  <td className="py-3">{report.topApps?.[0]?.app ?? "—"}</td>

                  <td className="py-3">
                    {report.files > 0 ? (
                      <span className="text-indigo-300">
                        📎 {report.files}
                      </span>
                    ) : (
                      "0"
                    )}
                  </td>

                  <td
                    className={
                      report.status === "SUBMITTED"
                        ? "py-3 text-emerald-400"
                        : "py-3 text-amber-400"
                    }
                  >
                    {report.status === "SUBMITTED" ? "Submitted" : "Pending"}
                  </td>

                  <td className="py-3 text-right">
                    <button
                      className="text-indigo-300 hover:text-indigo-200"
                      onClick={() => openReport(report.id)}
                    >
                      Open →
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-neutral-400"
                  >
                    No reports match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
