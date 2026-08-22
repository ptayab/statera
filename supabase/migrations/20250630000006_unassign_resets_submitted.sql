-- Assigned tickets cannot return to Submitted via status change.
-- Only unassigning clears the assignee and moves the ticket back to Submitted.

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
  v_assigned_to uuid;
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_supervisor() then
    raise exception 'Only supervisors can change ticket status';
  end if;

  select status, site_id, assigned_to
  into v_old_status, v_site_id, v_assigned_to
  from public.tickets
  where id = p_ticket_id
  for update;

  if v_site_id is null then
    raise exception 'Ticket not found';
  end if;

  if v_site_id <> public.user_site_id() then
    raise exception 'Ticket is not on your site';
  end if;

  if v_assigned_to is null then
    raise exception 'Assign the ticket to yourself before changing status';
  end if;

  if v_assigned_to <> v_actor then
    raise exception 'Only the assigned supervisor can change ticket status';
  end if;

  if p_new_status = 'Submitted' then
    raise exception 'Unassign the ticket to return it to Submitted';
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

-- Release a ticket back to the unassigned pool as Submitted.
create or replace function public.supervisor_unassign_ticket(p_ticket_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_site_id uuid;
  v_old_status public.ticket_status;
  v_assigned_to uuid;
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_supervisor() then
    raise exception 'Only supervisors can unassign tickets';
  end if;

  select site_id, status, assigned_to
  into v_site_id, v_old_status, v_assigned_to
  from public.tickets
  where id = p_ticket_id
  for update;

  if v_site_id is null then
    raise exception 'Ticket not found';
  end if;

  if v_site_id <> public.user_site_id() then
    raise exception 'Ticket is not on your site';
  end if;

  if v_assigned_to is null then
    raise exception 'Ticket is not assigned';
  end if;

  if v_assigned_to <> v_actor then
    raise exception 'Only the assigned supervisor can unassign this ticket';
  end if;

  update public.tickets
  set
    assigned_to = null,
    status = 'Submitted',
    closed_at = null
  where id = p_ticket_id;

  if v_old_status <> 'Submitted' then
    insert into public.ticket_events (ticket_id, event_type, actor, payload)
    values (
      p_ticket_id,
      'status_changed',
      v_actor,
      jsonb_build_object(
        'from_status', v_old_status,
        'to_status', 'Submitted'
      )
    );
  end if;

  insert into public.ticket_events (ticket_id, event_type, actor, payload)
  values (
    p_ticket_id,
    'unassigned',
    v_actor,
    jsonb_build_object()
  );
end;
$$;

grant execute on function public.supervisor_unassign_ticket(uuid) to authenticated;
