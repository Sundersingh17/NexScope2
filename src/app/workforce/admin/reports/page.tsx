"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

const card = "rounded-2xl border border-white/10 bg-neutral-900 p-4";
const sel = "rounded-lg border border-white/10 bg-neutral-900 px-2 py-1.5 text-sm";
const fmt = (d: string) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AdminReports() {
  const router = useRouter();
  const [emps, setEmps] = useState<any[]>([]);
  const [f, setF] = useState({ employeeId: "", team: "", status: "" });
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState<any>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      if (!emps.length) setEmps((await api("/admin/overview")).rows);
      const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]);
      setRows((await api("/admin/reports?" + q)).reports);
    } catch (e: any) { if (e.status === 401) router.push("/workforce/login"); else if (e.status === 403) router.push("/workforce"); else setErr(e.message); }
  }, [f, emps.length, router]);
  useEffect(() => { load(); }, [load]);

  const view = async (id: string) => { try { setOpen(await api(`/admin/reports/${id}`)); } catch (e: any) { setErr(e.message); } };
  const teams = [...new Set(emps.map((e) => e.team))];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="flex items-center justify-between"><h1 className="text-xl font-semibold">Hourly Reports</h1><a className="text-sm text-indigo-300" href="/workforce/admin">← Command Center</a></header>
        <p className="text-sm text-neutral-400">Opening a report or downloading a file is recorded, and the employee can see it.</p>
        <div className="flex flex-wrap gap-2">
          <select className={sel} value={f.employeeId} onChange={(e) => setF({ ...f, employeeId: e.target.value })}><option value="">All employees</option>{emps.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
          <select className={sel} value={f.team} onChange={(e) => setF({ ...f, team: e.target.value })}><option value="">All teams</option>{teams.map((t) => <option key={t}>{t}</option>)}</select>
          <select className={sel} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option value="">Any status</option><option value="SUBMITTED">Submitted</option><option value="DRAFT">Pending</option></select>
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <div className={card + " overflow-x-auto"}>
          <table className="w-full min-w-[720px] text-sm"><thead className="text-left text-neutral-400"><tr><th>Employee</th><th>Period</th><th>Active</th><th>Idle</th><th>Top app</th><th>Files</th><th>Status</th><th></th></tr></thead><tbody>
            {rows.map((r) => (<tr key={r.id} className="border-t border-white/5"><td>{r.employee}<div className="text-xs text-neutral-500">{r.team}</div></td><td>{new Date(r.periodStart).toLocaleDateString()} {fmt(r.periodStart)}–{fmt(r.periodEnd)}</td><td>{r.activeMin}m</td><td>{r.idleMin}m</td><td>{r.topApps[0]?.app ?? "—"}</td><td>{r.files}</td><td className={r.status === "SUBMITTED" ? "text-emerald-400" : "text-amber-400"}>{r.status === "SUBMITTED" ? "Submitted" : "Pending"}</td><td><button className="text-indigo-300" onClick={() => view(r.id)}>Open</button></td></tr>))}
            {rows.length === 0 && <tr><td colSpan={8} className="py-4 text-neutral-400">No reports match.</td></tr>}
          </tbody></table>
        </div>
        {open && (
          <div className={card + " space-y-2"}>
            <div className="flex justify-between"><b>Report detail</b><button className="text-sm text-neutral-400" onClick={() => setOpen(null)}>Close</button></div>
            <p className="text-sm">Project: {open.report.project || "—"}</p>
            <p className="whitespace-pre-wrap text-sm text-neutral-200">{open.report.note || "No summary written."}</p>
            <div className="flex flex-wrap gap-2">{open.files.map((x: any) => <a key={x.id} className="rounded-full border border-white/10 px-2 py-1 text-xs underline" href={`/api/workforce/files/${x.id}`}>📎 {x.name}</a>)}</div>
          </div>
        )}
      </div>
    </main>
  );
}
