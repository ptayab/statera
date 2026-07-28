# Statera

Read `statera/docs/02_product_spec.md` before generating any feature code. This file is the day-to-day ruleset; the spec is the source of truth if they ever conflict.

**Build order:** this project is built in the staged sequence defined in `statera/docs/dev_guide/00_START_HERE.md` through `statera/docs/dev_guide/11_deployment_and_launch_checklist.md`. Before generating code for any feature, check which stage it belongs to and read that stage file — each one explains the concept, the exact step-by-step build instructions, and the verification checklist for that piece. Don't build a later stage's feature before its prerequisites (listed at the top of each stage file) are done and verified.

## Stack — don't deviate without a deliberate team decision

Next.js (App Router) for the frontend, Supabase for Postgres + auth + storage + row-level security, deployed on Vercel. Resend for transactional email. No other backend framework, no custom auth, no separate database. If a task seems to need something outside this stack, stop and flag it rather than introducing a new dependency.

## Non-negotiable product guardrails — enforce these in code, not just in the UI copy

No AI-generated output may change a ticket's status, close a ticket, dismiss a concern, or take any action that alters ticket state. AI functions only ever write to `ai_suggested_*` / `ai_explanation` on `tickets` or append rows to `ai_interactions` — a human action is always what changes `tickets.status`. Every AI response (worker coach and pattern-check) must include a plain-language explanation string; never ship an AI output with a bare label and no reasoning. Every ticket-state-changing action must log the acting user's id in `ticket_events` — never log an action as performed by "system" or "AI" alone.

## How to work with the team's skill levels

When asked to build a UI component or form, generate complete, working code with brief inline comments explaining non-obvious choices — the person reviewing it may not have the background to infer intent from a diff alone. When asked to touch the database schema, auth rules, or anything in the AI pipeline, explain the change in plain language before writing it, since this is where mistakes are expensive to unwind. Default to the simplest implementation that satisfies the spec — this team does not have the bandwidth to maintain anything clever. If a request would add a feature explicitly listed as "cut for v1" in the product spec, say so and ask for confirmation before building it.

## Keep documentation in sync

Any suggestion, change, or new behavior prompted by the user should update its corresponding documentation in the same task — do not ship code-only changes and leave docs stale.

- **Product behavior or scope** → `docs/02_product_spec.md`
- **Roadmap / phase timing** → `docs/01_roadmap.md`
- **Implementation for a build stage** → the matching file in `docs/dev_guide/` (e.g. login/auth changes → `04_authentication_and_roles.md`, ticket submission → `05_ticket_submission.md`)
- **Pilot / rollout process** → `docs/03_pilot_playbook.md`

If a change touches more than one area, update each affected doc. Keep edits focused on what changed; don't rewrite unrelated sections. If it's unclear which doc applies, ask briefly rather than skipping the update.

## Folder conventions

`/app` — routes and pages. `/components` — shared UI. `/lib/supabase` — client setup and queries. `/lib/ai` — the two AI touchpoints (worker coach, pattern-check), each as its own isolated function with a single clear input/output contract, so they're easy to test and easy to swap models on later. `/supabase/migrations` — all schema changes as migration files, never hand-edited directly in the dashboard, so the schema stays reproducible.

## Testing expectations for a team this size

Don't aim for comprehensive automated test coverage — there isn't time. Do write a handful of tests for the ticket-state-change logic and the AI guardrail (confirming an AI call can never directly set `tickets.status`), since that's the part where a silent bug would be hardest to catch by eye and most damaging to the pitch story if it broke during a live demo.

## When in doubt

Ask which phase of `statera/docs/01_roadmap.md` the team is currently in, and build only what that phase calls for. Building ahead of the roadmap is the most common way a small team loses a week it didn't have.
