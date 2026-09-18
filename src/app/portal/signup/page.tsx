"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, User, Building2 } from "lucide-react";

const inputClass =
  "w-full bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-gray)] focus:outline-none focus:border-[var(--color-orange)] transition-colors";

function SignupForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/portal";

  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });
  const [website, setWebsite] = useState(""); // honeypot — real users never fill this in
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/portal/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
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
      <h1 className="font-display text-2xl font-black text-[var(--color-ink)] mb-1">Create Your Account</h1>
      <p className="text-sm text-[var(--color-gray)] mb-8">Track your project, files, and invoices in one place.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field — hidden from real users via CSS, bots fill every input */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
          <input
            type="text"
            placeholder="Company (optional)"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gray)]" />
          <input
            type="password"
            placeholder="Password (min. 8 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
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
          Create Account
        </button>
      </form>

      <a
        href={`/portal/login${redirectTo !== "/portal" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
        className="block text-center text-xs text-[var(--color-gray)] hover:text-[var(--color-orange)] transition-colors mt-6"
      >
        Already have an account? Sign in
      </a>
    </>
  );
}

export default function PortalSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-[var(--color-cream)] dot-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-neo-lg p-8"
      >
        <Suspense fallback={<p className="text-sm text-[var(--color-gray)]">Loading...</p>}>
          <SignupForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
