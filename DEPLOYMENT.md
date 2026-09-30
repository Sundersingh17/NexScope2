# Deployment Guide

## The database problem — read this first

This app has no database yet. There's a full Prisma schema (leads, blog
posts, testimonials, services, packages, FAQs) but nothing is actually
provisioned to store any of it — `DATABASE_URL` doesn't exist anywhere.

**Firebase is not the database.** Firebase is only used for `/admin`
login (see `src/lib/firebase.ts`) and it already works — a real Firebase
project is already configured with real values. You don't need to set
anything up for Firebase. The thing that's actually missing is a
**PostgreSQL database**, which is what Prisma (and everything in `/admin`)
needs to function at all.

## Step 1 — Create a Postgres database

You have three good options. All three give you real PostgreSQL, so **none
of them require any code changes** — Prisma just needs a connection string.

### Option A — Supabase (recommended if you want a "Firebase-like" experience)
Supabase is built specifically as an open-source Firebase alternative —
same one-click dashboard, same generous free tier, same "just works"
feel — except the database underneath is real Postgres, which is exactly
what this app already expects. No code changes needed.

**Important:** Supabase requires **two** different connection strings, not
one — this is the single most common reason "it's not connecting." Supabase
sits behind PgBouncer (a connection pooler), and PgBouncer's default mode
doesn't support the prepared statements that `prisma migrate` needs. So:
- **`DATABASE_URL`** = the **pooled** connection, used by the running app
- **`DIRECT_URL`** = the **direct** connection, used only for migrations

The schema (`prisma/schema.prisma`) already has `directUrl` configured to
use this — you just need to supply both values.

