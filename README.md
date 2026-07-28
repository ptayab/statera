# Statera

Mobile-friendly safety reporting for mine sites — workers submit issues, supervisors act with a full audit trail, AI coaches without automating decisions.

## Documentation

| Document | Purpose |
|----------|---------|
| [`docs/02_product_spec.md`](docs/02_product_spec.md) | Product requirements and guardrails (source of truth) |
| [`docs/01_roadmap.md`](docs/01_roadmap.md) | Build phases and v1 scope limits |
| [`docs/03_pilot_playbook.md`](docs/03_pilot_playbook.md) | Pilot launch, onboarding, and operations |
| [`docs/dev_guide/00_START_HERE.md`](docs/dev_guide/00_START_HERE.md) | Staged build guide — start here for implementation |
| [`.cursor/rules/statera.md`](.cursor/rules/statera.md) | AI assistant rules for day-to-day coding |

## Stack

Next.js (App Router) · Supabase · Vercel · Resend · Anthropic API

## Status

**Phase 1 (dev guide stage 06)** — Supervisor dashboard with ticket list, detail, status changes, and audit history. Apply the stage 06 migration before testing actions.

## Local development

### 1. Clone and install

```bash
git clone <your-repo-url>
cd statera
npm install
```

### 2. Run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/login` if you are not signed in.

## Database setup (stage 03)

Everyone on the team shares **one** Supabase project (created in dev guide stage 01). Do not create a separate project per laptop.

### Step 1 — Get your Supabase keys

