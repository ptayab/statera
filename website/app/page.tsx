import { BrandLogo } from "@/components/BrandLogo";
import { NotifyForm } from "@/components/NotifyForm";
import { StatusTrailMock } from "@/components/StatusTrailMock";
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
  "Built for crews of 5 to 50",
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
    <div className="min-h-full bg-white text-statera-ink">
      <div className="bg-statera-mist px-6 py-2.5 text-center text-[13px] text-statera-slate">
        Safety reporting built for mine crews.{" "}
        <a
          className="font-semibold text-statera-ink underline-offset-4 hover:underline"
          href="#how-it-works"
        >
          See how it works →
        </a>
      </div>

      <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
          <a href="#top" aria-label="Statera home">
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-statera-slate md:flex">
            <a className="transition hover:text-statera-ink" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-statera-ink" href="#features">
              Features
            </a>
            <a className="transition hover:text-statera-ink" href="#patterns">
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

      <section id="top" className="wash relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:px-10 lg:pb-32 lg:pt-20">
          <div>
            <span className="inline-flex items-center gap-2.5 rounded-full bg-white/80 py-1.5 pl-1.5 pr-4 shadow-sm ring-1 ring-black/5">
              <span className="rounded-full bg-statera-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                New
              </span>
              <span className="text-[13px] font-medium text-statera-slate">
                AI-assisted hazard ranking
              </span>
            </span>

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
                Leave your work email and we’ll let you know when Statera opens
                for your site.
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">
            <div className="absolute left-0 top-6 z-20 w-[46%] max-w-[230px] lg:left-4">
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
      </section>

      <section className="border-y border-zinc-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-y-4 px-6 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {QUICK_FACTS.map((fact) => (
            <div className="flex items-center gap-2.5" key={fact}>
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-statera-mist"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-statera-orange" />
              </span>
              <p className="text-sm text-statera-slate">{fact}</p>
            </div>
          ))}
        </div>
      </section>

      <main>
        <section id="how-it-works" className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold text-statera-orange">How it works</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-5xl">
              From “someone should report that” to done.
            </h2>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <article
                  key={step.number}
                  className="rounded-2xl bg-[#f7f8fc] p-7 ring-1 ring-black/5 transition hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(27,36,54,0.4)]"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-statera-orange shadow-sm ring-1 ring-black/5">
                    {step.number}
                  </span>
                  <h3 className="mt-6 font-display text-lg font-bold tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-statera-slate">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 px-6 pb-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
            <article className="rounded-3xl bg-[#f1f4fd] p-9 ring-1 ring-black/5 sm:p-12">
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
              <p className="text-sm font-semibold text-statera-orange">For supervisors</p>
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
        </section>

        <section id="patterns" className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold text-statera-orange">Pattern check</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-5xl">
                Three reports. Two workers. One hoist.
              </h2>
              <p className="mt-6 text-base leading-7 text-statera-slate">
                Nobody reading today’s reports can see that the same near-miss
                came up twice last week. Statera can. It looks across 30 days of
                reports and flags when the same problem keeps showing up in the
                same place or on the same equipment.
              </p>
              <p className="mt-6 rounded-xl bg-statera-mist px-5 py-4 text-sm font-medium leading-6">
                Flags point to the location or machine, never to the people who
                reported it.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-[0_28px_70px_-36px_rgba(27,36,54,0.5)] ring-1 ring-black/5 sm:p-8">
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
        </section>

        <section className="px-6 pb-24 lg:px-10 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow-[0_18px_44px_-30px_rgba(27,36,54,0.5)] ring-1 ring-black/5"
              >
                <h2 className="font-display text-xl font-bold leading-[1.25] tracking-[-0.015em]">
                  {feature.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-statera-slate">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-10 lg:pb-28">
          <div className="wash mx-auto max-w-7xl rounded-3xl px-8 py-16 text-center ring-1 ring-black/5 sm:px-12 lg:py-20">
            <p className="text-sm font-semibold text-statera-orange">Accountability</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-5xl">
              Statera flags. People decide.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-statera-slate">
              Statera never closes, dismisses, or changes a report on its own. A
              named person takes every action, and every step is logged with who
              did it and when.
            </p>
            <div className="mx-auto mt-9 max-w-xl">
              <NotifyForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 bg-white px-6 py-8 lg:px-10">
        <p className="mx-auto max-w-7xl text-xs text-zinc-500">
          © 2026 Statera Mine Systems. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
