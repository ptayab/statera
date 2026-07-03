-- Statera ticket photo storage (stage 05)
-- Private bucket; workers upload, supervisors read site photos in stage 06.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ticket-photos',
  'ticket-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

-- Workers upload photos under {site_id}/{user_id}/...
create policy "ticket_photos_insert_worker"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'ticket-photos'
    and (storage.foldername(name))[1] = public.user_site_id()::text
    and (storage.foldername(name))[2] = auth.uid()::text
    and not public.is_supervisor()
  );

-- Workers can read their own uploaded photos.
create policy "ticket_photos_select_worker_own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'ticket-photos'
    and (storage.foldername(name))[2] = auth.uid()::text
    and not public.is_supervisor()
  );

-- Supervisors can read photos for tickets at their site.
create policy "ticket_photos_select_supervisor_site"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'ticket-photos'
    and (storage.foldername(name))[1] = public.user_site_id()::text
    and public.is_supervisor()
  );