1. Sign in at [supabase.com](https://supabase.com) and open the **statera** project.
2. Go to **Project Settings** (gear icon) → **API**.
3. Copy these two values:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`) — use the **Project URL** field only, **not** the REST or GraphQL endpoint URLs
   - **anon public** key (under "Project API keys")

   Common mistake: pasting `https://xxxxx.supabase.co/rest/v1/` causes `Invalid path specified in request URL` on sign-in. The URL must end at `.co` with no path after it.

Keep the **service_role** key private — you will not need it until a later stage, and it must never go in frontend code or git.

### Step 2 — Add keys to `.env.local`

In the project root, create or edit `.env.local` (this file is gitignored):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Restart `npm run dev` after saving so Next.js picks up the new values.

### Step 3 — Apply the database migration

The schema lives in `supabase/migrations/20250630000001_initial_schema.sql`. It creates four tables: `users`, `tickets`, `ticket_events`, and `ai_interactions`. Row-level security is added in stage 04 — this migration only creates the tables.

**Option A — Supabase SQL Editor (recommended for first setup)**

1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Open `supabase/migrations/20250630000001_initial_schema.sql` in your editor, copy the entire file, and paste it into the SQL Editor.
3. Click **Run**. You should see a success message with no errors.

**Option B — Supabase CLI**

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and linked to the project:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Only one person needs to run the migration on the shared project. If the tables already exist, skip this step.

### Step 4 — Verify the schema

In the Supabase dashboard, open **Table Editor** and confirm all four tables are listed:

| Table | Purpose |
|-------|---------|
| `users` | App profile per person (role, site) — links to Supabase Auth |
| `tickets` | Reported safety issues |
| `ticket_events` | Append-only audit log for ticket history |
| `ai_interactions` | One row per AI API call |

Click into each table and check that the columns match the migration file.

### Step 5 — Smoke test (optional)

Full ticket inserts require a `users` row (stage 04 adds signup). For now, confirm the migration ran by checking that the tables and enums exist under **Database** → **Tables** in the dashboard.

After stage 04, you can insert test data through the app. Until then, verifying the four tables exist is enough.

## Authentication setup (stage 04)

### Step 1 — Enable email/password auth in Supabase

1. In the Supabase dashboard, go to **Authentication** → **Providers**.
2. Open **Email** and make sure it is enabled.
3. For the pilot, leave **Confirm email** off so test accounts can sign in immediately without clicking a link.

### Step 2 — Apply the RLS migration

Run `supabase/migrations/20250630000002_rls_policies.sql` in the **SQL Editor** (same process as stage 03). This enables row-level security so workers only see their own tickets and supervisors see all tickets for their site.

Only one person needs to run this on the shared project.

### Step 3 — Create test accounts

Accounts are created manually for the pilot — there is no open self-signup.

**A. Create auth users**

1. Go to **Authentication** → **Users** → **Add user** → **Create new user**.
2. Create one worker and one supervisor (e.g. `worker@pilot.test` and `supervisor@pilot.test`).
3. Copy each user's **User UID** from the users list.

**B. Add matching rows in the `users` table**

The `id` column must be the **exact User UID** from step A — a real UUID like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`. Do not paste the placeholder text from this doc; Postgres will reject it.

**How to copy the UID:**
1. Go to **Authentication** → **Users**.
2. Click a user row to open their details.
3. Copy the value in the **User UID** field (or the **UID** column in the list).

In the **SQL Editor**, run one insert per user (easiest while setting up). Replace the example UUID below with the one you copied:

```sql
-- Worker (replace id with the worker's User UID from Authentication → Users)
insert into public.users (id, email, name, role, site_id)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'worker@pilot.test',
  'Test Worker',
  'worker',
  '00000000-0000-0000-0000-000000000001'
);

-- Supervisor (replace id with the supervisor's User UID)
insert into public.users (id, email, name, role, site_id)
values (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'supervisor@pilot.test',
  'Test Supervisor',
  'supervisor',
  '00000000-0000-0000-0000-000000000001'
);
```

The `email` in each row must match the email on the auth user exactly.

All pilot accounts share the same `site_id` (`00000000-0000-0000-0000-000000000001`) until multi-site support is needed.

### Step 4 — Verify login and RLS

1. Run `npm run dev` and open [http://localhost:3000/login](http://localhost:3000/login).
2. Sign in as the **worker** — you should land on `/worker`.
3. Sign out, then sign in as the **supervisor** — you should land on `/supervisor`.
4. Visiting `/supervisor` while logged in as a worker should redirect you to `/worker` (and vice versa).
5. **RLS check:** In the SQL Editor, run `select auth.uid();` while impersonating the worker (Supabase → SQL Editor → role dropdown, or use the RLS policy tester). A worker querying `tickets` they did not create should return zero rows.

## Ticket submission setup (stage 05)

### Step 1 — Apply the storage migration

Run `supabase/migrations/20250630000003_ticket_photos_storage.sql` in the **SQL Editor**. This creates the private `ticket-photos` bucket and upload/read policies for workers and supervisors.

Only one person needs to run this on the shared project.

### Step 2 — Test as a worker

1. Sign in as a **worker** and open [http://localhost:3000/worker/submit](http://localhost:3000/worker/submit).
2. Pick a category, add a short description, optionally attach a photo, and submit.
3. Confirm you see the success message. If you chose **Dangerous Occurrence**, the regulatory reminder must appear both before and after submit.
4. In Supabase **Table Editor**, check:
   - `tickets` — new row with status `Submitted`, your `site_id`, and optional `photo_url`
   - `ticket_events` — matching row with `event_type` = `created` and your user id as `actor`
5. Test on a **real phone** if possible — the form is built for mobile (large tap targets, optional camera capture).

Photo upload errors usually mean the storage migration was not applied yet.

## Supervisor dashboard setup (stage 06)

### Step 1 — Apply the supervisor actions migration

Run `supabase/migrations/20250630000004_supervisor_ticket_actions.sql` in the **SQL Editor**. This adds:

- RLS so supervisors can read worker names at their site
- Database functions that change status, assign, and add notes **atomically** with `ticket_events` rows

### Step 2 — Test as a supervisor

1. Sign in as a **supervisor** and open [http://localhost:3000/supervisor](http://localhost:3000/supervisor).
2. Confirm submitted tickets appear in the list. Use status and category filters.
3. Click a ticket to open its detail view — description, photo (if any), and history.
4. Change status several times, assign to yourself, and add a note.
5. Confirm each action appears in the **History** section in order.
6. In Supabase **Table Editor**, verify `tickets.status` matches the UI and each action has a matching `ticket_events` row with your supervisor id as `actor`.

## Checklist before moving to stage 07

- [ ] Migration `20250630000004_supervisor_ticket_actions.sql` is applied
- [ ] Supervisor sees all site tickets and can filter the list
- [ ] Status changes, assignments, and notes all appear in ticket history
- [ ] Every supervisor action has a matching row in `ticket_events`

## Checklist before moving to stage 06

- [ ] Storage migration `20250630000003_ticket_photos_storage.sql` is applied
- [ ] Worker can submit a ticket with and without a photo in under a minute on a phone
- [ ] Dangerous Occurrence shows the regulatory reminder prominently
- [ ] New rows appear in both `tickets` and `ticket_events`

## Checklist before moving to stage 05

- [ ] RLS migration `20250630000002_rls_policies.sql` is applied
- [ ] Test worker and supervisor accounts exist in both **Authentication** and the `users` table
- [ ] Worker login reaches `/worker`; supervisor login reaches `/supervisor`
- [ ] Logged-out visitors are redirected to `/login`

## Checklist before moving to stage 04 (stage 03)

- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` filled in
- [ ] `npm run dev` runs without errors
- [ ] All four tables appear in the Supabase Table Editor
- [ ] Migration file `supabase/migrations/20250630000001_initial_schema.sql` is committed in git
- [ ] You have **not** committed `.env.local` or any API keys (`git status` should not list it)

## Deployment

Statera deploys to **Vercel** (frontend) with **Supabase** (database/auth/storage). Pushes to `main` go through CI first, then Vercel promotes to production.

### Pipeline overview

```
PR or push → GitHub Actions (lint + build)
           → Vercel preview deploy (PR) or production deploy (main)
migration change on main → GitHub Actions (supabase db push)
```

| Step | What runs it | When |
|------|--------------|------|
| Lint + build | `.github/workflows/ci.yml` | Every push/PR to `main` |
| App deploy | Vercel (GitHub integration) | Every push; production on `main` |
| DB migrations | `.github/workflows/supabase-migrations.yml` | Migration files change on `main` |

### One-time Vercel setup

1. Sign in at [vercel.com](https://vercel.com) with the GitHub account that owns `ptayab/statera`.
2. **Add New Project** → import the `statera` repo.
3. Framework preset should detect **Next.js** automatically. Leave build command as `npm run build` and output as default.
4. Under **Environment Variables**, add (for Production, Preview, and Development):
   - `NEXT_PUBLIC_SUPABASE_URL` — same value as in your `.env.local`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — same anon key as in `.env.local`
5. Click **Deploy**. Vercel will build and give you a `*.vercel.app` URL.

After this, every merge to `main` triggers a production deploy automatically. Pull requests get their own preview URLs.

### One-time GitHub secrets (for automatic migrations)

In the GitHub repo → **Settings** → **Secrets and variables** → **Actions**, add:

| Secret | Where to get it |
|--------|-----------------|
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_REF` | The subdomain in your project URL (`xxxxx` in `https://xxxxx.supabase.co`) |

Until these are set, apply migrations manually in the Supabase SQL Editor (as in the setup sections above). The migration workflow only runs when files under `supabase/migrations/` change.

### Verify a deploy

1. Confirm the latest GitHub Actions **CI** workflow is green on `main`.
2. Open the Vercel production URL and sign in as a test worker and supervisor.
3. Submit a ticket on a phone-sized browser window; confirm it appears on the supervisor dashboard.

### Environment variables reference

Copy `.env.example` to `.env.local` for local dev. Vercel needs the same `NEXT_PUBLIC_*` values at deploy time.

| Variable | Required now | Used for |
|----------|--------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase client (browser + server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase client (browser + server) |
| `ANTHROPIC_API_KEY` | Stage 07+ | AI worker coach |
| `RESEND_API_KEY` | Stage 08+ | Transactional email |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only stages | Bypass RLS for trusted server jobs — never expose to the browser |

## Project layout

| Folder | Purpose |
|--------|---------|
| `app/` | Routes and pages (App Router) |
| `components/` | Shared UI components |
| `lib/supabase/` | Supabase client and TypeScript types |
| `supabase/migrations/` | Database schema changes (apply in order) |
| `.github/workflows/` | CI and Supabase migration automation |
| `docs/` | Product spec, roadmap, and staged dev guide (local only — gitignored) |
