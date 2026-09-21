const LOCALE = "en-US";

export type DateRange = {
  start: Date;
  end: Date;
};

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function startOfUtcWeek(date: Date): Date {
  const day = date.getUTCDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = startOfUtcDay(date);
  monday.setUTCDate(monday.getUTCDate() - daysFromMonday);
  return monday;
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDay(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function isInRange(iso: string, range: DateRange): boolean {
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return false;
  return time >= range.start.getTime() && time < range.end.getTime();
}

export function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function eachUtcWeekStart(range: DateRange): Date[] {
  const weeks: Date[] = [];
  let cursor = startOfUtcWeek(range.start);
  const endMs = range.end.getTime();
  while (cursor.getTime() < endMs) {
    weeks.push(new Date(cursor));
    cursor = addUtcDays(cursor, 7);
  }
  if (weeks.length === 0) {
    weeks.push(startOfUtcWeek(range.start));
  }
  return weeks;
}

export function formatVolumeWeekLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return formatDay(date);
}

/** Rolling window of the current week plus the previous `weeks - 1` weeks. */
export function recentWeeksRange(weeks: number, now: Date = new Date()): DateRange {
  const thisWeekStart = startOfUtcWeek(now);
  return {
    start: addUtcDays(thisWeekStart, -7 * Math.max(weeks - 1, 0)),
    end: now,
  };
}
