-- Statera initial schema (stage 03)
-- RLS policies are added in stage 04 after auth is wired up.

-- Ticket lifecycle: only humans change status (enforced in app code + RLS in stage 04).
create type public.ticket_status as enum (
  'Submitted',
  'In Review',
  'In Progress',
  'Resolved',
  'Closed'
);

create type public.user_role as enum ('worker', 'supervisor');

create type public.ai_prompt_type as enum ('worker_coach', 'pattern_check');

-- App profile per person. Links 1:1 to Supabase auth so the same login system
-- can show workers a submission form and supervisors a dashboard.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  role public.user_role not null,
  site_id uuid not null,
  created_at timestamptz not null default now()
);

-- One reported safety issue. Core entity of the app.
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.users (id) on delete restrict,
  site_id uuid not null,
  category text not null,
  description text not null,
  photo_url text,
  status public.ticket_status not null default 'Submitted',
  ai_suggested_category text,
  ai_suggested_priority text,
  ai_explanation text,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

-- Append-only audit log for ticket history. Nothing is overwritten — every
-- status change, assignment, and note is a new row for the supervisor audit trail.
create table public.ticket_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  event_type text not null,
  actor uuid references public.users (id) on delete set null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- One row per AI API call. Separate from ticket_events so we can track
-- human_agreed (did the supervisor's decision match the AI suggestion?).
create table public.ai_interactions (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  prompt_type public.ai_prompt_type not null,
  output jsonb not null,
  human_agreed boolean,
  created_at timestamptz not null default now()
);

create index tickets_site_id_idx on public.tickets (site_id);
create index tickets_created_by_idx on public.tickets (created_by);
create index tickets_status_idx on public.tickets (status);
create index ticket_events_ticket_id_idx on public.ticket_events (ticket_id);
create index ai_interactions_ticket_id_idx on public.ai_interactions (ticket_id);
