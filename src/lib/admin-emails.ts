/**
 * Single source of truth for which email(s) are allowed to access /admin.
 * Deliberately has zero server-only dependencies (no jsonwebtoken, no
 * Node crypto) so it's safe to import from client components
 * (admin/login/page.tsx, staff-admin-shortcut.tsx) as well as the
 * server-side check in admin-auth.ts.
 *
 * Reads from NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS (comma-separated). Using a
 * NEXT_PUBLIC_ var means this list is visible in the client JS bundle —
 * that's an accepted tradeoff, not a new risk: the email address alone
 * grants no access (Firebase still requires the actual password, with
 * its own rate limiting), and the previous code already hardcoded the
 * single email directly in client-side files, so this is no more exposed
 * than before — just centralized and easier to update.
 *
 * Falls back to the original single email if the env var isn't set, so
 * existing deployments keep working without any change required.
 */

const FALLBACK_EMAIL = "adminncompany@gmail.com"

export function getAllowedAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS;
  if (!raw) return [FALLBACK_EMAIL];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAllowedAdminEmails().includes(email.toLowerCase());
}
