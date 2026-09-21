"use client";

import { useEffect, useState, useTransition } from "react";
import { generateSiteReport } from "@/app/supervisor/reports/actions";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/ui/controls";
import { formatDateTime, formatDuration } from "@/lib/tickets/format";
import type { SiteBriefing } from "@/lib/tickets/period-report";
import type { SiteReportStats } from "@/lib/tickets/trends";

const STORAGE_KEY = "statera.site-briefing";

function readStored(): SiteBriefing | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SiteBriefing;
    if (!parsed.headline || !parsed.summary) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(briefing: SiteBriefing) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(briefing));
  } catch {
    // Private mode or quota — the briefing still shows for this visit.
  }
}

function BriefingSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section>
      <h3 className="font-display text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
        {title}
      </h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

type GenerateReportProps = {
  stats: SiteReportStats;
};

export function GenerateReport({ stats }: GenerateReportProps) {
  const [briefing, setBriefing] = useState<SiteBriefing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setBriefing(readStored());
  }, []);

  function generate() {
    setError(null);
    startTransition(async () => {
      const result = await generateSiteReport();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setBriefing(result.briefing);
      writeStored(result.briefing);
    });
  }

  function exportPdf() {
    window.print();
  }

  return (
    <>
      <Panel className="print:hidden">
        <PanelHeader
          title="AI briefing"
          description="Claude writes a live narrative from the counts above. It leads with current reports and work that has sat open. It does not invent numbers or name people."
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={generate}
                disabled={pending}
                className={PRIMARY_BUTTON}
              >
                {pending
                  ? "Generating…"
                  : briefing
                    ? "Regenerate report"
                    : "Generate report"}
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={!briefing || pending}
                className={SECONDARY_BUTTON}
              >
                Export PDF
              </button>
            </div>
          }
        />
        <div className="px-4 py-4">
          {error ? (
            <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
          ) : null}
          {!briefing && !error ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Generate a site briefing from live open work, then export it as a
              PDF. It is not saved in Statera — export before you leave.
            </p>
          ) : null}
          {briefing ? (
            <div className="space-y-5">
              <div>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {briefing.headline}
                </p>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {formatDateTime(briefing.generatedAt)}
                  <span className="text-zinc-300 dark:text-zinc-600"> · </span>
                  {briefing.model === "template"
                    ? "Written from the counts (Claude unavailable)"
                    : "Narrated by Claude"}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {briefing.summary}
              </p>
              <BriefingSection title="Highlights" items={briefing.highlights} />
              <BriefingSection title="Concerns" items={briefing.concerns} />
              <BriefingSection
                title="Recommendations"
                items={briefing.recommendations}
              />
            </div>
          ) : null}
        </div>
      </Panel>

      {briefing ? (
        <article className="hidden print:block">
          <p className="font-display text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            Statera · Site briefing
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            {briefing.headline}
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Generated {formatDateTime(briefing.generatedAt)}
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-zinc-200 py-4 text-sm">
            <div>
              <dt className="text-xs text-zinc-500">Open</dt>
              <dd className="font-semibold tabular-nums">{stats.open}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Hazard reports</dt>
              <dd className="font-semibold tabular-nums">
                {stats.hazardReports}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Open over a week</dt>
              <dd className="font-semibold tabular-nums">{stats.longOpen}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">New this week</dt>
              <dd className="font-semibold tabular-nums">
                {stats.filedThisWeek}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Avg. to close</dt>
              <dd className="font-semibold tabular-nums">
                {formatDuration(stats.avgCloseMs)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Gone quiet</dt>
              <dd className="font-semibold tabular-nums">{stats.goneQuiet}</dd>
            </div>
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-zinc-800">
            {briefing.summary}
          </p>
          <div className="mt-6 space-y-5">
            <BriefingSection title="Highlights" items={briefing.highlights} />
            <BriefingSection title="Concerns" items={briefing.concerns} />
            <BriefingSection
              title="Recommendations"
              items={briefing.recommendations}
            />
          </div>
        </article>
      ) : null}
    </>
  );
}
