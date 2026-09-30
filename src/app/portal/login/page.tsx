"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail } from "lucide-react";

const inputClass =
  "w-full bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-gray)] focus:outline-none focus:border-[var(--color-orange)] transition-colors";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }
      window.location.href = redirectTo;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-2xl font-black text-[var(--color-ink)] mb-1">Client Portal</h1>
      <p className="text-sm text-[var(--color-gray)] mb-8">Sign in to see your project status, files, and invoices.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          Sign In
        </button>
      </form>

      <div className="flex items-center justify-between mt-6">
        <a
          href={`/portal/signup${redirectTo !== "/portal" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
          className="text-xs text-[var(--color-gray)] hover:text-[var(--color-orange)] transition-colors"
        >
          Need an account? Sign up
        </a>
        <a href="/portal/forgot-password" className="text-xs text-[var(--color-gray)] hover:text-[var(--color-orange)] transition-colors">
          Forgot password?
        </a>
      </div>
    </>
  );
}

export default function PortalLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-[var(--color-cream)] dot-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-neo-lg p-8"
      >
        <Suspense fallback={<p className="text-sm text-[var(--color-gray)]">Loading...</p>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
