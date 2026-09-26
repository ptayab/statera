import { BrandLogo } from "@/components/BrandLogo";
import { DemoVideo } from "@/components/DemoVideo";
import { LevelSection } from "@/components/LevelSection";
import { NotifyForm } from "@/components/NotifyForm";
import { BriefingMock } from "@/components/BriefingMock";
import { ReportsMock } from "@/components/ReportsMock";
import { StatusTrailMock } from "@/components/StatusTrailMock";
import { SupervisorQueueMock } from "@/components/SupervisorQueueMock";
import { UnreportedGrid } from "@/components/UnreportedGrid";
import { WindowChrome } from "@/components/WindowChrome";
import { WorkerReportMock } from "@/components/WorkerReportMock";

const TRACTION = [
  "AI4SafeMines finalist",
  "ISSA Mining Safety Conference 2026",
  "Built in Saskatchewan",
];

const STEPS = [
  {
    number: "01",
    title: "Capture",
    body: "Workers log a hazard, near miss, or incident with a photo, a category, and a brief description. Reports save offline and send automatically once a connection is available.",
  },
  {
    number: "02",
    title: "Prioritize",
    body: "AI ranks incoming reports by urgency so critical issues surface first. Supervisors retain full authority over every decision.",
  },
  {
    number: "03",
    title: "Resolve",
    body: "Every report is assigned an owner and tracked to completion, and the worker who filed it is kept informed at each stage. No report is left sitting in a binder.",
  },
  {
    number: "04",
    title: "Analyze",
    body: "Recurring risks and year-end summaries are generated directly from the reports your crews submit.",
  },
];

const SILENCE = [
  "Workers find reporting slow and cumbersome.",
  "Workers rely on paper, email, and verbal communication.",
  "Workers fear retaliation.",
];

const HAZARD_RETURNS = [
  {
    number: "01",
    title: "No early warning",
    body: "Near misses go unrecorded, so mines can only be reactive instead of proactive.",
  },
  {
    number: "02",
    title: "Trust erodes",
    body: "Information is easily lost in paper, email, and verbal reports. When concerns go unaddressed, workers lose confidence that speaking up makes a difference and stop reporting once they see no action taken.",
  },
  {
    number: "03",
    title: "No time to report",
    body: "Short-staffed crews skip the paperwork and cite time and staffing pressures as the reason they do not report.",
  },
];

const COMPARE = [
  {
    today: "Issues logged but not resolved",
    statera: "Actions driven to completion",
    impact: "More hazards addressed",
  },
  {
    today: "No clear ownership",
    statera: "Assigned, tracked ownership",
    impact: "Accountability for every issue",
  },
  {
    today: "90% of issues go unreported",
    statera: "2–3× more reports captured",
    impact: "Full visibility into site risk",
  },
  {
    today: "Patterns go unnoticed",
    statera: "AI identifies recurring patterns",
    impact: "Insights in minutes, not weeks",
  },
  {
    today: "Late, reactive response",
    statera: "Early, proactive action",
    impact: "Fewer accidents",
  },
];

const WORKING_TODAY = [
  "One-minute field reporting with photos",
  "AI priority ranking with transparent reasoning",
  "Related reports grouped into a single issue",
  "Two-way messaging with a complete audit history",
];

const UNDER_DEVELOPMENT = [
  "Mobile app with occurrence and voice capture",
  "Advanced analytics, including predictive insights",
  "Ticket assignment to the best-suited supervisor",
  "Site-ready accounts, roles, and security controls",
];

const DEPLOY = [
  {
    title: "Straightforward to implement",
    body: "Fits the workflows your site already runs and complements official reporting procedures rather than replacing them.",
  },
  {
    title: "Works across devices",
    body: "Runs in the web browser and mobile apps on phones, tablets, and computers, with nothing to integrate or maintain.",
  },
  {
    title: "Scales with your operation",
    body: "Start with a single crew, expand to a full site, and grow to multiple sites on one platform.",
  },
];

const PILOT = [
  {
    title: "One site, three months",
    body: "Full platform access, unlimited field reporters, and onboarding included.",
  },
  {
    title: "Clear success criteria",
    body: "We agree on metrics up front, such as reports filed, time to action, and crew adoption.",
  },
  {
    title: "Canadian data residency",
    body: "Hosted in a Canadian region. You own your data, and all access is role-based and logged.",
  },
];

