-- Site bulletin board: supervisors broadcast updates to workers at their site.

create table public.site_broadcasts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  created_by uuid not null references public.users (id) on delete restrict,
  author_name text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  constraint site_broadcasts_title_length check (char_length(title) between 1 and 120),
  constraint site_broadcasts_body_length check (char_length(body) between 1 and 2000)
);

create index site_broadcasts_site_created_at_idx
  on public.site_broadcasts (site_id, created_at desc);

alter table public.site_broadcasts enable row level security;

-- Anyone at the site can read broadcasts (workers + supervisors).
create policy "site_broadcasts_select_same_site"
  on public.site_broadcasts
  for select
  to authenticated
  using (site_id = public.user_site_id());

-- Publish a broadcast for the supervisor's site.
create or replace function public.supervisor_publish_broadcast(
  p_title text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_site_id uuid;
  v_author_name text;
  v_title text := nullif(trim(p_title), '');
  v_body text := nullif(trim(p_body), '');
  v_id uuid;
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_supervisor() then
    raise exception 'Only supervisors can publish broadcasts';
  end if;

  if v_title is null then
    raise exception 'Title cannot be empty';
  end if;

  if char_length(v_title) > 120 then
    raise exception 'Title is too long (max 120 characters)';
  end if;

  if v_body is null then
    raise exception 'Message cannot be empty';
  end if;

  if char_length(v_body) > 2000 then
    raise exception 'Message is too long (max 2000 characters)';
  end if;

  select site_id, coalesce(name, email)
  into v_site_id, v_author_name
  from public.users
  where id = v_actor;

  if v_site_id is null then
    raise exception 'User profile not found';
  end if;

  insert into public.site_broadcasts (
    site_id,
    created_by,
    author_name,
    title,
    body
  )
  values (
    v_site_id,
    v_actor,
    v_author_name,
    v_title,
    v_body
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Soft cleanup: supervisors can remove a broadcast from their site.
create or replace function public.supervisor_delete_broadcast(
  p_broadcast_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_site_id uuid;
begin
  if v_actor is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_supervisor() then
    raise exception 'Only supervisors can delete broadcasts';
  end if;

  select site_id
  into v_site_id
  from public.site_broadcasts
  where id = p_broadcast_id
  for update;

  if v_site_id is null then
    raise exception 'Broadcast not found';
  end if;

  if v_site_id <> public.user_site_id() then
    raise exception 'Broadcast is not on your site';
  end if;

  delete from public.site_broadcasts
  where id = p_broadcast_id;
end;
$$;

grant execute on function public.supervisor_publish_broadcast(text, text) to authenticated;
grant execute on function public.supervisor_delete_broadcast(uuid) to authenticated;
