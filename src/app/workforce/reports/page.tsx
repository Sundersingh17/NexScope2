
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

const card = "rounded-2xl border border-white/10 bg-neutral-900 p-4";
const PROJECTS = [
  "",
  "Website revamp",
  "Client deck",
  "Mobile app",
  "Internal tools",
];

type TopApp = {
  app: string;
  min: number;
};

type ReportFile = {
  id: string;
  name: string;
  sizeB: number;
};

type ReportRow = {
  id: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  partial: boolean;
  activeMin: number;
  idleMin: number;
  topApps: TopApp[];
  files: ReportFile[];
  project: string | null;
  note: string | null;
  submittedAt: string | null;
};

type AccessLogEntry = {
  at: string;
  by: string;
  action: string;
};

type ReportEdit = {
  project: string;
  note: string;
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

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

export default function MyReports() {
  const router = useRouter();

  const [rows, setRows] = useState<ReportRow[]>([]);
  const [edit, setEdit] = useState<Record<string, ReportEdit>>({});
  const [log, setLog] = useState<AccessLogEntry[]>([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const reportData = await api<{ reports: ReportRow[] }>("/reports");
      const reports = reportData.reports;

      setRows(reports);

      setEdit((current) => {
        const next = { ...current };

        for (const report of reports) {
          if (!next[report.id]) {
            next[report.id] = {
              project: report.project ?? "",
              note: report.note ?? "",
            };
          }
        }

        return next;
      });

      const accessData = await api<{ entries: AccessLogEntry[] }>(
        "/access-log"
      );

      setLog(accessData.entries);
    } catch (error: unknown) {
      if (errorStatus(error) === 401) {
        router.push("/workforce/login");
      } else {
        setMsg(errorMessage(error));
      }
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    const initialLoad = async () => {
      if (cancelled) return;
      await load();
    };

    void initialLoad();

    return () => {
      cancelled = true;
    };
  }, [load]);

  const run = async (
    fn: () => Promise<unknown>,
    successMessage = ""
  ) => {
    setMsg("");

    try {
      await fn();

      if (successMessage) {
        setMsg(successMessage);
      }

      await load();
    } catch (error: unknown) {
      if (errorStatus(error) === 401) {
        router.push("/workforce/login");
        return;
      }

      setMsg(errorMessage(error));
    }
  };

  const updateEdit = (
    id: string,
    changes: Partial<ReportEdit>
  ) => {
    setEdit((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? { project: "", note: "" }),
        ...changes,
      },
    }));
  };

  const save = (id: string, submit = false) =>
    run(
      () =>
        api<unknown>(`/reports/${id}`, {
          method: "PATCH",
          body: {
            ...(edit[id] ?? { project: "", note: "" }),
            submit,
          },
        }),
      submit ? "Report submitted" : "Saved"
    );

  const draft = async (id: string) => {
    setMsg("");

    try {
      const result = await api<{ text: string }>(
        `/reports/${id}/draft`
      );

      updateEdit(id, { note: result.text });
      setMsg("AI draft generated. Review it before saving.");
    } catch (error: unknown) {
      if (errorStatus(error) === 401) {
        router.push("/workforce/login");
      } else {
        setMsg(errorMessage(error));
      }
    }
  };

  const upload = (id: string, file: File | undefined) => {
    if (!file) return;

    return run(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/workforce/reports/${id}/files`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        let message = "Upload failed";

        try {
          const result: unknown = await response.json();

          if (
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
          ) {
            message = result.error;
          }
        } catch {
          // Retain the default error message.
        }

        throw new Error(message);
      }
    }, "File attached");
  };

  const removeFile = (fileId: string) =>
    run(() =>
      api<unknown>(`/files/${fileId}`, {
        method: "DELETE",
      })
    );

  return (
    <main className="min-h-screen bg-neutral-950 p-4 text-neutral-100 md:p-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Hourly Reports</h1>
            <p className="text-sm text-neutral-400">
              Tracked activity + your work. Measured only; no productivity score.
            </p>
          </div>

          <a className="shrink-0 text-sm text-indigo-300" href="/workforce">
            ← Dashboard
          </a>
        </header>

        {msg && (
          <p role="status" className="break-words text-sm text-indigo-300">
            {msg}
          </p>
        )}

        {rows.length === 0 && (
          <div className={`${card} text-sm text-neutral-400`}>
            No reports yet. A report appears about 2 minutes after each
            full hour of a work session (and when you check out).
          </div>
        )}

        {rows.map((report) => {
          const locked = report.status !== "DRAFT";
          const currentEdit = edit[report.id] ?? {
            project: report.project ?? "",
            note: report.note ?? "",
          };

          return (
            <div key={report.id} className={`${card} space-y-3`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b>
                  {new Date(report.periodStart).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  –
                  {new Date(report.periodEnd).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" · "}
                  {new Date(report.periodStart).toLocaleDateString()}
                  {report.partial ? " (partial)" : ""}
                </b>

                <span
                  className={`rounded-full border px-2 text-xs ${
                    locked
                      ? "border-emerald-500/40 text-emerald-400"
                      : "border-amber-500/40 text-amber-400"
                  }`}
                >
                  {locked ? "Submitted" : "Work upload pending"}
                </span>
              </div>

              <p className="text-sm text-neutral-300">
                Active {report.activeMin}m · Idle {report.idleMin}m ·{" "}
                {report.topApps
                  .map((app) => `${app.app} ${app.min}m`)
                  .join(", ") || "no app data"}
              </p>

              <select
                disabled={locked}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm"
                value={currentEdit.project}
                onChange={(event) =>
                  updateEdit(report.id, {
                    project: event.target.value,
                  })
                }
              >
                {PROJECTS.map((project) => (
                  <option key={project} value={project}>
                    {project || "— project —"}
                  </option>
                ))}
              </select>

              <textarea
                disabled={locked}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm"
                placeholder="What did you work on this hour?"
                value={currentEdit.note}
                onChange={(event) =>
                  updateEdit(report.id, {
                    note: event.target.value,
                  })
                }
              />

              <div className="flex flex-wrap gap-2">
                {report.files.map((file) => (
                  <span
                    key={file.id}
                    className="rounded-full border border-white/10 px-2 py-1 text-xs"
                  >
                    📎{" "}
                    <a
                      className="underline"
                      href={`/api/workforce/files/${file.id}`}
                    >
                      {file.name}
                    </a>
                    {" · "}
                    {Math.ceil(file.sizeB / 1024)} KB{" "}
                    {!locked && (
                      <button
                        type="button"
                        className="ml-1 text-red-400"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => removeFile(file.id)}
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {!locked ? (
                <div className="flex flex-wrap gap-2 text-sm">
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 px-3 py-1.5"
                    onClick={() => draft(report.id)}
                  >
                    ✨ Draft with AI
                  </button>

                  <label className="cursor-pointer rounded-lg bg-white/10 px-3 py-1.5">
                    📎 Attach work
                    <input
                      type="file"
                      hidden
                      accept=".ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                      onChange={(event) => {
                        void upload(report.id, event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    className="rounded-lg bg-white/10 px-3 py-1.5"
                    onClick={() => save(report.id)}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="rounded-lg bg-indigo-500 px-3 py-1.5 font-medium"
                    onClick={() => save(report.id, true)}
                  >
                    Submit report
                  </button>
                </div>
              ) : (
                <p className="text-xs text-neutral-400">
                  Submitted{" "}
                  {report.submittedAt
                    ? new Date(report.submittedAt).toLocaleString()
                    : ""}
                  {" · "}visible to administrators
                </p>
              )}
            </div>
          );
        })}

        <div className={card}>
          <b>Who opened my reports or files</b>

          {log.length === 0 ? (
            <p className="mt-1 text-sm text-neutral-400">
              No administrator access yet.
            </p>
          ) : (
            <ul className="mt-1 space-y-1 text-sm text-neutral-300">
              {log.map((entry, index) => (
                <li key={`${entry.at}-${index}`}>
                  {new Date(entry.at).toLocaleString()}
                  {" · "}
                  {entry.by}
                  {" · "}
                  {entry.action === "FILE_VIEWED"
                    ? "downloaded a file"
                    : "opened a report"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
