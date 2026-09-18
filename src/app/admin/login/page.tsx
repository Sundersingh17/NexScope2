"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { isAllowedAdminEmail } from "@/lib/admin-emails";

export default function AdminLoginPage() {
  const router = useRouter();

  // Add CSP meta tag at component level for Firebase auth (works in dev mode too)
  useEffect(() => {
    // Check if meta tag exists
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingMeta) {
      const meta = document.createElement("meta");
      meta.httpEquiv = "Content-Security-Policy";
      meta.content = "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://*.firebaseapp.com; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com; frame-src 'self' https://apis.google.com; img-src 'self' blob: data: https://*.googleusercontent.com;";
      document.head.appendChild(meta);
    }
  }, []);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAllowedAdminEmail(user.email)) {
        router.push("/admin");
      } else if (user) {
        // Sign out if not an allowed admin email
        auth.signOut();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const checkAllowedEmail = (userEmail: string | null): boolean => {
    return isAllowedAdminEmail(userEmail);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!checkAllowedEmail(userCredential.user.email)) {
        await auth.signOut();
        setError("Access denied. Only authorized emails can access the admin panel.");
        setLoading(false);
        return;
      }
      
      router.push("/admin");
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Invalid password",
        "auth/invalid-credential": "Invalid email or password",
        "auth/too-many-requests": "Too many attempts. Please try again later",
      };
      setError(errorMessages[err.code] || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (!checkAllowedEmail(result.user.email)) {
        await auth.signOut();
        setError("Access denied. This account isn't authorized for admin access.");
        setLoading(false);
        return;
      }
      
      router.push("/admin");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setLoading(false);
        return;
      }
      if (err.message?.includes("Access denied")) {
        setError(err.message);
      } else {
        setError("Google login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="admin-login-logo w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <img src="/logo/nexscope-mark.png" alt="NexScope" className="h-12 w-12 object-contain" />
          </div>
          <p className="admin-kicker">NEXSCOPE / CONTROL ROOM</p>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight">Admin Login</h1>
          <p className="admin-login-muted text-sm mt-1">Manage the work behind the work.</p>
          <p className="admin-login-muted text-xs mt-2">Authorized access only</p>
        </div>

        <div className="admin-login-card p-8 space-y-5">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-full py-3 text-sm font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--color-cream)] px-4 admin-login-muted">or sign in with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@nexscope.in"
                  className="admin-login-input w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="admin-login-input w-full rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/50 hover:text-[var(--color-orange)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-login-submit w-full rounded-full py-3 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In with Email"
              )}
            </button>
          </form>
        </div>

        <p className="admin-login-muted text-center text-xs mt-6">
          Access is restricted to authorized team accounts
        </p>
      </div>
    </div>
  );
}