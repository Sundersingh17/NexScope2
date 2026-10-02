"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

const dur = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
const card = "rounded-2xl border border-white/10 bg-neutral-900 p-4";
const inp = "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm";

export default function AdminDashboard() {
  const router = useRouter();
  const [ov, setOv] = useState<any>(null);
  const [reqs, setReqs] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [nf, setNf] = useState({ name: "", email: "", team: "General", password: "" });

  const load = useCallback(async () => {
    try { setOv(await api("/admin/overview")); setReqs((await api("/remote-requests")).requests); }
    catch (e: any) { if (e.status === 401) router.push("/workforce/login"); else if (e.status === 403) router.push("/workforce"); }
  }, [router]);
  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, [load]);

  const run = async (fn: () => Promise<any>, ok: string) => { setMsg(""); try { await fn(); setMsg(ok); await load(); } catch (e: any) { setMsg(e.message); } };
  const decide = (id: string, decision: "APPROVED" | "DENIED") => run(() => api(`/remote-requests/${id}`, { method: "PATCH", body: { decision, hours: 8 } }), `Request ${decision.toLowerCase()}`);
  const add = () => run(async () => { await api("/admin/employees", { body: nf }); setNf({ name: "", email: "", team: "General", password: "" }); }, "Employee created — they set up 2FA at first sign-in");
  const toggle = (id: string) => run(() => api(`/admin/employees/${id}`, { method: "PATCH", body: { active: false } }), "Employee disabled");
  const logout = async () => { await api("/auth/logout", { body: {} }); router.push("/workforce/login"); };

  if (!ov) return <main className="min-h-screen bg-neutral-950 text-neutral-400 p-8">Loading…</main>;
  const pending = reqs.filter((r) => r.status === "PENDING");
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="flex items-center justify-between"><h1 className="text-xl font-semibold">Command Center</h1><div className="flex gap-3 text-sm"><a className="text-indigo-300" href="/workforce">My dashboard</a><button className="text-neutral-400" onClick={logout}>Sign out</button></div></header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["Working", ov.counts.working, "text-emerald-400"], ["Checked out", ov.counts.out, "text-amber-400"], ["Offline", ov.counts.offline, "text-neutral-400"], ["Pending requests", ov.counts.pendingRequests, "text-indigo-300"]].map(([k, v, c]: any) => (
            <div key={k} className={card}><p className="text-xs text-neutral-400">{k}</p><p className={`text-3xl font-semibold ${c}`}>{v}</p></div>))}
        </div>
        {msg && <p className="text-sm text-indigo-300">{msg}</p>}

        <div className={card + " overflow-x-auto"}>
          <b>Workforce</b>
          <table className="mt-2 w-full min-w-[640px] text-sm"><thead className="text-left text-neutral-400"><tr><th>Employee</th><th>Team</th><th>Status</th><th>Since</th><th>Active</th><th>Idle</th><th>Agent</th><th></th></tr></thead><tbody>
            {ov.rows.map((r: any) => (<tr key={r.id} className="border-t border-white/5"><td>{r.name}{r.alert && <div className="text-xs text-amber-400">⚠ {r.alert}</div>}</td><td>{r.team}</td><td className={r.status === "working" ? "text-emerald-400" : "text-neutral-400"}>{r.status}{r.zone ? ` (${r.zone.toLowerCase()})` : ""}</td><td>{r.startedAt ? new Date(r.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td><td>{dur(r.activeMin)}</td><td>{dur(r.idleMin)}</td><td className={r.agentOnline ? "text-emerald-400" : "text-neutral-500"}>{r.agentOnline ? "● online" : "○ offline"}</td><td><button className="text-xs text-red-400" onClick={() => toggle(r.id)}>Disable</button></td></tr>))}
          </tbody></table>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={card + " space-y-2"}>
            <b>Remote work requests</b>
            {pending.length === 0 && <p className="text-sm text-neutral-400">Nothing pending.</p>}
            {pending.map((r) => (<div key={r.id} className="rounded-lg border border-white/10 p-3 text-sm"><p><b>{r.employee.name}</b> — {r.reason}</p><div className="mt-2 flex gap-2"><button className="rounded bg-emerald-500 px-3 py-1" onClick={() => decide(r.id, "APPROVED")}>Approve (8 h)</button><button className="rounded bg-white/10 px-3 py-1" onClick={() => decide(r.id, "DENIED")}>Deny</button></div></div>))}
          </div>
          <div className={card + " space-y-2"}>
            <b>Add employee</b>
            <input className={inp + " w-full"} placeholder="Full name" value={nf.name} onChange={(e) => setNf({ ...nf, name: e.target.value })} />
            <input className={inp + " w-full"} type="email" placeholder="Email" autoComplete="off" value={nf.email} onChange={(e) => setNf({ ...nf, email: e.target.value })} />
            <input className={inp + " w-full"} placeholder="Team" value={nf.team} onChange={(e) => setNf({ ...nf, team: e.target.value })} />
            <input className={inp + " w-full"} type="password" placeholder="Temporary password (10+ characters)" autoComplete="new-password" value={nf.password} onChange={(e) => setNf({ ...nf, password: e.target.value })} />
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium disabled:opacity-50" disabled={!nf.name || !nf.email || nf.password.length < 10} onClick={add}>Create employee</button>
          </div>
        </div>
      </div>
    </main>
  );
}
