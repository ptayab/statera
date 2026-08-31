-- Supervisor judgement of the live AI ranking. Stored on the ticket so
-- feedback does not write a ticket_event (which would reset dormancy).
-- human_agreed on ai_interactions is filled when a Claude row already exists.

alter table public.tickets
  add column if not exists ai_ranking_feedback jsonb;

create policy "ai_interactions_update_supervisor_site"
  on public.ai_interactions
  for update
  to authenticated
  using (
    public.is_supervisor()
    and exists (
      select 1
      from public.tickets t
      where t.id = ticket_id
        and t.site_id = public.user_site_id()
    )
  )
  with check (
    public.is_supervisor()
    and exists (
      select 1
      from public.tickets t
      where t.id = ticket_id
        and t.site_id = public.user_site_id()
    )
  );

-- Workers submit reports but cannot read other site tickets. This curated
-- function exposes only recent supervisor guidance needed by the AI prompt.
create or replace function public.list_ranking_feedback_for_ai()
returns table (
  category text,
  description text,
  ranking_label text,
  ranking_score integer,
  agreed boolean,
  reason text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.category,
    left(t.description, 500),
    t.ai_ranking_feedback->>'label',
    case
      when (t.ai_ranking_feedback->>'score') ~ '^-?[0-9]+$'
        then (t.ai_ranking_feedback->>'score')::integer
      else 0
    end,
    case t.ai_ranking_feedback->>'agreed'
      when 'true' then true
      else false
    end,
    left(t.ai_ranking_feedback->>'reason', 500)
  from public.tickets t
  where t.site_id = public.user_site_id()
    and nullif(trim(t.ai_ranking_feedback->>'reason'), '') is not null
  order by t.ai_ranking_feedback->>'at' desc nulls last
  limit 20;
$$;

revoke all on function public.list_ranking_feedback_for_ai() from public;
grant execute on function public.list_ranking_feedback_for_ai() to authenticated;
