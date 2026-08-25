import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  SUPERVISOR_HANDLING_REMINDERS,
  SUPERVISOR_STATUS_GUIDANCE,
  SUPERVISOR_STATUS_OPTIONS,
} from "@/lib/tickets/status";

export function SupervisorReminders() {
  return (
    <Panel>
      <PanelHeader title="Reminders" />
      <div className="space-y-4 px-4 py-4">
        <ul className="space-y-2">
          {SUPERVISOR_STATUS_OPTIONS.map((status) => (
            <li
              key={status}
              className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {status}
              </span>
              {` — ${SUPERVISOR_STATUS_GUIDANCE[status]}`}
            </li>
          ))}
        </ul>
        <ul className="space-y-2 border-t border-hairline pt-4">
          {SUPERVISOR_HANDLING_REMINDERS.map((reminder) => (
            <li
              key={reminder}
              className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {reminder}
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
