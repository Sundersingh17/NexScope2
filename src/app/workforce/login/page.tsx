"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/workforce/client";

type LoginResponse = {
  token: string;
  step: string;
};

type TotpSetupResponse = {
  qr: string;
};

type TotpVerifyResponse = {
  role: string;
};

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

export default function WorkforceLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "totp">("login");
  const [f, setF] = useState({ email: "", password: "", code: "" });
  const [token, setToken] = useState("");
  const [qr, setQr] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<void>) {
    setErr("");
    setBusy(true);

    try {
      await fn();
    } catch (error: unknown) {
      setErr(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  const login = () =>
    run(async () => {
      const response = await api<LoginResponse>("/auth/login", {
        body: { email: f.email, password: f.password },
      });

      setToken(response.token);

      if (response.step === "setup") {
        const setup = await api<TotpSetupResponse>("/auth/totp/setup", {
          body: { token: response.token },
        });
        setQr(setup.qr);
      } else {
        setQr("");
      }

      setStep("totp");
    });

  const verify = () =>
    run(async () => {
      const response = await api<TotpVerifyResponse>("/auth/totp/verify", {
        body: { token, code: f.code },
      });

      router.push(
        response.role === "ADMIN" ? "/workforce/admin" : "/workforce"
      );
    });

  const input =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-indigo-400";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 text-neutral-100">
      <div className="w-full max-w-sm space-y-3 rounded-2xl border border-white/10 bg-neutral-900 p-6">
        <h1 className="text-xl font-semibold">NexScope Workforce</h1>

        {step === "login" ? (
          <>
            <p className="text-sm text-neutral-400">Sign in to continue</p>
            <input
              className={input}
              type="email"
              placeholder="Email"
              autoComplete="off"
              value={f.email}
              onChange={(event) =>
                setF({ ...f, email: event.target.value })
              }
            />
            <input
              className={input}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={f.password}
              onChange={(event) =>
                setF({ ...f, password: event.target.value })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") login();
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={login}
              className="w-full rounded-lg bg-indigo-500 py-2 font-medium disabled:opacity-50"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            {qr ? (
              <div className="space-y-2">
                <p className="text-sm text-neutral-400">
                  First time: scan this QR code with Google Authenticator, then
                  enter the 6-digit code.
                </p>
                {/* The QR value is provided by the TOTP setup API. */}
                <img
                  src={qr}
                  alt="Authenticator QR code"
                  className="mx-auto rounded-lg bg-white p-2"
                  width={180}
                  height={180}
                />
              </div>
            ) : (
              <p className="text-sm text-neutral-400">
                Enter the 6-digit code from your authenticator app.
              </p>
            )}

            <input
              className={input}
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={f.code}
              onChange={(event) =>
                setF({
                  ...f,
                  code: event.target.value.replace(/\D/g, ""),
                })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") verify();
              }}
            />
            <button
              type="button"
              disabled={busy || f.code.length !== 6}
              onClick={verify}
              className="w-full rounded-lg bg-indigo-500 py-2 font-medium disabled:opacity-50"
            >
              Verify
            </button>
          </>
        )}

        {err && (
          <p role="alert" className="text-sm text-red-400">
            {err}
          </p>
        )}
      </div>
    </main>
  );
}
