"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, CheckCircle } from "lucide-react";

const inputClass =
  "w-full bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-gray)] focus:outline-none focus:border-[var(--color-orange)] transition-colors";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/portal/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-[var(--color-gray)]">This reset link is missing its token. Please request a new one.</p>
        <a href="/portal/forgot-password" className="block text-center text-xs text-[var(--color-orange)] hover:text-[var(--color-ink)] transition-colors mt-4">
          Request a new link
        </a>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle size={32} className="text-[var(--color-orange)] mx-auto mb-4" />
        <h1 className="font-display text-lg font-black text-[var(--color-ink)] mb-2">Password updated</h1>
        <a
          href="/portal/login"
          className="neo-button inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)] shadow-neo-orange font-display text-sm font-bold px-6 py-2.5 mt-4"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-black text-[var(--color-ink)] mb-1">Set a New Password</h1>
      <p className="text-sm text-[var(--color-gray)] mb-8">Must be at least 8 characters.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="neo-button w-full flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)] shadow-neo-orange font-display text-sm font-bold py-3 disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Update Password
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-[var(--color-cream)] dot-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-neo-lg p-8"
      >
        <Suspense fallback={<p className="text-sm text-[var(--color-gray)]">Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