1. Go to [supabase.com](https://supabase.com) → sign up (free) → **New Project**
2. Pick a name, a database password (save it — you can't view it again later,
   only reset it), and a region
3. Wait ~2 minutes for it to provision
4. Go to **Project Settings** → **Database** → **Connection String**
5. You'll see two tabs/sections: **Connection pooling** and **Direct
   connection**. Copy both:
   - Connection pooling (port `6543`) → this is your `DATABASE_URL`. Make
     sure `?pgbouncer=true` is appended at the end — Supabase usually adds
     it automatically, but double-check.
   - Direct connection (port `5432`) → this is your `DIRECT_URL`
6. In each string, replace `[YOUR-PASSWORD]` with the actual database
   password from step 2 — if your password has special characters like
   `@`, `#`, `%`, or `/`, they need to be URL-encoded or the connection
   string will silently fail to parse correctly
7. Set both `DATABASE_URL` and `DIRECT_URL` in Vercel's Environment
   Variables (and in your local `.env.local`)

Bonus: Supabase also gives you a visual table editor in its dashboard,
so you can look at your leads/blog posts/etc. without writing SQL, similar
to browsing data in the Firebase console.

### Option B — Vercel Postgres
Since this project deploys to Vercel: Project → **Storage** tab → **Create
Database** → **Postgres**. It auto-adds `DATABASE_URL` to your project's
environment variables — you don't even need to copy anything manually.

### Option C — Neon directly
Free account at [neon.tech](https://neon.tech) → create project → copy
the connection string it gives you into `DATABASE_URL` yourself. (Vercel
Postgres is actually Neon under the hood, so Option B and this are close
to the same thing — Neon direct just skips going through Vercel's UI.)

## Step 2 — Get environment variables onto your own machine

You need a local `.env.local` file to run this project (or even just
`npx prisma migrate dev`) on your computer. Two ways to get one:

**Option A — pull it from Vercel (recommended, does the work for you):**
```bash
npm install -g vercel      # if you don't have the CLI yet
vercel login
vercel link                # connects this folder to your Vercel project
vercel env pull .env.local # downloads every env var Vercel has configured
```

**Option B — create it by hand:**
Copy `.env.example` to `.env.local` and fill in real values yourself:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with the `DATABASE_URL` from Step 1, plus the
other variables below.

`.env.local` is already in `.gitignore` — it will never be committed.

## Step 3 — Run the pending migrations

Two schema changes are waiting to be applied to whatever fresh database
you just created (added during the recent upgrade work): `score` and
`temperature` fields on `Lead`, and an entirely new `Package` model.

```bash
npm install
npx prisma migrate dev --name init_upgrades
```

This creates every table the app needs, from a completely empty database.
Since the database is brand new, this is a clean first migration — there's
no existing data to worry about losing.

## Step 3.5 — Seed it with starting content (optional but recommended)

Right after migrating, every table exists but is empty — which means
`/admin` starts completely blank and every public page silently falls
back to placeholder content hardcoded in the frontend. Run this to load
the same placeholder content directly into the database instead, so you
have real rows to edit through `/admin` rather than starting from zero:

```bash
npx prisma db seed
```

This loads 8 services, 8 packages, 5 FAQs, 3 testimonials, 4 portfolio
items, and 3 blog posts — all marked published, so they show up on the
live site immediately. Safe to re-run any time (it upserts, so it won't
create duplicates). See `prisma/seed.ts` for exactly what it adds.

## Step 4 — Required environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `DATABASE_URL` | **Yes** | Postgres connection string (Step 1) |
| `RESEND_API_KEY` | Yes, for email | Get one at [resend.com](https://resend.com). Without it, forms still save leads to the database but no emails send. |
| `CONTACT_EMAIL` | Recommended | Where internal "new lead" notification emails go |
| `SLACK_WEBHOOK_URL` | Optional | Instant Slack alert when a lead scores "hot" — see `src/lib/lead-scoring.ts` |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics — gated behind the cookie-consent banner either way |
| `NEXT_PUBLIC_CLARITY_ID` | Optional | Microsoft Clarity — same, gated behind consent |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Used for absolute URLs (sitemap, OpenGraph, etc.) |
| `CLIENT_AUTH_SECRET` | Required once the client portal is used | Signs client portal session cookies — separate from Firebase. Generate with `openssl rand -hex 32` |
| `BLOB_READ_WRITE_TOKEN` | Required for admin media uploads | Powers photo/video upload in `/admin`. Vercel Storage tab → Create Database → Blob — auto-added to your env vars, same as Postgres. |

⚠️ **A previous Resend API key was accidentally committed to this repo in
an earlier version of this file.** If you haven't already, rotate it in
your Resend dashboard — treat it as compromised regardless of whether
it's still in use.

There is **no `JWT_SECRET`, `ADMIN_EMAIL`, or `ADMIN_PASSWORD_HASH`** to
set — an earlier, unused parallel admin-login system that used those was
removed. `/admin` login is entirely Firebase-based; see the note in
`.env.example` if you need to change which email is allowed to log in.

## How to add environment variables in Vercel

1. Project → **Settings** → **Environment Variables**
2. Add each one from the table above, for **Production**, **Preview**,
   and **Development**
3. **Redeploy** after adding or changing any of them — Vercel doesn't
   pick up new env vars on an already-running deployment

## Verify everything works

After deploying with a real `DATABASE_URL`:

1. Log into `/admin` with the Firebase account tied to `ALLOWED_EMAIL` in
   `src/lib/admin-auth.ts`
2. Add a test entry in any tab (Testimonials, Portfolio, Blog, Services,
   Packages, FAQ) and confirm it appears on the corresponding public page
3. Submit the contact form and the quote form — check that a `Lead` row
   appears in the Leads tab, and that notification/auto-reply emails
   arrive if `RESEND_API_KEY` is set

## "It's not connecting" — troubleshooting

In rough order of likelihood:

1. **Only `DATABASE_URL` is set, `DIRECT_URL` is missing** — `prisma migrate`
   will fail against Supabase's pooled connection specifically. This is the
   single most common cause. Make sure both are set (see Option A above).
2. **Special characters in the database password aren't URL-encoded** — if
   your password contains `@`, `#`, `%`, `/`, `:`, or spaces, the connection
   string won't parse correctly. Either regenerate a password without
   special characters (Supabase → Database settings → Reset password), or
   URL-encode the existing one (e.g. `@` becomes `%40`).
3. **Using the pooled string for migrations, or the direct string for the
   running app** — they're not interchangeable; each env var has one job
   (see above).
4. **`?pgbouncer=true` missing from `DATABASE_URL`** — required on the
   pooled connection string specifically.
5. **Env vars set in Vercel but not redeployed** — Vercel doesn't apply new
   environment variables to an already-running deployment; you need to
   trigger a new deployment after adding/changing them.
6. **Testing locally without `.env.local` actually being read** — confirm
   the file is named exactly `.env.local` (not `.env.example` or `.env`)
   and is in the project root, not inside `src/`.
7. **Supabase free-tier project paused from inactivity** — free Supabase
   projects can pause after a period of no activity. Check the Supabase
   dashboard; there's a one-click "restore" if so.

If none of those are it: run `npx prisma db pull` locally with your env
vars set — if it can't reach the database, it'll give you the actual
underlying connection error (auth failure, host unreachable, SSL issue,
etc.), which is far more specific than a generic "not connecting" and is
worth pasting back for help.

## Setting up a team email for admin access

If you want the team to share one email/password to log into `/admin` (or
to add several individual team-member emails instead — see the note
below on which is safer), here's exactly how:

1. **Create the email account first**, outside of Firebase — e.g. a
   Google Workspace address like `team@nexscope.in`, or even a plain
   Gmail. This is just a normal email account; Firebase doesn't create
   it for you.
2. Go to the [Firebase Console](https://console.firebase.google.com) →
   your `nexscope-20df9` project → **Authentication** → **Users** tab.
3. Click **Add user**, enter that email and a password. This creates the
   login credential Firebase will check against.
4. Set `NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS` (in Vercel's env vars) to that
   exact email address, then redeploy.
5. Remove the old admin's Firebase user (same Users tab) if you're
   fully replacing it rather than adding to it.

**Worth considering instead:** rather than one shared login, add each
team member's own email to the same env var, comma-separated (e.g.
`alice@nexscope.in,bob@nexscope.in`), and create a separate Firebase
user for each. Individual logins mean you can revoke just one person's
access later without changing a password everyone shares, and you get
real accountability for who did what. Either approach works with the
code as-is — it's a policy choice, not a technical limitation.

**On storing credentials for various services (Vercel, Supabase, Resend,
etc.):** don't put these in the shared email inbox. Email isn't built
for secret storage — no encryption at rest for that purpose, no audit
trail, and a single compromised inbox exposes everything at once. Use a
password manager with team/shared-vault support instead (Bitwarden has
a free tier with this; 1Password is the paid alternative) — same
convenience, real security.

## Troubleshooting (general)

- **500 errors on form submission** → almost always `DATABASE_URL` missing
  or wrong. Check Vercel's function logs.
- **`/admin` tabs show "No data yet" even after adding content** → confirm
  you ran the migration (Step 3) against the *same* database Vercel is
  actually using in production, not a different local one.
- **Emails not sending** → verify `RESEND_API_KEY` is valid and set for
  the right environment (Production vs Preview vs Development are
  separate in Vercel).
