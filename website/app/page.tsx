import { BrandLogo } from "@/components/BrandLogo";
import { Headframe } from "@/components/Headframe";
import { LevelSection } from "@/components/LevelSection";
import { NotifyForm } from "@/components/NotifyForm";
import { StatusTrailMock } from "@/components/StatusTrailMock";
import { StrataDivider } from "@/components/StrataDivider";
import { SupervisorQueueMock } from "@/components/SupervisorQueueMock";
import { WindowChrome } from "@/components/WindowChrome";
import { WorkerReportMock } from "@/components/WorkerReportMock";

const STEPS = [
  {
    number: "01",
    title: "Report it.",
    body: "A photo, a category, a few words. It works offline and sends automatically when you’re back in range.",
  },
  {
    number: "02",
    title: "Triage it.",
    body: "Urgent reports rise to the top of the supervisor’s dashboard, so the serious ones get handled first.",
  },
  {
    number: "03",
    title: "Close it out.",
    body: "Every report moves from In Review to Resolved, and the worker gets an email at each step.",
  },
  {
    number: "04",
    title: "Report on it.",
    body: "Month, quarter, or year, the summary is already built from the reports your crew filed.",
  },
];

const QUICK_FACTS = [
  "Nothing to install: open a link",
  "Works underground, offline",
  "Ranked queue for supervisors",
];

const FEATURES = [
  {
    title: "Works where the signal doesn’t.",
    body: "Reports save on the device and sync automatically once you reconnect. Built for underground and remote sites.",
  },
  {
    title: "Your year in safety, without the scramble.",
    body: "Every report is already organized by category, status, and date, ready to help you prepare for your annual review or safety committee meeting.",
  },
  {
    title: "Open a link. Start reporting.",
    body: "No app store, no hardware, no IT department. Runs in the browser on any phone or laptop, with a 15-minute onboarding for your crew.",
  },
];

const PATTERN_REPORTS = [
  ["Today · 07:42", "Hoist brake response felt delayed", "Worker 03"],
  ["8 days ago", "Unexpected movement during hoist stop", "Worker 11"],
  ["19 days ago", "Hoist overshot level by approximately 20 cm", "Worker 03"],
];

