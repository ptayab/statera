import { RankingFeedback } from "@/components/dashboard/RankingFeedback";
import { Chip, IdleChip } from "@/components/ui/Chip";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import type { TicketUrgency } from "@/lib/supabase/types";
import type { TicketAiAnalysis } from "@/lib/tickets/ai-analysis";
import type { RankingFeedbackRecord } from "@/lib/tickets/ranking-feedback";
import {
  formatDateTime,
  formatDayCount,
  formatTimeAgo,
} from "@/lib/tickets/format";
import {
  PRIORITY_THRESHOLDS,
  SCORE_METER_MAX,
  type TicketScore,
} from "@/lib/tickets/scoring";
import { categoryVisual, idleVisual, priorityVisual } from "@/lib/tickets/theme";

/** Caps used to draw each signal bar as "how strongly this signal fired". */
const SIGNAL_CAPS = {
  category: 50,
  age: 40,
  dormancy: 30,
  wording: 20,
  feedback: 20,
};

function SignalRow({
  label,
  detail,
  points,
  cap,
  fill,
}: {
  label: string;
  detail: string;
  points: number;
  cap: number;
  fill: string;
}) {
  const pct = cap > 0 ? Math.min(Math.abs(points) / cap, 1) * 100 : 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="min-w-0 truncate text-xs">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {label}
          </span>
          <span className="text-zinc-500 dark:text-zinc-400"> · {detail}</span>
        </p>
        <span
          className={`shrink-0 text-xs font-semibold tabular-nums ${
            points !== 0
              ? "text-zinc-700 dark:text-zinc-200"
              : "text-zinc-300 dark:text-zinc-600"
          }`}
        >
          {points > 0 ? "+" : ""}
          {points}
        </span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
        <div
          className={`h-full rounded-full ${fill}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

type AiRankingPanelProps = {
  ticketId: string;
  ranking: TicketScore;
  urgency: TicketUrgency;
  category: string;
  createdAt: string;
  lastEventAt: string | null;
  duplicateCount: number;
  analysis: TicketAiAnalysis | null;
  rankingFeedback: RankingFeedbackRecord | null;
};

/**
 * The full AI assessment for one issue: where it landed on the priority scale,
 * which signals pushed it there, and how long it has been sitting idle. Raw
 * scores are deliberately confined to this panel and kept off the dashboard.
 */
export function AiRankingPanel({
  ticketId,
  ranking,
  urgency,
  category,
  createdAt,
  lastEventAt,
  duplicateCount,
  analysis,
  rankingFeedback,
}: AiRankingPanelProps) {
  const priority = priorityVisual(ranking.label);
  const idle = idleVisual(ranking.daysIdle);
  const { factors } = ranking;

  const base =
    factors.categoryPts +
    factors.agePts +
    factors.dormancyPts +
    factors.descriptionPts +
    factors.feedbackAdjustment;
  const meterPct = Math.min(ranking.score / SCORE_METER_MAX, 1) * 100;
  const daysOpen = ranking.daysOpen;

  return (
    <Panel accent={priority.fill}>
      <PanelHeader
        title="AI ranking"
        description={`Separate from the reporter’s ranking of ${urgency}.`}
      />

      <div className={`px-4 py-4 ${priority.wash}`}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p
              className={`font-display text-4xl uppercase leading-none tracking-[0.03em] ${priority.text}`}
            >
              {ranking.label}
            </p>
            <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {analysis
                ? "Wording scored by Claude · other signals live"
                : "Recomputed on every view"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <RankingFeedback
              ticketId={ticketId}
              rankingLabel={ranking.label}
              rankingScore={ranking.score}
              initialFeedback={rankingFeedback}
            />
            <div className="text-right">
              <p className="font-display text-3xl leading-none tabular-nums text-zinc-900 dark:text-zinc-100">
                {ranking.score}
              </p>
              <p className="mt-1 font-display text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                Score
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative h-2 overflow-hidden rounded-full bg-zinc-900/[0.07] dark:bg-white/10">
            <div
              className={`h-full rounded-full ${priority.fill}`}
              style={{ width: `${meterPct}%` }}
            />
            {PRIORITY_THRESHOLDS.filter((tier) => tier.min > 0).map((tier) => (
              <span
                key={tier.label}
                className="absolute top-0 h-full w-px bg-panel"
                style={{ left: `${(tier.min / SCORE_METER_MAX) * 100}%` }}
                aria-hidden
              />
            ))}
          </div>
          <div className="relative mt-1.5 h-3">
            {PRIORITY_THRESHOLDS.filter((tier) => tier.min > 0).map((tier) => (
              <span
                key={tier.label}
                className="absolute -translate-x-1/2 text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500"
                style={{ left: `${(tier.min / SCORE_METER_MAX) * 100}%` }}
              >
                {tier.min}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3.5 border-t border-hairline px-4 py-4">
        <h3 className="font-display text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          Signals
        </h3>

        <SignalRow
          label="Category"
          detail={categoryVisual(category).short}
          points={factors.categoryPts}
          cap={SIGNAL_CAPS.category}
          fill="bg-rose-500"
        />
        <SignalRow
          label="Age"
          detail={`open ${formatDayCount(daysOpen)}`}
          points={factors.agePts}
          cap={SIGNAL_CAPS.age}
          fill="bg-sky-500"
        />
        <SignalRow
          label="Dormancy"
          detail={`${formatDayCount(ranking.daysIdle)} without an update`}
          points={factors.dormancyPts}
          cap={SIGNAL_CAPS.dormancy}
          fill="bg-orange-500"
        />
        <SignalRow
          label="Wording"
          detail={analysis ? "Claude language analysis" : "keyword fallback"}
          points={factors.descriptionPts}
          cap={SIGNAL_CAPS.wording}
          fill="bg-violet-500"
        />
        {factors.feedbackAdjustment !== 0 ? (
          <SignalRow
            label="Site feedback"
            detail="supervisor guidance from similar reports"
            points={factors.feedbackAdjustment}
            cap={SIGNAL_CAPS.feedback}
            fill={
              factors.feedbackAdjustment > 0
                ? "bg-emerald-500"
                : "bg-sky-500"
            }
          />
        ) : null}

        {analysis?.languageSummary ? (
          <p className="rounded-lg bg-inset px-3 py-2.5 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {analysis.languageSummary}
          </p>
        ) : null}
        {analysis?.feedbackSummary ? (
          <p className="rounded-lg bg-sky-50 px-3 py-2.5 text-[11px] leading-relaxed text-sky-800 dark:bg-sky-500/10 dark:text-sky-300">
            Feedback applied: {analysis.feedbackSummary}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-inset px-3 py-2.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {base}
          </span>
          <span>base</span>
          <span aria-hidden className="text-zinc-300 dark:text-zinc-600">
            ×
          </span>
          <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {factors.urgencyMultiplier}
          </span>
          <span>{urgency.toLowerCase()} user ranking</span>
          {factors.duplicateMultiplier !== 1 ? (
            <>
              <span aria-hidden className="text-zinc-300 dark:text-zinc-600">
                ×
              </span>
              <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {factors.duplicateMultiplier}
              </span>
              <span>similar reports</span>
            </>
          ) : null}
          <span aria-hidden className="text-zinc-300 dark:text-zinc-600">
            =
          </span>
          <span className={`font-semibold tabular-nums ${priority.text}`}>
            {ranking.score}
          </span>
        </div>
      </div>

      <div className="border-t border-hairline px-4 py-4">
        <h3 className="font-display text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          Idle time
        </h3>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p
              className={`font-display text-4xl leading-none tabular-nums ${idle.text}`}
            >
              {formatDayCount(ranking.daysIdle)}
            </p>
            <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              since the last update
            </p>
          </div>
          <IdleChip daysIdle={ranking.daysIdle} />
        </div>

        <dl className="mt-4 space-y-2 border-t border-hairline pt-3">
          <MetaRow
            label="Last activity"
            value={
              lastEventAt
                ? `${formatDateTime(lastEventAt)} (${formatTimeAgo(lastEventAt)})`
                : "No activity yet"
            }
          />
          <MetaRow label="Opened" value={formatTimeAgo(createdAt)} />
          <MetaRow
            label="Dormancy penalty"
            value={
              factors.dormancyPts > 0 ? `+${factors.dormancyPts} score` : "None"
            }
          />
        </dl>

        {duplicateCount > 1 ? (
          <div className="mt-4 border-t border-hairline pt-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Similar open reports
              </span>
              <Chip
                title={
                  analysis?.duplicateReason ??
                  `${duplicateCount} reports grouped as the same issue`
                }
              >
                <span className="tabular-nums">×{duplicateCount}</span> similar
              </Chip>
            </div>
            {analysis?.duplicateReason ? (
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {analysis.duplicateReason}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
