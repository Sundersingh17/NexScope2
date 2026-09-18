"use client";

/**
 * Minimal cookie-consent state, stored in localStorage on the visitor's own
 * browser (not sent anywhere). Two categories only, matching what this site
 * actually uses:
 *   - necessary: always on — session/security cookies the site needs to function
 *   - analytics: Google Analytics + Microsoft Clarity, gated behind consent
 *
 * Required because the site loads GA/Clarity (see analytics-scripts.tsx)
 * and collects personal data through contact/quote forms — India's DPDP
 * Act requires clear, informed consent before that happens, and the site
 * previously had no consent mechanism at all.
 */

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  decidedAt: string; // ISO timestamp, kept for an audit trail if ever needed
}

const STORAGE_KEY = "nx_cookie_consent";
export const CONSENT_CHANGED_EVENT = "nx-cookie-consent-changed";
export const OPEN_COOKIE_SETTINGS_EVENT = "nx-open-cookie-settings";

export function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics === "boolean") return parsed as ConsentState;
    return null;
  } catch {
    return null;
  }
}

export function storeConsent(analytics: boolean): void {
  if (typeof window === "undefined") return;
  const state: ConsentState = { necessary: true, analytics, decidedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: state }));
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent()?.analytics === true;
}

/** Clears the stored choice so the banner reappears — used by "reset consent"
 *  flows if ever needed; not currently wired to any button. */
export function clearConsent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: null }));
}
