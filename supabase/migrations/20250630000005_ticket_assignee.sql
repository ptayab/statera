-- Persist ticket assignee and auto-move Submitted → In Review on self-assign.
-- Only the assigned supervisor may change status, add notes, or act on the ticket.
-- Other site supervisors may view only. Unassigned tickets can still be claimed.

alter table public.tickets
  add column if not exists assigned_to uuid references public.users (id) on delete set null;

create index if not exists tickets_assigned_to_idx on public.tickets (assigned_to);

-- Only the assigned supervisor may change status.
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

-- Claim an unassigned ticket. Already-assigned tickets cannot be taken over.
create or replace function public.supervisor_assign_ticket(p_ticket_id uuid)
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
  v_assignee_name text;
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_supervisor() then
    raise exception 'Only supervisors can assign tickets';
  end if;

  select t.site_id, t.status, t.assigned_to, coalesce(u.name, u.email)
  into v_site_id, v_old_status, v_assigned_to, v_assignee_name
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

  if v_assigned_to = v_actor then
    return;
  end if;

  if v_assigned_to is not null then
    raise exception 'Ticket is already assigned to another supervisor';
  end if;

  update public.tickets
  set
    assigned_to = v_actor,
    status = case
      when status = 'Submitted' then 'In Review'::public.ticket_status
      else status
    end
  where id = p_ticket_id;

  if v_old_status = 'Submitted' then
    insert into public.ticket_events (ticket_id, event_type, actor, payload)
    values (
      p_ticket_id,
      'status_changed',
      v_actor,
      jsonb_build_object(
        'from_status', v_old_status,
        'to_status', 'In Review'
      )
    );
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

-- Only the assigned supervisor may add notes.
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
    raise exception 'Assign the ticket to yourself before adding notes';
  end if;

  if v_assigned_to <> v_actor then
    raise exception 'Only the assigned supervisor can add notes';
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
