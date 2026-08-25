export const ISSUE_SORTS = [
  { id: "priority", label: "Priority" },
  { id: "time", label: "Time" },
] as const;

export type IssueSortId = (typeof ISSUE_SORTS)[number]["id"];

export function parseIssueSort(value: string | undefined): IssueSortId {
  return value === "time" ? "time" : "priority";
}

export const ISSUE_ASSIGNMENTS = [
  { id: "me", label: "Assigned to me" },
  { id: "unassigned", label: "Unassigned" },
  { id: "all", label: "All" },
] as const;

export type IssueAssignmentId = (typeof ISSUE_ASSIGNMENTS)[number]["id"];

export function parseIssueAssignment(
  value: string | undefined,
): IssueAssignmentId {
  if (value === "all" || value === "unassigned") {
    return value;
  }
  return "me";
}

export const WORKER_TICKET_VIEWS = [
  { id: "open", label: "Open issues" },
  { id: "closed", label: "Closed issues" },
] as const;

export type WorkerTicketViewId = (typeof WORKER_TICKET_VIEWS)[number]["id"];

export function parseWorkerTicketView(
  value: string | undefined,
): WorkerTicketViewId {
  return value === "closed" ? "closed" : "open";
}

export const ISSUE_LIFECYCLES = [
  { id: "all", label: "All" },
  { id: "closed", label: "Closed" },
] as const;

export type IssueLifecycleId = (typeof ISSUE_LIFECYCLES)[number]["id"];

export function parseIssueLifecycle(
  value: string | undefined,
): IssueLifecycleId {
  return value === "closed" ? "closed" : "all";
}
