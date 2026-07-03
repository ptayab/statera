-- Statera supervisor ticket actions (stage 06)
-- Atomic updates: every tickets change is paired with a ticket_events row.

-- Supervisors need reporter names on the dashboard.
create policy "users_select_supervisor_site"
  on public.users
  for select
  to authenticated
  using (
    public.is_supervisor()
    and site_id = public.user_site_id()
  );

-- Change status + log event in one transaction.
create or replace function public.supervisor_change_ticket_status(
  p_ticket_id uuid,
  p_new_status public.ticket_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_old_status public.ticket_status;
  v_site_id uuid;
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_supervisor() then
    raise exception 'Only supervisors can change ticket status';
  end if;

  select status, site_id
  into v_old_status, v_site_id
  from public.tickets
  where id = p_ticket_id
  for update;

  if v_site_id is null then
    raise exception 'Ticket not found';
  end if;

  if v_site_id <> public.user_site_id() then
    raise exception 'Ticket is not on your site';
  end if;

  if v_old_status = p_new_status then
    return;
  end if;

  update public.tickets
  set
    status = p_new_status,
    closed_at = case
      when p_new_status = 'Closed' then now()
      else closed_at
    end
  where id = p_ticket_id;

  insert into public.ticket_events (ticket_id, event_type, actor, payload)
  values (
    p_ticket_id,
    'status_changed',
    v_actor,
    jsonb_build_object(
      'from_status', v_old_status,
      'to_status', p_new_status
    )
  );
end;
$$;

-- Assign ticket to the acting supervisor (pilot: self-assignment only).
create or replace function public.supervisor_assign_ticket(p_ticket_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_site_id uuid;
  v_assignee_name text;
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_supervisor() then
    raise exception 'Only supervisors can assign tickets';
  end if;

  select t.site_id, coalesce(u.name, u.email)
  into v_site_id, v_assignee_name
  from public.tickets t
  join public.users u on u.id = v_actor
  where t.id = p_ticket_id
  for update of t;

  if v_site_id is null then
    raise exception 'Ticket not found';
  end if;

  if v_site_id <> public.user_site_id() then
    raise exception 'Ticket is not on your site';
  end if;

  insert into public.ticket_events (ticket_id, event_type, actor, payload)
  values (
    p_ticket_id,
    'assigned',
    v_actor,
    jsonb_build_object(
      'assignee_id', v_actor,
      'assignee_name', v_assignee_name
    )
  );
end;
$$;

-- Add a supervisor note to the audit trail.
create or replace function public.supervisor_add_ticket_note(
  p_ticket_id uuid,
  p_note text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_site_id uuid;
  v_trimmed text := trim(p_note);
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_supervisor() then
    raise exception 'Only supervisors can add notes';
  end if;

  if char_length(v_trimmed) < 1 then
    raise exception 'Note cannot be empty';
  end if;

  if char_length(v_trimmed) > 500 then
    raise exception 'Note is too long (max 500 characters)';
  end if;

  select site_id into v_site_id
  from public.tickets
  where id = p_ticket_id
  for update;

  if v_site_id is null then
    raise exception 'Ticket not found';
  end if;

  if v_site_id <> public.user_site_id() then
    raise exception 'Ticket is not on your site';
  end if;

  insert into public.ticket_events (ticket_id, event_type, actor, payload)
  values (
    p_ticket_id,
    'note_added',
    v_actor,
    jsonb_build_object('note', v_trimmed)
  );
end;
$$;

grant execute on function public.supervisor_change_ticket_status(uuid, public.ticket_status) to authenticated;
grant execute on function public.supervisor_assign_ticket(uuid) to authenticated;
grant execute on function public.supervisor_add_ticket_note(uuid, text) to authenticated;