const QUICK_FACTS = [
  "Easily integrable",
  "Works offline, including underground",
  "Unlimited reporters per site",
  "Data hosted in Canada",
];

const CONTACTS = [
  {
    email: "njoson@student.ubc.ca",
    phone: "306-229-0735",
    tel: "+13062290735",
  },
  {
    email: "tim.li@usask.ca",
    phone: "639-480-7619",
    tel: "+16394807619",
  },
];

const NAV = [
  { href: "#level-01", label: "The gap" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#compare", label: "Compare" },
  { href: "#pilot", label: "Pilot" },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold tracking-[0.12em] text-statera-orange uppercase">
      {children}
    </p>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-full bg-[#f6f4f0] text-statera-ink">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f6f4f0]/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" aria-label="Statera home">
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-8 text-sm text-statera-slate lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                className="transition hover:text-statera-ink"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <a
              href="#pilot"
              className="cursor-pointer rounded-md bg-statera-ink px-3.5 py-2 text-sm font-medium text-white transition hover:bg-black"
            >
              Request a call
            </a>
          </div>
        </div>
        <nav className="flex gap-5 overflow-x-auto border-t border-black/8 px-5 py-2.5 text-sm text-statera-slate [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {NAV.map((item) => (
            <a key={item.href} className="shrink-0" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <LevelSection id="top" tone="paper">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <Eyebrow>Safety reporting for mine sites</Eyebrow>
            <h1 className="mt-3 font-display text-[2.6rem] leading-[1.05] font-medium tracking-[-0.03em] sm:text-5xl">
              Bring every hazard to the surface.
            </h1>
            <p className="mt-4 text-lg leading-7 text-statera-slate">
              Workers report a hazard, near miss, or incident in about a
              minute, even without a signal. Supervisors see the most urgent
              issues first, track every ticket through to resolution, and
              identify emerging patterns before they escalate.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {QUICK_FACTS.map((fact) => (
                <li key={fact} className="text-sm leading-6 text-statera-slate">
                  {fact}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs tracking-wide text-statera-slate/80">
              {TRACTION.join("  ·  ")}
            </p>
          </div>
          <WindowChrome title="Supervisor queue">
            <SupervisorQueueMock />
          </WindowChrome>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <WindowChrome title="Field report">
            <WorkerReportMock />
          </WindowChrome>
          <WindowChrome title="Report status">
            <StatusTrailMock />
          </WindowChrome>
        </div>
      </LevelSection>

      <main>
        <LevelSection id="level-01" tone="white">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] font-medium tracking-[-0.03em] sm:text-5xl">
            Leaders lack visibility into site risk.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-statera-slate">
            What is not recorded cannot be addressed, and the vast majority of
            hazards are never recorded. As a result, safety decisions rest on a
            small fraction of what actually happens on site.
          </p>

          <div className="relative mt-8 overflow-hidden rounded-lg bg-[#141311] text-white">
            <div className="grid gap-10 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:p-12">
              <p>
                <span className="flex items-start font-display leading-none font-medium tracking-[-0.04em] text-statera-orange">
                  <span className="text-[6.5rem] tabular-nums sm:text-[9rem]">90</span>
                  <span className="mt-2 text-5xl sm:text-7xl">%</span>
                </span>
                <span className="mt-6 block max-w-md text-xl leading-8 text-white/70">
                  of workplace incidents, hazards, and near misses{" "}
                  <span className="text-white">go unreported.</span>
                </span>
              </p>
              <UnreportedGrid />
            </div>
          </div>

          <h3 className="mt-10 font-display text-2xl font-medium tracking-[-0.02em]">
            Major causes of the reporting gap
          </h3>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-3">
            {SILENCE.map((item) => (
              <li key={item} className="bg-[#f6f4f0] px-5 py-4 text-sm leading-6">
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-display text-3xl font-medium tracking-[-0.02em]">
            Consequences of the reporting gap
          </h3>
          <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-3">
            {HAZARD_RETURNS.map((item) => (
              <article key={item.number} className="bg-white p-6">
                <span className="text-xs font-semibold tracking-[0.12em] text-statera-orange">
                  {item.number}
                </span>
                <h4 className="mt-3 font-display text-xl font-medium">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-statera-slate">{item.body}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-6 text-statera-slate">
            Organizations that do not respond adequately to reported issues face
            53–75% higher odds of a subsequent serious accident. That means the
            issues being missed can directly predict future serious accidents.
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-5 text-statera-slate/80">
            Sources: Benchmark Gensuite, 2026 EHS Benchmarking Report (260+ EHS
            professionals); Journal of Occupational Health, 2024.
          </p>
        </LevelSection>

        <LevelSection id="how-it-works" tone="paper">
          <Eyebrow>The solution</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] font-medium tracking-[-0.03em] sm:text-5xl">
            From the first report to the pattern behind it.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-statera-slate">
            Statera turns a one-minute field report into a tracked ticket with a
            clear owner, status, and history. Urgent issues rise to the top,
            related reports are grouped together, and workers receive updates at
            every stage.
          </p>

          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.number} className="border-t border-black/15 pt-5">
                <span className="text-xs font-semibold tracking-[0.12em] text-statera-orange">
                  {step.number}
                </span>
                <h3 className="mt-3 font-display text-2xl font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-statera-slate">{step.body}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-12 font-display text-3xl font-medium tracking-[-0.02em]">
            Watch how a report moves through Statera.
          </h3>
          <div className="mt-6">
            <DemoVideo />
          </div>

          <h3 className="mt-12 font-display text-3xl font-medium tracking-[-0.02em]">
            Live reporting and exportable AI briefings.
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-statera-slate">
            Supervisors get a real-time view of open work: what remains
            unresolved, what has been idle too long, and where risk is
            concentrated. The AI briefing is generated from these live counts
            and past tickets.
          </p>
          <div className="mt-8 grid gap-4">
            <WindowChrome title="Reports">
              <ReportsMock />
            </WindowChrome>
            <WindowChrome title="Exportable briefing">
              <BriefingMock />
            </WindowChrome>
          </div>
        </LevelSection>

        <LevelSection id="compare" tone="white">
          <Eyebrow>Before and after</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] font-medium tracking-[-0.03em] sm:text-5xl">
            From disconnected tools to a closed loop.
          </h2>

          <div className="mt-10 overflow-hidden rounded-lg border border-black/10">
            <div className="hidden grid-cols-[1.1fr_1.1fr_0.9fr] border-b border-black/10 bg-[#f6f4f0] px-6 py-3 text-xs font-semibold tracking-wide text-statera-slate uppercase sm:grid">
              <p>Today</p>
              <p>With Statera</p>
              <p>Impact</p>
            </div>
            {COMPARE.map((row) => (
              <div
                key={row.today}
                className="grid gap-2 border-b border-black/10 px-5 py-4 last:border-0 sm:grid-cols-[1.1fr_1.1fr_0.9fr] sm:items-center sm:gap-6 sm:px-6"
              >
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-statera-slate uppercase sm:hidden">
                    Today
                  </p>
                  <p className="text-sm leading-6">{row.today}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-statera-slate uppercase sm:hidden">
                    With Statera
                  </p>
                  <p className="text-sm leading-6">{row.statera}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-statera-slate uppercase sm:hidden">
                    Impact
                  </p>
                  <p className="text-sm leading-6 font-medium">{row.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </LevelSection>

        <LevelSection id="roadmap" tone="paper">
          <Eyebrow>Development status</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] font-medium tracking-[-0.03em] sm:text-5xl">
            What is available today, and what comes next.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-statera-slate">
            The core workflow is live: capture, prioritization, grouping,
            messaging, and resolution. The next phase adds a mobile app, smarter
            ticket assignment, and site-ready account management.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 lg:grid-cols-2">
            <article className="bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.12em] text-statera-slate uppercase">
                Available now
              </p>
              <ul className="mt-5 space-y-3">
                {WORKING_TODAY.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-statera-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.12em] text-statera-orange uppercase">
                In development
              </p>
              <ul className="mt-5 space-y-3">
                {UNDER_DEVELOPMENT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-statera-slate">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/20" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </LevelSection>

        <LevelSection id="deploy" tone="white">
          <Eyebrow>Simple deployment</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] font-medium tracking-[-0.03em] sm:text-5xl">
            Runs on the devices your site already uses.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-statera-slate">
            There is no new hardware to purchase and no IT project to manage.
            Crews can access Statera through a web link or mobile app.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {DEPLOY.map((item) => (
              <article key={item.title} className="border-t border-black/15 pt-5">
                <h3 className="font-display text-2xl font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-statera-slate">{item.body}</p>
              </article>
            ))}
          </div>
        </LevelSection>

        <LevelSection id="pilot" tone="ink">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <Eyebrow>Pilot program</Eyebrow>
              <h2 className="mt-3 font-display text-4xl leading-[1.1] font-medium tracking-[-0.03em] sm:text-5xl">
                One prevented injury can pay for years of Statera.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
                We are seeking one mine to become our founding pilot partner: a
                90-day trial at a single site, with success metrics agreed in
                advance and no long-term commitment.
              </p>

              <div className="mt-8 grid gap-px overflow-hidden rounded-lg bg-white/15 sm:grid-cols-2">
                <article className="bg-white/5 p-5">
                  <p className="text-xs font-semibold tracking-[0.12em] text-white/50 uppercase">
                    Cost of a single injury
                  </p>
                  <p className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] text-red-400">
                    ~$48,000
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Average cost of a medically consulted injury, including
                    medical care, lost wages, and administrative expenses.
                  </p>
                </article>
                <article className="bg-white/5 p-5">
                  <p className="text-xs font-semibold tracking-[0.12em] text-white/50 uppercase">
                    Cost of a Statera pilot
                  </p>
                  <p className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] text-[#e7c27a]">
                    ~$1,000
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    90-day pilot, priced according to the size of the operation.
                  </p>
                </article>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/80">
                If Statera helps prevent a single incident, the pilot returns
                roughly 48 times its cost.
              </p>
              <p className="mt-3 text-xs leading-5 text-white/45">
                Indirect costs add roughly 1.3 times the direct cost. A mid-sized
                site absorbs approximately $290,000 in injury costs each year.
                Sources: National Safety Council, Injury Facts 2024; OSHA
                indirect-cost guidance.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {PILOT.map((item) => (
                  <article key={item.title}>
                    <h3 className="font-display text-lg font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 text-statera-ink sm:p-8">
              <p className="text-xs font-semibold tracking-[0.12em] text-statera-orange uppercase">
                Next step
              </p>
              <p className="mt-3 font-display text-3xl font-medium tracking-[-0.02em]">
                A 30-minute call to assess whether Statera fits your site.
              </p>
              <p className="mt-3 text-sm leading-6 text-statera-slate">
                Share your details, and our team will follow up with you.
                If you would like a business plan, we will send one.
              </p>
              <div className="mt-6">
                <NotifyForm submitLabel="Request a call" />
              </div>
              <ul className="mt-6 space-y-3 border-t border-black/10 pt-5 text-sm leading-6">
                {CONTACTS.map((person) => (
                  <li key={person.email}>
                    <a
                      href={`mailto:${person.email}`}
                      className="font-medium text-statera-ink underline decoration-black/20 underline-offset-4 hover:decoration-black"
                    >
                      {person.email}
                    </a>
                    <a
                      href={`tel:${person.tel}`}
                      className="mt-0.5 block text-statera-slate hover:text-statera-ink"
                    >
                      {person.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </LevelSection>
      </main>

      <footer className="bg-[#141311] px-5 py-8 text-white/55 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <BrandLogo light />
            <p className="mt-4 text-xs leading-5">
              © 2026 Statera Mine Systems, Saskatchewan, Canada. All rights
              reserved.
            </p>
            <p className="mt-2 text-xs leading-5 text-white/40">
              Statera supports safety reporting and communication. It does not
              replace a site’s own procedures, supervisory judgment, or
              regulatory obligations.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-3">
              <p className="text-white/80">Contact us</p>
              {CONTACTS.map((person) => (
                <p key={person.email}>
                  <a
                    href={`mailto:${person.email}`}
                    className="text-white/80 hover:text-white"
                  >
                    {person.email}
                  </a>
                  <a
                    href={`tel:${person.tel}`}
                    className="mt-0.5 block text-white/55 hover:text-white"
                  >
                    {person.phone}
                  </a>
                </p>
              ))}
            </div>
            <a href="#top" className="text-white/80 hover:text-white">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
