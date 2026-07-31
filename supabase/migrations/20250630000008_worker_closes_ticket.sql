-- Supervisors may resolve tickets but cannot close them.
-- Only the reporting worker can close a Resolved ticket.

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

  if p_new_status = 'Closed' then
    raise exception 'Only the worker who reported this ticket can close it';
  end if;

  if v_old_status = p_new_status then
    return;
  end if;

  update public.tickets
  set
    status = p_new_status,
    closed_at = null
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

-- Worker confirms resolution by closing their own Resolved ticket.
create or replace function public.worker_close_ticket(p_ticket_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_created_by uuid;
  v_old_status public.ticket_status;
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if public.is_supervisor() then
    raise exception 'Supervisors cannot close tickets; wait for the worker';
  end if;

  select created_by, status
  into v_created_by, v_old_status
  from public.tickets
  where id = p_ticket_id
  for update;

  if v_created_by is null then
    raise exception 'Ticket not found';
  end if;

  if v_created_by <> v_actor then
    raise exception 'You can only close your own tickets';
  end if;

  if v_old_status <> 'Resolved' then
    raise exception 'Ticket must be Resolved before you can close it';
  end if;

  update public.tickets
  set
    status = 'Closed',
    closed_at = now()
  where id = p_ticket_id;

  insert into public.ticket_events (ticket_id, event_type, actor, payload)
  values (
    p_ticket_id,
    'status_changed',
    v_actor,
    jsonb_build_object(
      'from_status', v_old_status,
      'to_status', 'Closed'
    )
  );
end;
$$;

grant execute on function public.worker_close_ticket(uuid) to authenticated;
