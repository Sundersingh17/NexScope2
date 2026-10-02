"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getPosition } from "@/lib/workforce/client";

const hms = (ms: number) => { const s = Math.max(0, Math.floor(ms / 1000)); return [s / 3600, (s / 60) % 60, s % 60].map((n) => String(Math.floor(n)).padStart(2, "0")).join(":"); };
const dur = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
const card = "rounded-2xl border border-white/10 bg-neutral-900 p-4";
const btn = "rounded-lg px-4 py-2 font-medium disabled:opacity-50";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [hist, setHist] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());
  const [msg, setMsg] = useState<{ t: "err" | "ok"; s: string } | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [reason, setReason] = useState("");
  const [code, setCode] = useState<{ code: string; expiresAt: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setMe(await api("/me"));
      setHist((await api("/sessions?limit=10")).sessions);
    } catch (e: any) { if (e.status === 401) router.push("/workforce/login"); }
  }, [router]);
  useEffect(() => { load(); const a = setInterval(load, 15000), b = setInterval(() => setNow(Date.now()), 1000); return () => { clearInterval(a); clearInterval(b); }; }, [load]);

  async function act(fn: () => Promise<void>) { setMsg(null); setBusy(true); try { await fn(); await load(); } catch (e: any) { setMsg({ t: "err", s: e.message }); if (e.status === 403) setBlocked(true); } finally { setBusy(false); } }
  const checkIn = () => act(async () => {
    setBlocked(false);
    const p = await getPosition();
    await api("/session/start", { body: { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy } });
    setMsg({ t: "ok", s: "Checked in" });
  });
  const checkOut = () => act(async () => {
    let body: any = {};
    try { const p = await getPosition(); body = { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }; } catch {}
    await api("/session/end", { body });
    setMsg({ t: "ok", s: "Checked out — monitoring stopped" });
  });
  const requestRemote = () => act(async () => { await api("/remote-requests", { body: { reason } }); setBlocked(false); setReason(""); setMsg({ t: "ok", s: "Request sent to an administrator" }); });
  const pair = () => act(async () => setCode(await api("/devices/pair", { method: "POST", body: {} })));
  const revoke = (id: string) => act(async () => { await api(`/devices/${id}`, { method: "PATCH", body: {} }); });
  const logout = async () => { await api("/auth/logout", { body: {} }); router.push("/workforce/login"); };

  if (!me) return <main className="min-h-screen bg-neutral-950 text-neutral-400 p-8">Loading…</main>;
  const s = me.openSession;
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="flex items-center justify-between">
          <div><h1 className="text-xl font-semibold">My Dashboard</h1><p className="text-sm text-neutral-400">{me.employee.name} · {me.employee.team}</p></div>
          <div className="flex gap-3 text-sm">{me.employee.role === "ADMIN" && <a className="text-indigo-300" href="/workforce/admin">Admin</a>}<button className="text-neutral-400" onClick={logout}>Sign out</button></div>
        </header>

        <div className={`${card} flex items-center gap-3 ${s ? "border-emerald-500/40" : ""}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${s ? "bg-emerald-400" : "bg-neutral-500"}`} />
          <b>{s ? "Work session active — NexScope monitoring enabled." : "Work session ended — monitoring disabled."}</b>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={card}><p className="text-xs text-neutral-400">Check-in</p><p className="text-2xl font-semibold">{s ? new Date(s.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</p></div>
          <div className={card}><p className="text-xs text-neutral-400">Session</p><p className="text-2xl font-semibold">{s ? hms(now - new Date(s.startedAt).getTime()) : "00:00:00"}</p></div>
          <div className={card}><p className="text-xs text-neutral-400">Active (agent)</p><p className="text-2xl font-semibold text-emerald-400">{dur(s?.active ?? 0)}</p></div>
          <div className={card}><p className="text-xs text-neutral-400">Idle (agent)</p><p className="text-2xl font-semibold text-amber-400">{dur(s?.idle ?? 0)}</p></div>
        </div>

        <div className={card + " space-y-3"}>
          {s ? <button disabled={busy} onClick={checkOut} className={`${btn} bg-red-500`}>Check out</button>
             : <button disabled={busy} onClick={checkIn} className={`${btn} bg-indigo-500`}>Check in (uses your location)</button>}
          <p className="text-xs text-neutral-400">Location is read only when you check in or out. Active/idle minutes come from the desktop agent.</p>
          {msg && <p className={`text-sm ${msg.t === "err" ? "text-red-400" : "text-emerald-400"}`}>{msg.s}</p>}
          {blocked && !s && (
            <div className="space-y-2 rounded-lg border border-amber-500/30 p-3">
              <p className="text-sm">Need to work remotely? Ask an administrator.</p>
              <textarea className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm" placeholder="Reason (e.g. client visit)" value={reason} onChange={(e) => setReason(e.target.value)} />
              <button disabled={busy || reason.trim().length < 3} onClick={requestRemote} className={`${btn} bg-amber-500 text-black`}>Request remote approval</button>
            </div>
          )}
        </div>

        <div className={card + " space-y-2"}>
          <div className="flex items-center justify-between"><b>My computers (desktop agent)</b><button disabled={busy} onClick={pair} className={`${btn} bg-white/10 text-sm`}>Add this PC</button></div>
          {code && <p className="rounded-lg bg-indigo-500/10 p-3 text-sm">Enter this code in the agent within 10 minutes: <b className="font-mono text-lg tracking-widest">{code.code}</b></p>}
          {me.devices.length === 0 ? <p className="text-sm text-neutral-400">No computer paired yet.</p> : me.devices.map((d: any) => (
            <div key={d.id} className="flex items-center justify-between text-sm"><span>{d.name} <span className="text-neutral-500">· last seen {d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleTimeString() : "never"}</span></span><button className="text-red-400" onClick={() => revoke(d.id)}>Revoke</button></div>
          ))}
        </div>

        <div className={card}>
          <b>Recent attendance</b>
          <table className="mt-2 w-full text-sm"><thead className="text-left text-neutral-400"><tr><th>Date</th><th>In</th><th>Out</th><th>Active</th><th>Idle</th><th>Zone</th></tr></thead><tbody>
            {hist.map((h) => (<tr key={h.id} className="border-t border-white/5"><td>{new Date(h.startedAt).toLocaleDateString()}</td><td>{new Date(h.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td><td>{h.endedAt ? new Date(h.endedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "in progress"}</td><td>{dur(h.active ?? 0)}</td><td>{dur(h.idle ?? 0)}</td><td>{h.zone}</td></tr>))}
          </tbody></table>
        </div>
      </div>
    </main>
  );
}
