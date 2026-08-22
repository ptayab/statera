-- Store Claude language + duplicate analysis on each ticket.
-- Workers cannot read other site tickets via RLS, so a security-definer
-- function lists open reports for matching (called only from the server).

alter table public.tickets
  add column if not exists ai_analysis jsonb;

create or replace function public.list_open_reports_for_ai()
returns table (
  id uuid,
  category text,
  description text
)
language sql
stable
security definer
set search_path = public
as $$
  select t.id, t.category, t.description
  from public.tickets t
  where t.site_id = public.user_site_id()
    and t.status in ('Submitted', 'In Review', 'In Progress')
  order by t.created_at desc
  limit 40;
$$;

revoke all on function public.list_open_reports_for_ai() from public;
grant execute on function public.list_open_reports_for_ai() to authenticated;

-- Workers may log the Claude call made when they submit; supervisors may read.
create policy "ai_interactions_insert_own_or_site"
  on public.ai_interactions
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.tickets t
      where t.id = ticket_id
        and (
          t.created_by = auth.uid()
          or (
            public.is_supervisor()
            and t.site_id = public.user_site_id()
          )
        )
    )
  );

create policy "ai_interactions_select_own_or_site"
  on public.ai_interactions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tickets t
      where t.id = ticket_id
        and (
          t.created_by = auth.uid()
          or (
            public.is_supervisor()
            and t.site_id = public.user_site_id()
          )
        )
    )
  );
