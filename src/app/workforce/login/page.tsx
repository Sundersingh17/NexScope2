"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

export default function WorkforceLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "totp">("login");
  const [f, setF] = useState({ email: "", password: "", code: "" });
  const [token, setToken] = useState("");
  const [qr, setQr] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<void>) {
    setErr(""); setBusy(true);
    try { await fn(); } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }
  const login = () => run(async () => {
    const r = await api("/auth/login", { body: { email: f.email, password: f.password } });
    setToken(r.token);
    if (r.step === "setup") setQr((await api("/auth/totp/setup", { body: { token: r.token } })).qr);
    setStep("totp");
  });
  const verify = () => run(async () => {
    const r = await api("/auth/totp/verify", { body: { token, code: f.code } });
    router.push(r.role === "ADMIN" ? "/workforce/admin" : "/workforce");
  });
  const input = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-indigo-400";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6 space-y-3">
        <h1 className="text-xl font-semibold">NexScope Workforce</h1>
        {step === "login" ? (
          <>
            <p className="text-sm text-neutral-400">Sign in to continue</p>
            <input className={input} type="email" placeholder="Email" autoComplete="off" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <input className={input} type="password" placeholder="Password" autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && login()} />
            <button disabled={busy} onClick={login} className="w-full rounded-lg bg-indigo-500 py-2 font-medium disabled:opacity-50">Sign in</button>
          </>
        ) : (
          <>
            {qr ? (
              <div className="space-y-2">
                <p className="text-sm text-neutral-400">First time: scan this QR code with Google Authenticator, then enter the 6-digit code.</p>
                <img src={qr} alt="Authenticator QR code" className="mx-auto rounded-lg bg-white p-2" width={180} height={180} />
              </div>
            ) : <p className="text-sm text-neutral-400">Enter the 6-digit code from your authenticator app.</p>}
            <input className={input} inputMode="numeric" maxLength={6} placeholder="000000" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.replace(/\D/g, "") })} onKeyDown={(e) => e.key === "Enter" && verify()} />
            <button disabled={busy || f.code.length !== 6} onClick={verify} className="w-full rounded-lg bg-indigo-500 py-2 font-medium disabled:opacity-50">Verify</button>
          </>
        )}
        {err && <p className="text-sm text-red-400">{err}</p>}
      </div>
    </main>
  );
}
