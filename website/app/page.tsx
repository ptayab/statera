import { BrandLogo } from "@/components/BrandLogo";
import { DemoVideo } from "@/components/DemoVideo";
import { Headframe } from "@/components/Headframe";
import { LevelSection } from "@/components/LevelSection";
import { NotifyForm } from "@/components/NotifyForm";
import { PlayWhenVisible } from "@/components/PlayWhenVisible";
import { ProductShot } from "@/components/ProductShot";
import { StatusTrailMock } from "@/components/StatusTrailMock";
import { StrataDivider } from "@/components/StrataDivider";
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
  "49% find reporting too slow or cumbersome",
  "44% still rely on paper, email, or verbal reports",
  "38% fear retaliation",
];

const HAZARD_RETURNS = [
  {
    number: "01",
    title: "No early warning",
    body: "Near misses go unrecorded, and 39% of sites miss the early warning signs.",
  },
  {
    number: "02",
    title: "Trust erodes",
    body: "Information is easily lost in paper, email, and verbal reports. When concerns go unaddressed, workers lose confidence that speaking up makes a difference. 54% stop reporting once they see no action taken.",
  },
  {
    number: "03",
    title: "No time to report",
    body: "Short-staffed crews skip the paperwork, and 45% cite time and staffing pressures as the reason they do not report. This is especially true amid the industry’s global workforce shortage.",
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
    body: "Runs in the web browser on phones, tablets, and computers, with nothing to install or maintain.",
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

const TRUST = [
  "Encrypted in transit and at rest",
  "Role-based access with a full audit trail",
  "AI ranks reports, but every action is taken by a named person",
  "Supports your procedures rather than replacing them",
];

const QUICK_FACTS = [
  "Browser-based, nothing to install",
  "Works offline, including underground",
  "Unlimited reporters per site",
  "Data hosted in Canada",
];

const BUSINESS_PLAN = {
  href: "/Statera_Business_Plan.docx",
  filename: "Statera_Business_Plan.docx",
};

export default function HomePage() {
  return (
    <div className="min-h-full bg-level-0 text-statera-ink">
      <header className="sticky top-0 z-40 border-b border-statera-ink/10 bg-level-0/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-10">
          <a href="#top" aria-label="Statera home">
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-statera-slate lg:flex">
            <a className="transition hover:text-statera-ink" href="#level-01">
              The gap
            </a>
            <a className="transition hover:text-statera-ink" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-statera-ink" href="#compare">
              Compare
            </a>
            <a className="transition hover:text-statera-ink" href="#pilot">
              Pilot
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={BUSINESS_PLAN.href}
              download={BUSINESS_PLAN.filename}
              className="hidden rounded-lg px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-statera-slate transition hover:text-statera-ink sm:inline sm:px-3 sm:text-[12px]"
            >
              Business plan
            </a>
            <a
              href="#pilot"
              className="rounded-lg bg-statera-orange px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#bd7509] sm:px-4 sm:py-2.5 sm:text-[12px]"
            >
              <span className="sm:hidden">Pilot</span>
              <span className="hidden sm:inline">Request a pilot</span>
            </a>
          </div>
        </div>
        <nav className="flex gap-5 overflow-x-auto border-t border-statera-ink/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-statera-slate [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:hidden">
          <a className="shrink-0 transition hover:text-statera-ink" href="#level-01">
            The gap
          </a>
          <a className="shrink-0 transition hover:text-statera-ink" href="#how-it-works">
            How it works
          </a>
          <a className="shrink-0 transition hover:text-statera-ink" href="#compare">
            Compare
          </a>
          <a className="shrink-0 transition hover:text-statera-ink max-[374px]:hidden" href="#pilot">
            Pilot
          </a>
        </nav>
      </header>

      <div id="top" className="wash relative">
        <LevelSection
          level="00"
          depth="0 m"
          label="Surface"
          tone=""
          texture=""
        >
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10">
            <div>
              <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-statera-orange sm:text-[13px] sm:tracking-[0.32em]">
                Safety reporting for mine sites
              </p>

              <h1 className="mt-5 font-display text-[length:clamp(30px,10vw_-_2px,40px)] font-extrabold leading-[1.08] tracking-[-0.03em] sm:mt-7 sm:text-5xl md:text-6xl lg:text-[length:clamp(40px,5.2vw_-_13px,54px)]">
                Bring every hazard
                <br />
                to the surface.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-statera-slate sm:mt-6 sm:text-lg sm:leading-8">
                Workers report a hazard, near miss, or incident in about a
                minute, even without a signal. Supervisors see the most urgent
                issues first, track every ticket through to resolution, and
                identify emerging patterns before they escalate.
              </p>
            </div>

            <div className="relative mx-auto flex w-full max-w-[280px] flex-col gap-5 sm:max-w-md lg:mx-0 lg:block lg:max-w-none lg:min-h-[560px]">
              <Headframe className="pointer-events-none absolute -left-10 bottom-0 hidden h-56 w-auto text-statera-ink/25 lg:block" />

              <div className="lg:absolute lg:left-16 lg:top-6 lg:z-20 lg:w-[46%] lg:max-w-[230px]">
                <WindowChrome title="statera · report">
                  <WorkerReportMock />
                </WindowChrome>
              </div>

              <div className="hidden md:block lg:absolute lg:right-0 lg:top-0 lg:z-10 lg:w-[64%] lg:max-w-[360px]">
                <WindowChrome title="statera · supervisor">
                  <SupervisorQueueMock />
                </WindowChrome>
              </div>

              <div className="hidden lg:absolute lg:bottom-0 lg:right-16 lg:z-30 lg:block lg:w-[56%] lg:max-w-[300px]">
                <WindowChrome title="statera · report status">
                  <StatusTrailMock />
                </WindowChrome>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-x-8 gap-y-3 border-t border-statera-ink/10 pt-6 sm:mt-16 sm:grid-cols-2 sm:gap-y-4 sm:pt-7 lg:grid-cols-4">
            {QUICK_FACTS.map((fact) => (
              <p className="text-sm text-statera-slate" key={fact}>
                {fact}
              </p>
            ))}
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase leading-5 tracking-[0.1em] text-statera-slate/70 sm:text-[11px] sm:tracking-[0.16em]">
            {TRACTION.join("  ·  ")}
          </p>
        </LevelSection>
      </div>

      <main>
        <StrataDivider tone="text-level-1" />
        <LevelSection
          id="level-01"
          level="01"
          depth="−40 m"
          label="The gap"
          tone="bg-level-1"
        >
          <p className="text-sm font-semibold text-statera-orange">The problem</p>
          <h2 className="mt-3 max-w-3xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            Leaders lack visibility into site risk.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-statera-slate sm:text-base">
            What is not recorded cannot be addressed, and the vast majority of
            hazards are never recorded. As a result, safety decisions rest on a
            small fraction of what actually happens on site.
          </p>

          <PlayWhenVisible className="relative mt-9 overflow-hidden rounded-3xl bg-statera-ink text-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] sm:mt-12">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_circle_at_12%_18%,rgba(212,132,10,0.16),transparent_70%)]"
              aria-hidden
            />
            <div className="dust-deep pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative grid gap-10 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12 lg:gap-16 lg:p-12">
              <p>
                <span className="sr-only">90% </span>
                <span
                  aria-hidden
                  className="flex items-start font-display font-extrabold leading-[0.8] tracking-[-0.05em] text-statera-orange"
                >
                  <span className="stat-count text-[112px] tabular-nums [--stat-count:90] sm:text-[168px] lg:text-[208px]" />
                  <span className="mt-[0.06em] text-[60px] sm:text-[88px] lg:text-[108px]">
                    %
                  </span>
                </span>
                <span className="mt-6 block max-w-md text-balance text-xl font-semibold leading-8 text-white/70 sm:mt-8 sm:text-2xl sm:leading-9">
                  of workplace incidents, hazards, and near&nbsp;misses{" "}
                  <span className="text-white">go unreported.</span>
                </span>
              </p>

              <UnreportedGrid />
            </div>
          </PlayWhenVisible>

          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-statera-slate sm:mt-12">
            Barriers to reporting
          </p>
          <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
            {SILENCE.map((item) => (
              <span
                key={item}
                className="rounded-xl bg-white px-3.5 py-2.5 text-sm text-statera-ink ring-1 ring-black/10 sm:rounded-full sm:py-1.5"
              >
                {item}
              </span>
            ))}
          </div>

          <h3 className="mt-12 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
            Unreported hazards keep returning.
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {HAZARD_RETURNS.map((item) => (
              <article
                key={item.number}
                className="rounded-2xl bg-white p-5 ring-1 ring-black/10 sm:p-7"
              >
                <span className="font-display text-2xl font-extrabold leading-none text-statera-orange">
                  {item.number}
                </span>
                <h4 className="mt-5 font-display text-lg font-bold tracking-[-0.01em]">
                  {item.title}
                </h4>
                <p className="mt-2.5 text-sm leading-6 text-statera-slate">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-6 text-statera-slate">
            Organizations that do not respond adequately to reported issues face
            53–75% higher odds of a subsequent serious accident.
          </p>
          <p className="mt-3 max-w-3xl text-[11px] leading-5 text-statera-slate/80">
            Sources: Benchmark Gensuite, 2026 EHS Benchmarking Report (260+ EHS
            professionals); Journal of Occupational Health, 2024.
          </p>
        </LevelSection>

        <StrataDivider tone="text-level-2" seam="stroke-white/20" />
        <LevelSection
          id="how-it-works"
          level="02"
          depth="−120 m"
          label="Report"
          tone="bg-level-2"
          texture="dust-deep"
          dark
        >
          <p className="text-sm font-semibold text-statera-orange">The solution</p>
          <h2 className="mt-3 max-w-2xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            From the first report to the pattern behind it.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">
            Statera turns a one-minute field report into a tracked ticket with a
            clear owner, status, and history. Urgent issues rise to the top,
            related reports are grouped together, and workers receive updates at
            every stage.
          </p>

          <div className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl bg-white p-5 text-statera-ink ring-1 ring-black/10 sm:p-7"
              >
                <span className="font-display text-2xl font-extrabold leading-none text-statera-orange">
                  {step.number}
                </span>
                <h3 className="mt-6 font-display text-lg font-bold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-statera-slate">
                  {step.body}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-12 text-sm font-semibold text-statera-orange">
            Product walkthrough
          </p>
          <h3 className="mt-3 max-w-2xl font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
            Watch how a report moves through Statera.
          </h3>
          <div className="mt-7">
            <DemoVideo />
          </div>

          <p className="mt-12 text-sm font-semibold text-statera-orange">
            In the product today
          </p>
          <h3 className="mt-3 max-w-2xl font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
            Live reporting and exportable AI briefings.
          </h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/75">
            Supervisors get a real-time view of open work: what remains
            unresolved, what has been idle too long, and where risk is
            concentrated. The AI briefing is generated from these live counts
            and does not invent numbers.
          </p>

          <div className="mt-8 grid gap-6">
            <ProductShot
              title="statera · reports"
              src="/screenshots/reports.png"
              alt="Statera reports page showing live counts of open work, weekly report volume, categories, and the AI ranking mix."
              width={1024}
              height={766}
            />
            <ProductShot
              title="statera · exportable briefing"
              src="/screenshots/briefing.png"
              alt="Statera AI briefing generated from live open reports, with highlights and concerns that a supervisor can export."
              width={1024}
              height={705}
            />
          </div>
        </LevelSection>

        <StrataDivider tone="text-level-3" seam="stroke-white/20" />
        <LevelSection
          id="compare"
          level="03"
          depth="−220 m"
          label="Compare"
          tone="bg-level-3"
          texture="dust-deep"
          dark
        >
          <p className="text-sm font-semibold text-statera-orange">
            Before and after
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            From disconnected tools to a closed loop.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">
            Today, issues are logged and then stall. With Statera, every issue
            has an owner until it is resolved.
          </p>

          <div className="mt-9 overflow-hidden rounded-2xl bg-white text-statera-ink ring-1 ring-black/10 sm:mt-12">
            <div className="hidden grid-cols-[1.1fr_1.1fr_0.9fr] border-b border-zinc-100 bg-zinc-50 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-statera-slate sm:grid">
              <p>Today (disconnected tools)</p>
              <p>
                With <span className="text-statera-orange">Statera</span>
              </p>
              <p>Impact</p>
            </div>
            {COMPARE.map((row) => (
              <div
                key={row.today}
                className="grid gap-2 border-b border-zinc-100 px-4 py-4 last:border-0 sm:grid-cols-[1.1fr_1.1fr_0.9fr] sm:items-center sm:gap-6 sm:px-6 sm:py-5"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:hidden">
                    Today
                  </p>
                  <p className="mt-0.5 text-sm leading-6 sm:mt-0">{row.today}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:hidden">
                    With Statera
                  </p>
                  <p className="mt-0.5 text-sm leading-6 sm:mt-0">{row.statera}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:hidden">
                    Impact
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-statera-orange sm:mt-0">
                    {row.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </LevelSection>

        <StrataDivider tone="text-level-4" seam="stroke-white/20" />
        <LevelSection
          id="roadmap"
          level="04"
          depth="−310 m"
          label="Roadmap"
          tone="bg-level-4"
          texture="dust-deep"
          dark
        >
          <p className="text-sm font-semibold text-statera-orange">
            Development status
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            What is available today, and what comes next.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">
            The core workflow is live: capture, prioritization, grouping,
            messaging, and resolution. The next phase adds a mobile app, smarter
            ticket assignment, and site-ready account management.
          </p>

          <div className="mt-9 grid gap-4 sm:mt-12 lg:grid-cols-2">
            <article className="rounded-2xl bg-white p-5 text-statera-ink ring-1 ring-black/10 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-statera-slate">
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
            <article className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/15 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-statera-orange">
                In development
              </p>
              <ul className="mt-5 space-y-3">
                {UNDER_DEVELOPMENT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-statera-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </LevelSection>

        <StrataDivider tone="text-level-5" seam="stroke-white/20" />
        <LevelSection
          id="deploy"
          level="05"
          depth="−420 m"
          label="On site"
          tone="bg-level-5"
          texture="dust-deep"
          dark
        >
          <p className="text-sm font-semibold text-statera-orange">
            Simple deployment
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            Runs on the devices your site already uses.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">
            There is no new hardware to purchase and no IT project to manage.
            Crews access Statera through a web link.
          </p>

          <div className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-3">
            {DEPLOY.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-white p-5 text-statera-ink ring-1 ring-black/10 sm:p-8"
              >
                <h3 className="font-display text-xl font-bold leading-[1.25] tracking-[-0.015em]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-statera-slate">{item.body}</p>
              </article>
            ))}
          </div>
        </LevelSection>

        <StrataDivider tone="text-black" seam="stroke-white/20" />
        <LevelSection
          id="pilot"
          level="06"
          depth="−520 m"
          label="Bedrock"
          tone="bg-black"
          texture="dust-deep"
          dark
        >
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-statera-orange">
                Pilot program
              </p>
              <h2 className="mt-3 font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                One prevented injury can pay for years of Statera.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/70 sm:mt-6 sm:text-base">
                We are seeking one mine to become our founding pilot partner: a
                90-day trial at a single site, with success metrics agreed in
                advance and no long-term commitment.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                <article className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/12">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                    Cost of a single injury
                  </p>
                  <p className="mt-2 font-display text-4xl font-extrabold tracking-[-0.03em] text-rose-400">
                    ~$48,000
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Average cost of a medically consulted injury, including
                    medical care, lost wages, and administrative expenses.
                  </p>
                </article>
                <div className="flex items-center justify-center py-1 sm:py-0">
                  <span className="rounded-full bg-statera-orange px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                    vs
                  </span>
                </div>
                <article className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/12">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                    Cost of a Statera pilot
                  </p>
                  <p className="mt-2 font-display text-4xl font-extrabold tracking-[-0.03em] text-emerald-400">
                    ~$1,000
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    90-day pilot, priced according to the size of the operation.
                  </p>
                </article>
              </div>

              <p className="mt-6 rounded-xl bg-white/10 px-5 py-4 text-sm font-medium leading-6 ring-1 ring-white/15">
                If Statera helps prevent a single incident, the pilot returns
                roughly 48 times its cost.
              </p>
              <p className="mt-3 text-xs leading-5 text-white/45">
                Indirect costs add roughly 1.3 times the direct cost. A mid-sized
                site absorbs approximately $290,000 in injury costs each year.
                Sources: National Safety Council, Injury Facts 2024; OSHA
                indirect-cost guidance.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {PILOT.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/12"
                  >
                    <h3 className="font-display text-base font-bold tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">{item.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-10">
                <p className="text-sm font-semibold text-statera-orange">
                  Statera flags the issue. A person always makes the decision.
                </p>
                <ul className="mt-4 space-y-2.5">
                  {TRUST.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-6 text-white/70"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-statera-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/15 sm:rounded-3xl sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-statera-orange">
                Next step
              </p>
              <p className="mt-3 font-display text-2xl font-bold tracking-[-0.015em]">
                A 30-minute call to assess whether Statera fits your site.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Share your details, and our team will follow up to scope a pilot.
              </p>
              <div className="mt-7">
                <NotifyForm submitLabel="Request a call" />
              </div>
              <a
                href={BUSINESS_PLAN.href}
                download={BUSINESS_PLAN.filename}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 transition hover:text-white hover:underline"
              >
                Download the business plan
                <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
        </LevelSection>
      </main>

      <footer className="bg-black px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          <div className="max-w-xl">
            <p className="text-xs text-white/45">
              © 2026 Statera Mine Systems, Saskatchewan, Canada. All rights
              reserved.
            </p>
            <p className="mt-2 text-xs leading-5 text-white/35">
              Statera supports safety reporting and communication. It does not
              replace a site’s own procedures, supervisory judgment, or
              regulatory obligations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={BUSINESS_PLAN.href}
              download={BUSINESS_PLAN.filename}
              className="text-xs font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              Download the business plan
            </a>
            <a
              href="#top"
              className="text-xs font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
