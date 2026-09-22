import { BrandLogo } from "@/components/BrandLogo";
import { DemoVideo } from "@/components/DemoVideo";
import { Headframe } from "@/components/Headframe";
import { LevelSection } from "@/components/LevelSection";
import { NotifyForm } from "@/components/NotifyForm";
import { ProductShot } from "@/components/ProductShot";
import { StatusTrailMock } from "@/components/StatusTrailMock";
import { StrataDivider } from "@/components/StrataDivider";
import { SupervisorQueueMock } from "@/components/SupervisorQueueMock";
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
    title: "Capture it.",
    body: "A photo, a category, a few words. Hazard, near miss, or incident. It works offline and sends when you’re back in range.",
  },
  {
    number: "02",
    title: "Triage it.",
    body: "AI ranks the queue so urgent reports rise to the top. Supervisors still decide what happens next.",
  },
  {
    number: "03",
    title: "Close it out.",
    body: "Every report is assigned, tracked to completion, and the worker hears at each step. Nothing sits in a binder.",
  },
  {
    number: "04",
    title: "Learn from it.",
    body: "Recurring risks and the year-end summary are already built from the reports your crew filed.",
  },
];

const SILENCE = [
  "49% too slow or clunky",
  "44% still on paper, email, or verbal",
  "38% fear backlash",
];

const HAZARD_RETURNS = [
  {
    number: "01",
    title: "No early warning",
    body: "Near misses never surface. 39% of sites miss the early signals.",
  },
  {
    number: "02",
    title: "People stop bothering",
    body: "Paper, email, or verbal reports lose information easily. People have lost trust that speaking up changes anything, so they stop bothering. 54% stay quiet after nothing happens.",
  },
  {
    number: "03",
    title: "No one has time",
    body: "Short-staffed crews skip the paperwork. 45% say that is why they do not file. This is going to be especially true as the global workforce shortage begins.",
  },
];

const COMPARE = [
  {
    today: "Issues logged, not resolved",
    statera: "Action driven to completion",
    impact: "More hazards are fixed",
  },
  {
    today: "No clear ownership",
    statera: "Assigned and tracked ownership",
    impact: "Accountability on every issue",
  },
  {
    today: "90% of issues go unreported",
    statera: "2–3x more reports captured",
    impact: "Full visibility of site risk",
  },
  {
    today: "Patterns go unnoticed",
    statera: "AI detects patterns",
    impact: "Minutes, not weeks",
  },
  {
    today: "React late",
    statera: "Act early",
    impact: "Fewer accidents",
  },
];

const WORKING_TODAY = [
  "1-minute worker reporting with photos",
  "AI priority ranking, with its reasoning shown",
  "Similar reports grouped into one issue",
  "Two-way messaging and a full audit history",
];

const UNDER_DEVELOPMENT = [
  "Mobile app, with occurrence capture and voice capture",
  "More analytical features, including future predictions",
  "Assign a ticket to the supervisor who is the best fit",
  "Site-ready accounts, roles, and security",
];

const DEPLOY = [
  {
    title: "Easy to implement",
    body: "Fits the workflow mines already run. It sits beside official reporting procedures. It does not replace them.",
  },
  {
    title: "Existing devices",
    body: "Runs on the phones, tablets, and computers already on site. No new hardware. No new IT stack.",
  },
  {
    title: "Scales easily",
    body: "One crew, then one site, then many sites on the same platform.",
  },
];

const PILOT = [
  {
    title: "One site, three months",
    body: "Full platform, unlimited field reporters, onboarding included. No long-term lock-in.",
  },
  {
    title: "Success you define",
    body: "We agree the metrics up front: reports filed, time to action, and crew adoption.",
  },
  {
    title: "Your data, in Canada",
    body: "Hosted in a Canadian region. You own it. Access is role-based and logged.",
  },
];

const TRUST = [
  "Encrypted in transit and at rest",
  "Role-based access and an audit trail",
  "AI ranks reports. A named person takes every action",
  "Supports your procedures. It does not replace them.",
];

