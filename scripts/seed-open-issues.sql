-- One-shot demo seed: six open tickets from workers who are not Test Worker.
-- Complements the three Test Worker tickets already open.
-- Run once in the Supabase SQL editor.

do $$
declare
  v_site uuid;
  v_source text := 'demo-open-20260906';
  v_nancy uuid;
  v_barry uuid;
  v_larry uuid;
  v_mark uuid;
  v_ticket uuid;
  r record;
begin
  if exists (
    select 1
    from public.ticket_events
    where event_type = 'created'
      and payload->>'source' = v_source
  ) then
    raise notice 'Seed % already applied', v_source;
    return;
  end if;

  select site_id into v_site
  from public.users
  where role = 'supervisor'
  order by created_at
  limit 1;

  if v_site is null then
    raise exception 'No supervisor site found';
  end if;

  select id into v_nancy from public.users
    where site_id = v_site and role = 'worker' and name = 'Nancy Polish';
  select id into v_barry from public.users
    where site_id = v_site and role = 'worker' and name = 'Barry Thomas';
  select id into v_larry from public.users
    where site_id = v_site and role = 'worker' and name = 'Larry Mathews';
  select id into v_mark from public.users
    where site_id = v_site and role = 'worker' and name = 'Mark Mckay';

  if v_nancy is null or v_barry is null or v_larry is null or v_mark is null then
    raise exception 'Expected Nancy Polish, Barry Thomas, Larry Mathews, and Mark Mckay on this site';
  end if;

  for r in
    select *
    from (
      values
        (v_nancy, 'Dangerous Occurrence'::text, 'High'::text, 3::numeric, 20, 'Critical'::text,
         $d$Fire at the underground charger bay on 4-level. An electrical cable tray ignited; the crew knocked it down with an extinguisher. Nobody was injured, but the bay still smells of ozone and we have stopped work there.$d$,
         'Active fire/electrical event at the charger bay. Work is stopped; needs immediate follow-up even though no one was hurt.'),
        (v_barry, 'Near-Miss Report', 'High', 10, 10, 'High',
         $d$Haul truck T-14 had to dump the brakes on the decline when a light vehicle came the other way around the blind corner on R2AS. Missed us by a couple of metres. Spotters were not in place — that corner is a real risk until the berm and radio protocol are fixed.$d$,
         'Serious haul-truck near-miss on a blind corner. High chance of a collision if the control is not fixed.'),
        (v_larry, 'Fatigue / Wellness Concern', 'High', 26, 5, 'High',
         $d$Night mill crew is into a sixth straight 12-hour. People are nodding off on the control-room chairs. This is a fitness-for-duty concern before someone walks into a live isolation.$d$,
         'Extended overtime is showing up as fatigue on the mill night shift. Fitness for duty should be checked before the next crew starts.'),
        (v_mark, 'HR / Supervisor Escalation', 'Medium', 48, 5, 'Medium',
         $d$Roster keeps flipping people between night and day with only eight hours off. Crew is asking a supervisor to look at the swing-shift policy. Not an emergency — it is a scheduling concern that is wearing people down.$d$,
         'Roster swing between night and day with short turnaround. Needs a supervisor look, not an emergency response.'),
        (v_nancy, 'Training Request', 'Medium', 96, 0, 'Medium',
         $d$Two new contractors on the ROM pad have not sat the isolation refresher. They have been shadowing, but they should not sign onto a permit until they complete the course.$d$,
         'New contractors still need isolation training before they can sign permits. Straightforward training request.'),
        (v_barry, 'Procedure Clarification', 'Low', 6, 0, 'Low',
         $d$The new lockout steps for the conveyor take-up look different from the laminated sheet at the isolator. Can someone confirm which revision we should follow before tomorrow's shutdown?$d$,
         'Two versions of the conveyor lockout steps are in circulation. Needs a documented answer before the shutdown.')
    ) as issues(worker_id, category, urgency, age_hours, description_pts, expected_ai, description, language_summary)
  loop
    insert into public.tickets (
      created_by,
      site_id,
      category,
      description,
      urgency,
      status,
      created_at,
      ai_suggested_priority,
      ai_explanation,
      ai_analysis
    )
    values (
      r.worker_id,
      v_site,
      r.category,
      r.description,
      r.urgency,
      'Submitted',
      now() - (r.age_hours || ' hours')::interval,
      r.expected_ai,
      r.language_summary,
      jsonb_build_object(
        'descriptionPts', r.description_pts,
        'feedbackAdjustment', 0,
        'feedbackSummary', null,
        'languageSummary', r.language_summary,
        'suggestedPriority', r.expected_ai,
        'duplicateIds', '[]'::jsonb,
        'duplicateReason', null,
        'model', 'seeded-dispersion',
        'analyzedAt', now() - (r.age_hours || ' hours')::interval
      )
    )
    returning id into v_ticket;

    insert into public.ticket_events (
      ticket_id,
      event_type,
      actor,
      created_at,
      payload
    )
    values (
      v_ticket,
      'created',
      r.worker_id,
      now() - (r.age_hours || ' hours')::interval,
      jsonb_build_object(
        'category', r.category,
        'description', r.description,
        'urgency', r.urgency,
        'has_photo', false,
        'source', v_source
      )
    );
  end loop;
end;
$$;
