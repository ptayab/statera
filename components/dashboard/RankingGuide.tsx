import { PriorityTag } from "@/components/ui/Chip";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { RANKING_RESPONSE_GUIDANCE } from "@/lib/tickets/scoring";
import { PRIORITY_ORDER, priorityVisual } from "@/lib/tickets/theme";

export function RankingGuide() {
  return (
    <Panel>
      <PanelHeader
        title="AI rankings"
        description="How soon each ranking should be acted on. Separate from the reporter’s ranking."
      />
      <div className="grid gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRIORITY_ORDER.map((label) => {
          const visual = priorityVisual(label);
          return (
            <div
              key={label}
              className="relative overflow-hidden rounded-xl bg-inset py-3 pl-5 pr-3"
            >
              <span
                className={`absolute inset-y-0 left-0 w-[3px] ${visual.rail}`}
                aria-hidden
              />
              <PriorityTag label={label} />
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {RANKING_RESPONSE_GUIDANCE[label]}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
