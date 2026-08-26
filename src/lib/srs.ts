/**
 * Spaced repetition. Pure functions only — no storage, no clock beyond what is passed
 * in, so the whole schedule is testable without waiting for tomorrow (CLAUDE.md §10).
 */

export type Rating = 1 | 2 | 3 | 4 | 5;

/** What a rating means, and what it buys you the first time you earn it. */
export const BASE_INTERVAL_DAYS: Record<Rating, number> = { 1: 1, 2: 2, 3: 3, 4: 7, 5: 14 };

export const RATING_MEANING: Record<Rating, string> = {
  1: "no idea",
  2: "needed the insight",
  3: "with hints",
  4: "alone, slow",
  5: "alone, clean",
};

/**
 * From the second success in a row the interval multiplies.
 *
 * The source document names a flat 2.2. This deviates on purpose: how sure you were
 * should decide how far a problem may drift, so a hint-assisted pass does not run away
 * as fast as a clean one. 2.2 stays the middle case. Adjust here once real data exists.
 */
export const GROWTH_FACTOR: Record<3 | 4 | 5, number> = { 3: 1.6, 4: 2.2, 5: 2.8 };

export const MAX_INTERVAL_DAYS = 90;

/** The usual line between "still learning" and "this one sticks". */
export const MATURE_AFTER_DAYS = 21;

export interface ScheduleInput {
  streak?: number;
  intervalDays?: number;
}

export interface ScheduleResult {
  streak: number;
  intervalDays: number;
  /** ISO date, YYYY-MM-DD. */
  dueOn: string;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Local calendar date, not UTC — "today" has to mean the user's today. */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO(now: Date = new Date()): string {
  return toISODate(now);
}

export function addDays(iso: string, days: number): string {
  const [year = 0, month = 1, day = 1] = iso.split("-").map(Number);
  return toISODate(new Date(year, month - 1, day + days));
}

/** Day count via UTC midnights, so daylight saving cannot shift a result by one. */
function utcMidnight(iso: string): number {
  const [year = 0, month = 1, day = 1] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Positive when late, 0 when due today, negative when still in the future. */
export function overdueDays(dueOn: string | undefined, today: string = todayISO()): number {
  if (!dueOn) return 0;
  return Math.round((utcMidnight(today) - utcMidnight(dueOn)) / 86_400_000);
}

export function isDue(dueOn: string | undefined, today: string = todayISO()): boolean {
  if (!dueOn) return false;
  return overdueDays(dueOn, today) >= 0;
}

export function maturity(intervalDays: number | undefined): "new" | "learning" | "mature" {
  if (intervalDays === undefined || intervalDays <= 0) return "new";
  return intervalDays >= MATURE_AFTER_DAYS ? "mature" : "learning";
}

/**
 * A rating of 1 or 2 sends the problem back to the start of the ladder; anything from 3
 * up continues the streak, and from the second consecutive success the interval grows.
 */
export function schedule(
  previous: ScheduleInput | undefined,
  rating: Rating,
  today: Date = new Date(),
): ScheduleResult {
  const from = todayISO(today);

  if (rating === 1 || rating === 2) {
    const intervalDays = BASE_INTERVAL_DAYS[rating];
    return { streak: 0, intervalDays, dueOn: addDays(from, intervalDays) };
  }

  const streak = (previous?.streak ?? 0) + 1;
  const previousInterval = previous?.intervalDays ?? 0;

  const intervalDays =
    streak === 1 || previousInterval <= 0
      ? BASE_INTERVAL_DAYS[rating]
      : Math.min(Math.round(previousInterval * GROWTH_FACTOR[rating]), MAX_INTERVAL_DAYS);

  return { streak, intervalDays, dueOn: addDays(from, intervalDays) };
}

/** What the next interval would be — shown on the rating buttons before you commit. */
export function previewInterval(previous: ScheduleInput | undefined, rating: Rating): number {
  return schedule(previous, rating).intervalDays;
}
