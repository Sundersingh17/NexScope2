"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

const card =
  "rounded-2xl border border-white/10 bg-neutral-900 p-5";

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtTime = (value: string) =>
  new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtDateTime = (value: string) =>
  new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminReportDetail() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);

        const result = await api(
          `/admin/reports/${id}`
        );

        setData(result);
      } catch (e: any) {
        if (e.status === 401) {
          router.push("/workforce/login");
          return;
        }

        if (e.status === 403) {
          router.push("/workforce");
          return;
        }

        setErr(e.message || "Unable to load report");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-neutral-400">
            Loading report...
          </p>
        </div>
      </main>
    );
  }

  if (err) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <button
            className="text-sm text-indigo-300 hover:text-indigo-200"
            onClick={() =>
              router.push("/workforce/admin/reports")
            }
          >
            ← Back to Reports
          </button>

          <div className={card}>
            <p className="text-sm text-red-400">
              {err}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!data?.report) {
    return null;
  }

  const report = data.report;
  const files = data.files ?? [];

  const status =
    report.status === "SUBMITTED"
      ? "Submitted"
      : "Pending";

  const statusClass =
    report.status === "SUBMITTED"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : "border-amber-500/20 bg-amber-500/10 text-amber-400";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-5">

        {/* Header */}
        <header className="space-y-4">
          <button
            className="text-sm text-indigo-300 hover:text-indigo-200"
            onClick={() =>
              router.push("/workforce/admin/reports")
            }
          >
            ← Back to Reports
          </button>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                Hourly Work Report
              </p>

              <h1 className="mt-1 text-2xl font-semibold">
                {report.project || "Work Report"}
              </h1>

              <p className="mt-2 text-sm text-neutral-400">
                {fmtDate(report.periodStart)} ·{" "}
                {fmtTime(report.periodStart)} –{" "}
                {fmtTime(report.periodEnd)}
              </p>
            </div>

            <span
              className={
                "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium " +
                statusClass
              }
            >
              {status}
            </span>
          </div>
        </header>

        {/* Employee + Period */}
        <section className={card}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Employee
              </p>

              <p className="mt-1 font-medium">
                {report.employeeName ||
                  report.employee?.name ||
                  "Employee"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Work period
              </p>

              <p className="mt-1 text-sm">
                {fmtTime(report.periodStart)} –{" "}
                {fmtTime(report.periodEnd)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Active
              </p>

              <p className="mt-1 text-lg font-semibold text-emerald-400">
                {report.activeMin ?? 0}m
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Idle
              </p>

              <p className="mt-1 text-lg font-semibold text-amber-400">
                {report.idleMin ?? 0}m
              </p>
            </div>
          </div>
        </section>

        {/* Work Description */}
        <section className={card}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Work Description
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                Employee-submitted work summary
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/20 p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-200">
              {report.note || "No summary written."}
            </p>
          </div>
        </section>

        {/* Activity */}
        <section className={card}>
          <div className="mb-4">
            <h2 className="font-semibold">
              Activity Summary
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Measured desktop activity for this report period
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-black/20 p-4">
              <p className="text-xs text-neutral-500">
                Active time
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {report.activeMin ?? 0}m
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/20 p-4">
              <p className="text-xs text-neutral-500">
                Idle time
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {report.idleMin ?? 0}m
              </p>
            </div>
          </div>

          {Array.isArray(report.topApps) &&
            report.topApps.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium">
                  Top Applications
                </p>

                <div className="space-y-2">
                  {report.topApps.map(
                    (app: any, index: number) => (
                      <div
                        key={`${app.app}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-4 py-3"
                      >
                        <span className="text-sm">
                          {app.app}
                        </span>

                        <span className="text-sm text-neutral-400">
                          {app.min ?? 0}m
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </section>

        {/* Evidence */}
        <section className={card}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Work Evidence
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                Files attached to this report
              </p>
            </div>

            <span className="text-xs text-neutral-500">
              {files.length}{" "}
              {files.length === 1 ? "file" : "files"}
            </span>
          </div>

          {files.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
              <p className="text-sm text-neutral-500">
                No work evidence attached.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file: any) => (
                <div
                  key={file.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/5 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
                      📎
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {formatBytes(file.sizeB)}
                      </p>
                    </div>
                  </div>

                  <a
                    className="text-sm text-indigo-300 hover:text-indigo-200"
                    href={`/api/workforce/files/${file.id}`}
                  >
                    Open / Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Metadata */}
        <section className={card}>
          <h2 className="font-semibold">
            Report Information
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Report ID
              </p>

              <p className="mt-1 break-all font-mono text-xs text-neutral-400">
                {report.id}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Created
              </p>

              <p className="mt-1 text-sm text-neutral-300">
                {report.createdAt
                  ? fmtDateTime(report.createdAt)
                  : "—"}
              </p>
            </div>

            {report.submittedAt && (
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Submitted
                </p>

                <p className="mt-1 text-sm text-neutral-300">
                  {fmtDateTime(report.submittedAt)}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Status
              </p>

              <p className="mt-1 text-sm text-neutral-300">
                {status}
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}