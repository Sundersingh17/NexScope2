"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/portal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-[var(--color-cream)] dot-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-neo-lg p-8"
      >
        {sent ? (
          <div className="text-center">
            <CheckCircle size={32} className="text-[var(--color-orange)] mx-auto mb-4" />
            <h1 className="font-display text-lg font-black text-[var(--color-ink)] mb-2">Check your email</h1>
            <p className="text-sm text-[var(--color-gray)]">
              If that email is registered, a password reset link is on its way. It expires in 30 minutes.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-black text-[var(--color-ink)] mb-1">Reset Password</h1>
            <p className="text-sm text-[var(--color-gray)] mb-8">Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-gray)] focus:outline-none focus:border-[var(--color-orange)] transition-colors"
                />
              </div>

              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="neo-button w-full flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)] shadow-neo-orange font-display text-sm font-bold py-3 disabled:opacity-60"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Send Reset Link
              </button>
            </form>
          </>
        )}

        <a href="/portal/login" className="block text-center text-xs text-[var(--color-gray)] hover:text-[var(--color-orange)] transition-colors mt-6">
          Back to sign in
        </a>
      </motion.div>
    </div>
  );
}
