"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

const card = "rounded-2xl border border-white/10 bg-neutral-900 p-4";
const PROJECTS = ["", "Website revamp", "Client deck", "Mobile app", "Internal tools"];
const fmt = (d: string) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function MyReports() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  const [edit, setEdit] = useState<Record<string, { project: string; note: string }>>({});
  const [log, setLog] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const r = (await api("/reports")).reports;
      setRows(r);
      setEdit((cur) => { const n = { ...cur }; r.forEach((x: any) => { if (!n[x.id]) n[x.id] = { project: x.project, note: x.note }; }); return n; });
      setLog((await api("/access-log")).entries);
    } catch (e: any) { if (e.status === 401) router.push("/workforce/login"); }
  }, [router]);
  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<any>, ok = "") => { setMsg(""); try { await fn(); if (ok) setMsg(ok); await load(); } catch (e: any) { setMsg(e.message); } };
  const save = (id: string, submit = false) => run(() => api(`/reports/${id}`, { method: "PATCH", body: { ...edit[id], submit } }), submit ? "Report submitted" : "Saved");
  const draft = async (id: string) => { const r = await api(`/reports/${id}/draft`); setEdit({ ...edit, [id]: { ...edit[id], note: r.text } }); };
  const upload = (id: string, f: File | undefined) => f && run(async () => {
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch(`/api/workforce/reports/${id}/files`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? "Upload failed");
  }, "File attached");
  const rm = (fid: string) => run(() => api(`/files/${fid}`, { method: "DELETE" }));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="flex items-center justify-between"><div><h1 className="text-xl font-semibold">Hourly Reports</h1><p className="text-sm text-neutral-400">Tracked activity + your work. Measured only; no productivity score.</p></div><a className="text-sm text-indigo-300" href="/workforce">← Dashboard</a></header>
        {msg && <p className="text-sm text-indigo-300">{msg}</p>}
        {rows.length === 0 && <div className={card + " text-sm text-neutral-400"}>No reports yet. A report appears about 2 minutes after each full hour of a work session (and when you check out).</div>}
        {rows.map((r) => {
          const locked = r.status !== "DRAFT", e = edit[r.id] ?? { project: "", note: "" };
          return (
            <div key={r.id} className={card + " space-y-3"}>
              <div className="flex items-center justify-between"><b>{fmt(r.periodStart)}–{fmt(r.periodEnd)} · {new Date(r.periodStart).toLocaleDateString()}{r.partial ? " (partial)" : ""}</b><span className={`rounded-full border px-2 text-xs ${locked ? "border-emerald-500/40 text-emerald-400" : "border-amber-500/40 text-amber-400"}`}>{locked ? "Submitted" : "Work upload pending"}</span></div>
              <p className="text-sm text-neutral-300">Active {r.activeMin}m · Idle {r.idleMin}m · {r.topApps.map((a: any) => `${a.app} ${a.min}m`).join(", ") || "no app data"}</p>
              <select disabled={locked} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm" value={e.project} onChange={(x) => setEdit({ ...edit, [r.id]: { ...e, project: x.target.value } })}>{PROJECTS.map((p) => <option key={p} value={p}>{p || "— project —"}</option>)}</select>
              <textarea disabled={locked} rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm" placeholder="What did you work on this hour?" value={e.note} onChange={(x) => setEdit({ ...edit, [r.id]: { ...e, note: x.target.value } })} />
              <div className="flex flex-wrap gap-2">{r.files.map((f: any) => <span key={f.id} className="rounded-full border border-white/10 px-2 py-1 text-xs">📎 <a className="underline" href={`/api/workforce/files/${f.id}`}>{f.name}</a> · {Math.ceil(f.sizeB / 1024)} KB {!locked && <button className="ml-1 text-red-400" onClick={() => rm(f.id)}>✕</button>}</span>)}</div>
              {!locked ? (
                <div className="flex flex-wrap gap-2 text-sm">
                  <button className="rounded-lg bg-white/10 px-3 py-1.5" onClick={() => draft(r.id)}>✨ Draft with AI</button>
                  <label className="cursor-pointer rounded-lg bg-white/10 px-3 py-1.5">📎 Attach work<input type="file" hidden accept=".ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip" onChange={(x) => { upload(r.id, x.target.files?.[0]); x.target.value = ""; }} /></label>
                  <button className="rounded-lg bg-white/10 px-3 py-1.5" onClick={() => save(r.id)}>Save</button>
                  <button className="rounded-lg bg-indigo-500 px-3 py-1.5 font-medium" onClick={() => save(r.id, true)}>Submit report</button>
                </div>
              ) : <p className="text-xs text-neutral-400">Submitted {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ""} · visible to administrators</p>}
            </div>
          );
        })}
        <div className={card}><b>Who opened my reports or files</b>{log.length === 0 ? <p className="mt-1 text-sm text-neutral-400">No administrator access yet.</p> : <ul className="mt-1 space-y-1 text-sm text-neutral-300">{log.map((l, i) => <li key={i}>{new Date(l.at).toLocaleString()} · {l.by} · {l.action === "FILE_VIEWED" ? "downloaded a file" : "opened a report"}</li>)}</ul>}</div>
      </div>
    </main>
  );
}