const QUICK_FACTS = [
  "Open a link. Nothing to install.",
  "Works underground, offline",
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
              <span className="hidden sm:inline">Start a pilot</span>
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
          <a className="shrink-0 transition hover:text-statera-ink" href="#pilot">
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

              <h1 className="mt-5 font-display text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:mt-7 sm:text-5xl md:text-6xl xl:text-[68px]">
                Keeping mines safe
                <br />
                starts with a report
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-statera-slate sm:mt-6 sm:text-lg sm:leading-8">
                Workers capture a hazard, near miss, or incident in about a
                minute, even with no signal. Supervisors see what’s urgent
                first, follows every ticket through to completion, and catch
                the pattern before it becomes an incident.
              </p>

              <div className="mt-7 max-w-xl scroll-mt-24 sm:mt-9">
                <NotifyForm submitLabel="Talk to us" />
                <p className="mt-3 text-xs text-zinc-500">
                  Leave your email and we will follow up about your pilot
                  interest on our product.
                </p>
              </div>
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
            Leaders are flying blind.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-statera-slate sm:text-base">
            What doesn’t get logged can’t be fixed, and almost nothing gets
            logged. Decisions get made on a sliver of what happens on the floor.
          </p>

          <div className="mt-9 grid gap-4 sm:mt-12 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-2xl bg-white p-5 ring-1 ring-black/10 sm:p-8">
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      Reported
                    </p>
                    <p className="text-sm font-bold text-statera-ink">10%</p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full w-[10%] rounded-full bg-statera-orange" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      Unreported
                    </p>
                    <p className="text-sm font-bold text-statera-ink">90%</p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full w-[90%] rounded-full bg-zinc-700" />
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-statera-slate">
                Hazards have to be reported before they can be fixed.
              </p>
            </article>

            <article className="rounded-2xl bg-statera-ink p-5 text-white ring-1 ring-black/10 sm:p-8">
              <p className="font-display text-5xl font-extrabold leading-none tracking-[-0.04em] text-statera-orange sm:text-6xl">
                90%
              </p>
              <p className="mt-4 text-[15px] leading-7 text-white/80">
                of workplace incidents, hazards, and near misses go unreported.
              </p>
            </article>
          </div>

          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-statera-slate">
            Why workers stay silent
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
            The same hazard comes back.
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
            Companies that do not adequately respond to issues see 53–75% higher
            odds of a subsequent serious accident.
          </p>
          <p className="mt-3 max-w-3xl text-[11px] leading-5 text-statera-slate/80">
            Sources: 2026 EHS Benchmarking Report, Benchmark Gensuite (260+ EHS
            professionals). Journal of Occupational Health, 2024.
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
            Statera turns a one-minute field report into a ticket with an owner,
            a status, and a history. Urgent work rises first. Similar reports
            group together. The crew hears back at each step.
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
            A quick look at the workflow
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
            Live reports, then a briefing you can export.
          </h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/75">
            Supervisors get a live picture of open work: what is still unresolved,
            what has sat too long, and where the risk is clustering. The AI
            briefing is written from those live counts. It does not invent
            numbers.
          </p>

          <div className="mt-8 grid gap-6">
            <ProductShot
              title="statera · reports"
              src="/screenshots/reports.png"
              alt="Statera reports page showing live counts for open work, weekly volume, categories, and AI ranking mix."
              width={1024}
              height={766}
            />
            <ProductShot
              title="statera · exportable briefing"
              src="/screenshots/briefing.png"
              alt="Statera AI briefing written from live open reports, with highlights and concerns a supervisor can export."
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
            Before vs after
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            Disconnected tools versus a closed loop.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">
            Today, issues get logged and stall. With Statera, someone owns them
            until they are done.
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
            Built vs building
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            What works today, and what is next.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">
            The core loop is live: capture, rank, group, message, and close.
            The next layer is a mobile app, tighter assignment, and site-ready
            accounts.
          </p>

          <div className="mt-9 grid gap-4 sm:mt-12 lg:grid-cols-2">
            <article className="rounded-2xl bg-white p-5 text-statera-ink ring-1 ring-black/10 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-statera-slate">
                Working today
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
                Under development
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
            Easy to deploy
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            Runs on what mines already have.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">
            No new hardware. No new IT project. Open a link on the devices
            already at the site.
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
                Why pilot with us
              </p>
              <h2 className="mt-3 font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                One prevented injury pays for years of Statera.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/70 sm:mt-6 sm:text-base">
                We are looking for one mine to be our founding pilot partner. A
                90-day trial at a single site, with success metrics we agree on
                before we start, and no long-term commitment.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                <article className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/12">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                    Cost of one injury
                  </p>
                  <p className="mt-2 font-display text-4xl font-extrabold tracking-[-0.03em] text-rose-400">
                    ~$48,000
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Average cost of one medically consulted injury: medical care,
                    lost wages, and admin.
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
                    90-day pilot, scaled to mine size.
                  </p>
                </article>
              </div>

              <p className="mt-6 rounded-xl bg-white/10 px-5 py-4 text-sm font-medium leading-6 ring-1 ring-white/15">
                If Statera helps prevent even one incident, the pilot pays for
                itself about 48x over.
              </p>
              <p className="mt-3 text-xs leading-5 text-white/45">
                Indirect costs add about 1.3x more. A mid-size site absorbs
                roughly $290K a year. Sources: National Safety Council, Injury
                Facts 2024; OSHA indirect-cost guidance.
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
                  Statera flags the issue. A person decides what to do.
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
                A 30-minute call to see if this works for your site.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Tell us who you are. We’ll follow up to scope a pilot.
              </p>
              <div className="mt-7">
                <NotifyForm
                  submitLabel="Request a conversation"
                  showOrganization
                />
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
              © 2026 Statera Mine Systems. Saskatchewan. All rights reserved.
            </p>
            <p className="mt-2 text-xs leading-5 text-white/35">
              Statera assists safety reporting and communication. It does not
              replace a site’s own procedures, supervisor judgment, or
              regulatory obligations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={BUSINESS_PLAN.href}
              download={BUSINESS_PLAN.filename}
              className="text-xs font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              Download business plan
            </a>
            <a
              href="#top"
              className="text-xs font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              Return to surface ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