export default function HomePage() {
  return (
    <div className="min-h-full bg-level-0 text-statera-ink">
      <header className="sticky top-0 z-40 border-b border-statera-ink/10 bg-level-0/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
          <a href="#top" aria-label="Statera home">
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-statera-slate md:flex">
            <a className="transition hover:text-statera-ink" href="#level-01">
              How it works
            </a>
            <a className="transition hover:text-statera-ink" href="#level-02">
              Roles
            </a>
            <a className="transition hover:text-statera-ink" href="#level-03">
              Patterns
            </a>
          </nav>

          <a
            href="#notify"
            className="rounded-lg bg-statera-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#bd7509]"
          >
            Get updates
          </a>
        </div>
      </header>

      {/* Surface */}
      <div id="top" className="wash relative">
        <LevelSection
          level="00"
          depth="Surface · 0 m"
          label="Surface"
          tone=""
          texture=""
        >
          <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10">
            <div>
              <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.32em] text-statera-orange">
                Coming soon
              </p>

              <h1 className="mt-7 font-display text-[44px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-6xl xl:text-[68px]">
                Keeping mines safe
                <br />
                starts with a report
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-statera-slate">
                Workers flag a hazard in about a minute, even with no signal.
                Supervisors see what’s urgent first, follow every report through
                to done, and have their year-end report ready when they need it.
              </p>

              <div id="notify" className="mt-9 max-w-xl scroll-mt-28">
                <NotifyForm />
                <p className="mt-3 text-xs text-zinc-500">
                  Leave your email and we’ll let you know when Statera is ready.
                </p>
              </div>
            </div>

            <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">
              <Headframe className="pointer-events-none absolute -left-10 bottom-0 hidden h-56 w-auto text-statera-ink/25 lg:block" />

              <div className="absolute left-0 top-6 z-20 w-[46%] max-w-[230px] lg:left-16">
                <WindowChrome title="statera · report">
                  <WorkerReportMock />
                </WindowChrome>
              </div>

              <div className="absolute right-0 top-0 z-10 w-[64%] max-w-[360px]">
                <WindowChrome title="statera · supervisor">
                  <SupervisorQueueMock />
                </WindowChrome>
              </div>

              <div className="absolute bottom-0 right-6 z-30 w-[56%] max-w-[300px] lg:right-16">
                <WindowChrome title="statera · report status">
                  <StatusTrailMock />
                </WindowChrome>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-y-4 border-t border-statera-ink/10 pt-7 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_FACTS.map((fact) => (
              <p className="text-sm text-statera-slate" key={fact}>
                {fact}
              </p>
            ))}
          </div>
        </LevelSection>
      </div>

      <main>
        <StrataDivider tone="text-level-1" />
        <LevelSection
          id="level-01"
          level="01"
          depth="−40 m"
          label="Report"
          tone="bg-level-1"
        >
          <p className="text-sm font-semibold text-statera-orange">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-5xl">
            From “someone should report that” to done.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl bg-white p-7 ring-1 ring-black/10"
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

        <StrataDivider tone="text-level-2" seam="stroke-white/20" />
        <LevelSection
          id="level-02"
          level="02"
          depth="−120 m"
          label="Triage"
          tone="bg-level-2"
          texture="dust-deep"
          dark
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-3xl bg-white/85 p-9 text-statera-ink ring-1 ring-black/5 sm:p-12">
              <p className="text-sm font-semibold text-statera-orange">For workers</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-4xl">
                You’ll know what happened.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-statera-slate">
                No more wondering if anyone read it. You get an email when your
                report is reviewed, when work starts, and when it’s resolved.
              </p>
            </article>

            <article className="rounded-3xl bg-statera-ink p-9 text-white ring-1 ring-black/5 sm:p-12">
              <p className="text-sm font-semibold text-statera-orange">
                For supervisors
              </p>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-4xl">
                The urgent stuff first. Nothing dropped.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300">
                See at a glance what needs attention now and what can wait.
                Every report has an owner, a status, and a full history, and
                open items stay visible until someone closes them.
              </p>
            </article>
          </div>
        </LevelSection>

        <StrataDivider tone="text-level-3" seam="stroke-white/20" />
        <LevelSection
          id="level-03"
          level="03"
          depth="−220 m"
          label="Patterns"
          tone="bg-level-3"
          texture="dust-deep"
          dark
        >
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold text-statera-orange">Pattern check</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-5xl">
                Three reports. Two workers. One hoist.
              </h2>
              <p className="mt-6 text-base leading-7 text-white/80">
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
              <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Similar activity · last 30 days
                  </p>
                  <p className="mt-1.5 font-display text-lg font-bold tracking-[-0.01em]">
                    Main shaft hoist
                  </p>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">
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

        <StrataDivider tone="text-level-4" seam="stroke-white/20" />
        <LevelSection
          level="04"
          depth="−310 m"
          label="Built for site"
          tone="bg-level-4"
          texture="dust-deep"
          dark
        >
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow-[0_18px_44px_-30px_rgba(0,0,0,0.5)] ring-1 ring-black/5"
              >
                <h2 className="font-display text-xl font-bold leading-[1.25] tracking-[-0.015em] text-statera-ink">
                  {feature.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-statera-slate">{feature.body}</p>
              </article>
            ))}
          </div>
        </LevelSection>

        <StrataDivider tone="text-level-5" seam="stroke-white/20" />
        <LevelSection
          level="05"
          depth="−420 m · bottom"
          label="Bedrock"
          tone="bg-level-5"
          texture="dust-deep"
          dark
        >
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-statera-orange">Accountability</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.025em] sm:text-5xl">
                Statera flags.
                <br />
                People decide.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
                Statera never closes, dismisses, or changes a report on its own.
                A named person takes every action, and every step is logged with
                who did it and when.
              </p>
            </div>

            <div className="rounded-3xl bg-white/[0.07] p-8 ring-1 ring-white/15 sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-statera-orange">
                Coming soon
              </p>
              <p className="mt-3 font-display text-2xl font-bold tracking-[-0.015em]">
                Be first up the shaft.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                We’ll email once, when Statera is ready.
              </p>
              <div className="mt-7">
                <NotifyForm />
              </div>
            </div>
          </div>
        </LevelSection>
      </main>

      <footer className="bg-statera-ink px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-3">
          <p className="text-xs text-white/45">
            © 2026 Statera Mine Systems. All rights reserved.
          </p>
          <a
            href="#top"
            className="text-xs font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
          >
            Return to surface ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
