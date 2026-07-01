-- Statera row-level security (stage 04)
-- Workers see only their own tickets; supervisors see all tickets for their site.

-- Helper: true when the logged-in user is a supervisor.
create or replace function public.is_supervisor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'supervisor'
  );
$$;

-- Helper: the logged-in user's site_id (used to scope supervisor access).
create or replace function public.user_site_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select site_id from public.users where id = auth.uid();
$$;

-- ── users ────────────────────────────────────────────────────────────────────

alter table public.users enable row level security;

-- Each person can read their own profile (role, site_id) after login.
create policy "users_select_own"
  on public.users
  for select
  to authenticated
  using (id = auth.uid());

-- ── tickets ──────────────────────────────────────────────────────────────────

alter table public.tickets enable row level security;

-- Workers can file tickets for their own site only.
create policy "tickets_insert_worker"
  on public.tickets
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and site_id = public.user_site_id()
    and not public.is_supervisor()
  );

-- Workers can read tickets they created.
create policy "tickets_select_worker_own"
  on public.tickets
  for select
  to authenticated
  using (
    created_by = auth.uid()
    and not public.is_supervisor()
  );

-- Supervisors can read every ticket at their site.
create policy "tickets_select_supervisor_site"
  on public.tickets
  for select
  to authenticated
  using (
    public.is_supervisor()
    and site_id = public.user_site_id()
  );

-- Supervisors can update tickets at their site (status changes, notes in later stages).
create policy "tickets_update_supervisor_site"
  on public.tickets
  for update
  to authenticated
  using (
    public.is_supervisor()
    and site_id = public.user_site_id()
  )
  with check (
    public.is_supervisor()
    and site_id = public.user_site_id()
  );

-- ── ticket_events ──────────────────────────────────────────────────────────────

alter table public.ticket_events enable row level security;

-- Workers can read audit events for their own tickets.
create policy "ticket_events_select_worker_own"
  on public.ticket_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tickets t
      where t.id = ticket_id
        and t.created_by = auth.uid()
        and not public.is_supervisor()
    )
  );

-- Supervisors can read audit events for tickets at their site.
create policy "ticket_events_select_supervisor_site"
  on public.ticket_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tickets t
      where t.id = ticket_id
        and t.site_id = public.user_site_id()
        and public.is_supervisor()
    )
  );

-- Workers can append events when submitting their own tickets (stage 05).
create policy "ticket_events_insert_worker_own"
  on public.ticket_events
  for insert
  to authenticated
  with check (
    actor = auth.uid()
    and exists (
      select 1
      from public.tickets t
      where t.id = ticket_id
        and t.created_by = auth.uid()
        and not public.is_supervisor()
    )
  );

-- Supervisors can append events (status changes, notes) on site tickets.
create policy "ticket_events_insert_supervisor_site"
  on public.ticket_events
  for insert
  to authenticated
  with check (
    actor = auth.uid()
    and public.is_supervisor()
    and exists (
      select 1
      from public.tickets t
      where t.id = ticket_id
        and t.site_id = public.user_site_id()
    )
  );

-- ── ai_interactions ──────────────────────────────────────────────────────────
-- Locked down until stage 08; no policies yet means authenticated users cannot read/write.

alter table public.ai_interactions enable row level security;
