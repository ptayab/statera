-- AI ranking: worker-rated urgency used as a score multiplier.
-- Existing tickets default to 'Medium' so they are neither penalised nor boosted.

alter table public.tickets
  add column if not exists urgency text not null default 'Medium';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tickets_urgency_check'
      and conrelid = 'public.tickets'::regclass
  ) then
    alter table public.tickets
      add constraint tickets_urgency_check
      check (urgency in ('Low', 'Medium', 'High'));
  end if;
end;
$$;
