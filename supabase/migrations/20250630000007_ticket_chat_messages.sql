-- Two-way ticket chat: workers and assigned supervisors can post messages.
-- Lifecycle events (status/assign/etc.) remain system broadcasts in the same stream.

-- Supervisor notes become chat messages (same payload shape as worker messages).
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
  v_assigned_to uuid;
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

  select site_id, assigned_to
  into v_site_id, v_assigned_to
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
    raise exception 'Assign the ticket to yourself before messaging';
  end if;

  if v_assigned_to <> v_actor then
    raise exception 'Only the assigned supervisor can message on this ticket';
  end if;

  insert into public.ticket_events (ticket_id, event_type, actor, payload)
  values (
    p_ticket_id,
    'message',
    v_actor,
    jsonb_build_object('text', v_trimmed)
  );
end;
$$;

-- Worker can message on tickets they created.
create or replace function public.worker_add_ticket_message(
  p_ticket_id uuid,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_created_by uuid;
  v_trimmed text := trim(p_message);
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if public.is_supervisor() then
    raise exception 'Supervisors must use the supervisor messaging action';
  end if;

  if char_length(v_trimmed) < 1 then
    raise exception 'Message cannot be empty';
  end if;

  if char_length(v_trimmed) > 500 then
    raise exception 'Message is too long (max 500 characters)';
  end if;

  select created_by
  into v_created_by
  from public.tickets
  where id = p_ticket_id
  for update;

  if v_created_by is null then
    raise exception 'Ticket not found';
  end if;

  if v_created_by <> v_actor then
    raise exception 'You can only message on your own tickets';
  end if;

  insert into public.ticket_events (ticket_id, event_type, actor, payload)
  values (
    p_ticket_id,
    'message',
    v_actor,
    jsonb_build_object('text', v_trimmed)
  );
end;
$$;

grant execute on function public.worker_add_ticket_message(uuid, text) to authenticated;
