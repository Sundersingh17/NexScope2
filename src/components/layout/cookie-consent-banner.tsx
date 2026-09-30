"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronDown } from "lucide-react";
import {
  getStoredConsent,
  storeConsent,
  OPEN_COOKIE_SETTINGS_EVENT,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(true);

  useEffect(() => {
    // Show on first visit — i.e. whenever there's no stored decision yet.
    if (!getStoredConsent()) setVisible(true);

    // Let a "Cookie Settings" link elsewhere on the site (see footer.tsx)
    // reopen this banner so visitors can change their mind later.
    function reopen() {
      setExpanded(true);
      setVisible(true);
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  function acceptAll() {
    storeConsent(true);
    setVisible(false);
  }

  function rejectNonEssential() {
    storeConsent(false);
    setVisible(false);
  }

  function savePreferences() {
    storeConsent(analyticsChecked);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
        >
          <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                <Cookie size={16} className="text-zinc-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 leading-relaxed">
                  We use necessary cookies to run this site, and — only with your permission —
                  analytics cookies to understand how it's used. You can change this anytime from
                  the "Cookie Settings" link in the footer.{" "}
                  <a href="/cookie-policy" className="underline text-zinc-400 hover:text-white transition-colors">
                    Read our Cookie Policy
                  </a>
                  .
                </p>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3 pt-4 border-t border-white/10">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium text-zinc-200">Necessary</p>
                            <p className="text-[0.7rem] text-zinc-500">
                              Required for the site to function. Always on.
                            </p>
                          </div>
                          <span className="text-[0.65rem] text-zinc-500 shrink-0 mt-0.5">Always on</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium text-zinc-200">Analytics</p>
                            <p className="text-[0.7rem] text-zinc-500">
                              Google Analytics &amp; Microsoft Clarity — helps us understand site usage.
                            </p>
                          </div>
                          <label className="inline-flex items-center shrink-0 mt-0.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={analyticsChecked}
                              onChange={(e) => setAnalyticsChecked(e.target.checked)}
                              className="sr-only peer"
                            />
                            <span className="w-9 h-5 rounded-full bg-white/10 peer-checked:bg-white/80 transition-colors relative">
                              <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-zinc-900 peer-checked:bg-white peer-checked:translate-x-4 transition-transform" />
                            </span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button
                    onClick={acceptAll}
                    className="bg-white text-black text-xs font-medium rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={rejectNonEssential}
                    className="bg-white/[0.06] border border-white/10 text-zinc-300 text-xs font-medium rounded-full px-5 py-2.5 hover:bg-white/10 transition-colors"
                  >
                    Reject Non-Essential
                  </button>
                  {expanded ? (
                    <button
                      onClick={savePreferences}
                      className="text-xs font-medium text-zinc-300 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Save Preferences
                    </button>
                  ) : (
                    <button
                      onClick={() => setExpanded(true)}
                      className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                      Manage Preferences <ChevronDown size={12} />
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={rejectNonEssential}
                aria-label="Dismiss (treated as rejecting non-essential cookies)"
                className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
