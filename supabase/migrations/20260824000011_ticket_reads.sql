-- Last time each person opened a ticket. Used to surface updates they have not seen.

create table public.ticket_reads (
  user_id uuid not null references public.users (id) on delete cascade,
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  last_seen_at timestamptz not null default now(),
  primary key (user_id, ticket_id)
);

create index ticket_reads_ticket_id_idx on public.ticket_reads (ticket_id);

alter table public.ticket_reads enable row level security;

create policy "ticket_reads_select_own"
  on public.ticket_reads
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "ticket_reads_insert_own"
  on public.ticket_reads
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "ticket_reads_update_own"
  on public.ticket_reads
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update on public.ticket_reads to authenticated;

-- Existing tickets should not flood the bell. Only activity after this
-- migration (or tickets opened later) counts as unseen.
insert into public.ticket_reads (user_id, ticket_id, last_seen_at)
select u.id, t.id, now()
from public.tickets t
join public.users u
  on (u.role = 'worker' and u.id = t.created_by)
  or (u.role = 'supervisor' and u.id = t.assigned_to)
on conflict do nothing;
