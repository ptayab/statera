import { BrandLogo } from "@/components/BrandLogo";
import { Headframe } from "@/components/Headframe";
import { LevelSection } from "@/components/LevelSection";
import { NotifyForm } from "@/components/NotifyForm";
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
    body: "Every report is assigned, tracked to done, and the worker hears at each step. Nothing sits in a binder.",
  },
  {
    number: "04",
    title: "Learn from it.",
    body: "Recurring risks and the year-end summary are already built from the reports your crew filed.",
  },
];

const GAP = [
  {
    title: "Reporting is still paperwork.",
    body: "Hazards get logged on paper, whiteboards, or office software. A worker who spots something has to stop, find a form, and fill it out at the end of a shift, if they fill it out at all.",
  },
  {
    title: "Near misses stay invisible.",
    body: "The early-warning signals that precede serious incidents are the least likely to be captured. Most never leave the shift.",
  },
  {
    title: "Filed reports go nowhere.",
    body: "What does get written down sits in binders and spreadsheets. Nobody can triage it, track it to done, or see the pattern.",
  },
];

const QUICK_FACTS = [
  "Open a link. Nothing to install.",
  "Works underground, offline",
  "Unlimited reporters per site",
  "Data hosted in Canada",
];

const FEATURES = [
  {
    title: "Works where the signal doesn’t.",
    body: "Reports save on the device and sync automatically once you reconnect. Built for underground and remote sites.",
  },
  {
    title: "Built for the face, not the office.",
    body: "Reporting takes seconds in real mine conditions, with hazard, near-miss, and incident types supervisors already use.",
  },
  {
    title: "Every worker can report.",
    body: "A site licence covers unlimited field reporters. You are not charged per person, so cost does not decide who can speak up.",
  },
  {
    title: "Your data stays in Canada.",
    body: "Hosted and processed in a Canadian region. The mine owns the records. AI does not train on your reports.",
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

const PATTERN_REPORTS = [
  ["Today · 07:42", "Hoist brake response felt delayed", "Worker 03"],
  ["8 days ago", "Unexpected movement during hoist stop", "Worker 11"],
  ["19 days ago", "Hoist overshot level by approximately 20 cm", "Worker 03"],
];

const BUSINESS_PLAN = {
  href: "/Statera_Business_Plan.docx",
  filename: "Statera_Business_Plan.docx",
};

export default function HomePage() {
  return (
    <div className="min-h-full bg-level-0 text-statera-ink">
      <header className="sticky top-0 z-40 border-b border-statera-ink/10 bg-level-0/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-6 lg:px-10">
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
            <a className="transition hover:text-statera-ink" href="#why">
              Why Statera
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
              className="rounded-lg bg-statera-orange px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#bd7509] sm:px-4 sm:py-2.5 sm:text-[12px]"
            >
              Start a pilot
            </a>
          </div>
        </div>
      </header>

      {/* Surface */}
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
              <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.32em] text-statera-orange">
                Safety reporting for mine sites
              </p>

              <h1 className="mt-7 font-display text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-5xl md:text-6xl xl:text-[68px]">
                Keeping mines safe
                <br />
                starts with a report
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-statera-slate sm:mt-6 sm:text-lg sm:leading-8">
                Workers capture a hazard, near miss, or incident in about a
                minute, even with no signal. Supervisors see what’s urgent
                first, follow every ticket through to done, and catch the
                pattern before it becomes an incident.
              </p>

              <div className="mt-7 max-w-xl scroll-mt-24 sm:mt-9">
                <NotifyForm submitLabel="Talk to us" />
                <p className="mt-3 text-xs text-zinc-500">
                  Leave your email and we’ll follow up about a three-month
                  founding pilot at one site.
                </p>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-sm flex-col gap-5 sm:max-w-md lg:mx-0 lg:block lg:max-w-none lg:min-h-[560px]">
              <Headframe className="pointer-events-none absolute -left-10 bottom-0 hidden h-56 w-auto text-statera-ink/25 lg:block" />

              <div className="lg:absolute lg:left-16 lg:top-6 lg:z-20 lg:w-[46%] lg:max-w-[230px]">
                <WindowChrome title="statera · report">
                  <WorkerReportMock />
                </WindowChrome>
              </div>

              <div className="lg:absolute lg:right-0 lg:top-0 lg:z-10 lg:w-[64%] lg:max-w-[360px]">
                <WindowChrome title="statera · supervisor">
                  <SupervisorQueueMock />
                </WindowChrome>
              </div>

              {/* Third mock would triple the hero's height on a phone. */}
              <div className="hidden sm:block lg:absolute lg:bottom-0 lg:right-16 lg:z-30 lg:w-[56%] lg:max-w-[300px]">
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

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-statera-slate/70">
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
          <p className="text-sm font-semibold text-statera-orange">The reporting gap</p>
          <h2 className="mt-3 max-w-3xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            Most near misses never leave the shift.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-statera-slate sm:text-base">
            On most sites, hazards, near misses, and incidents are still logged
            on paper, whiteboards, or generic office tools. The early warnings
            that would have prevented the next incident are the least likely to
            be captured.
          </p>

          <div className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
            {GAP.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-white p-7 ring-1 ring-black/10"
              >
                <h3 className="font-display text-lg font-bold tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-statera-slate">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
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
          <p className="text-sm font-semibold text-statera-orange">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            From the first report to the pattern behind it.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">
            Every issue becomes a ticket. The right people stay informed as it
            moves, and nothing gets lost.
          </p>

          <div className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl bg-white p-7 text-statera-ink ring-1 ring-black/10"
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
        </LevelSection>

        <StrataDivider tone="text-level-3" seam="stroke-white/20" />
        <LevelSection
          id="level-02"
          level="03"
          depth="−220 m"
          label="Triage"
          tone="bg-level-3"
          texture="dust-deep"
          dark
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-3xl bg-white/85 p-7 text-statera-ink ring-1 ring-black/5 sm:p-12">
              <p className="text-sm font-semibold text-statera-orange">For workers</p>
              <h2 className="mt-4 font-display text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-3xl lg:text-4xl">
                You’ll know what happened.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-7 text-statera-slate sm:mt-5 sm:text-base">
                You get an email when your report is reviewed, when work starts,
                and when it’s resolved.
              </p>
            </article>

            <article className="rounded-3xl bg-statera-ink p-7 text-white ring-1 ring-black/5 sm:p-12">
              <p className="text-sm font-semibold text-statera-orange">
                For supervisors
              </p>
              <h2 className="mt-4 font-display text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-3xl lg:text-4xl">
                Urgent reports come first, and nothing gets dropped.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-7 text-zinc-300 sm:mt-5 sm:text-base">
                AI helps rank a high volume of reports so you can keep up. Every
                ticket has an owner, a status, and a full history. Open items
                stay visible until someone closes them.
              </p>
            </article>
          </div>
        </LevelSection>

        <StrataDivider tone="text-level-4" seam="stroke-white/20" />
        <LevelSection
          id="level-03"
          level="04"
          depth="−310 m"
          label="Patterns"
          tone="bg-level-4"
          texture="dust-deep"
          dark
        >
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold text-statera-orange">Pattern check</p>
              <h2 className="mt-3 font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                Three reports. Two workers. One hoist.
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-white/80 sm:mt-6 sm:text-base">
                Nobody reading today’s reports can see that the same near-miss
                came up twice last week. Statera can. It looks across 30 days of
                reports and flags when the same problem keeps showing up in the
                same place or on the same equipment.
              </p>
              <p className="mt-6 rounded-xl bg-white/10 px-5 py-4 text-sm font-medium leading-6 ring-1 ring-white/15">
                Flags point to the location or machine, never to the people who
                reported it.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-statera-ink shadow-[0_28px_70px_-36px_rgba(0,0,0,0.5)] ring-1 ring-black/5 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-b border-zinc-100 pb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Similar activity · last 30 days
                  </p>
                  <p className="mt-1.5 font-display text-lg font-bold tracking-[-0.01em]">
                    Main shaft hoist
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                  Pattern flagged
                </span>
              </div>

              {PATTERN_REPORTS.map(([date, report, worker], index) => (
                <div
                  key={report}
                  className="flex gap-4 border-b border-zinc-50 py-5 last:border-0 last:pb-0"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-statera-mist text-xs font-bold text-statera-slate">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{report}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {date} · {worker}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LevelSection>

        <StrataDivider tone="text-level-5" seam="stroke-white/20" />
        <LevelSection
          id="why"
          level="05"
          depth="−420 m"
          label="Built for site"
          tone="bg-level-5"
          texture="dust-deep"
          dark
        >
          <p className="text-sm font-semibold text-statera-orange">Why Statera</p>
          <h2 className="mt-3 max-w-2xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            Made for the crew, and for this industry.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/70 sm:text-base">
            Built to sit with the crew, not only in the EHS office. It works with
            the systems you already run. It does not replace them.
          </p>

          <div className="mt-9 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl bg-white p-7 shadow-[0_18px_44px_-30px_rgba(0,0,0,0.5)] ring-1 ring-black/5 sm:p-8"
              >
                <h3 className="font-display text-xl font-bold leading-[1.25] tracking-[-0.015em] text-statera-ink">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-statera-slate">{feature.body}</p>
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
              <p className="text-sm font-semibold text-statera-orange">Founding pilot</p>
              <h2 className="mt-3 font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                A three-month trial at one site.
                <br />
                You keep the data.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/70 sm:mt-6 sm:text-base">
                We are looking for one mine to be our founding pilot partner. A
                trial of Statera at a single site, with success metrics we agree
                on before we start, and no long-term commitment.
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

            <div className="rounded-3xl bg-white/[0.07] p-7 ring-1 ring-white/15 sm:p-10">
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

      <footer className="bg-black px-5 py-8 sm:px-6 lg:px-10">
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
