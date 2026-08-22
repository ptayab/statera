const RELATIVE_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] =
  [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatFullDateTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatTimeAgo(iso: string): string {
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  let duration = (new Date(iso).getTime() - Date.now()) / MS_PER_SECOND;

  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), "year");
}

/** Terse age for dense rows: "now", "40m", "6h", "12d", "9w". */
export function formatCompactAge(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime();

  if (!Number.isFinite(elapsed) || elapsed < MS_PER_MINUTE) return "now";
  if (elapsed < MS_PER_HOUR) return `${Math.floor(elapsed / MS_PER_MINUTE)}m`;
  if (elapsed < MS_PER_DAY) return `${Math.floor(elapsed / MS_PER_HOUR)}h`;
  if (elapsed < 90 * MS_PER_DAY) return `${Math.floor(elapsed / MS_PER_DAY)}d`;
  if (elapsed < 365 * MS_PER_DAY)
    return `${Math.floor(elapsed / (7 * MS_PER_DAY))}w`;
  return `${Math.floor(elapsed / (365 * MS_PER_DAY))}y`;
}

/** Whole-day count for idle badges, floored so "9.6d idle" never reads as 10. */
export function formatDayCount(days: number): string {
  if (!Number.isFinite(days) || days < 1) return "<1d";
  return `${Math.floor(days)}d`;
}

export function formatDuration(ms: number | null): string {
  if (ms == null || !Number.isFinite(ms)) return "—";
  if (ms < MS_PER_HOUR) return `${Math.round(ms / MS_PER_MINUTE)}m`;
  if (ms < 48 * MS_PER_HOUR) return `${(ms / MS_PER_HOUR).toFixed(1)}h`;
  return `${(ms / MS_PER_DAY).toFixed(1)}d`;
}

export function initials(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((part) => part.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Short human-facing handle for a ticket, e.g. "A1B2C3". */
export function shortId(id: string): string {
  return id.replace(/-/g, "").slice(0, 6).toUpperCase();
}
