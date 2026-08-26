import type { Difficulty, ProblemMeta } from "../data/types";
import { PROBLEMS } from "./content";
import type { ProblemProgress, ProgressFile } from "./progress";
import { isDue, overdueDays, todayISO } from "./srs";

/**
 * What to work on today. Kept apart from the store so that the store stays about
 * storage and this stays about priority.
 */

export interface QueueEntry {
  meta: ProblemMeta;
  progress: ProblemProgress;
  overdue: number;
}

/** Fresh head, hardest first — the source leaves the direction open, so it is set here. */
const DIFFICULTY_ORDER: Record<Difficulty, number> = { Hard: 0, Medium: 1, Easy: 2 };

function entriesFor(file: ProgressFile): QueueEntry[] {
  const today = todayISO();
  return PROBLEMS.map((meta) => {
    const progress = file.problems[meta.slug];
    return {
      meta,
      progress: progress ?? { revealed: 0, checklist: [] },
      overdue: overdueDays(progress?.dueOn, today),
    };
  });
}

/** Scheduled and ready: most overdue first, ties broken by difficulty. */
export function dueList(file: ProgressFile): QueueEntry[] {
  const today = todayISO();
  return entriesFor(file)
    .filter((entry) => isDue(entry.progress.dueOn, today))
    .sort(
      (a, b) =>
        b.overdue - a.overdue ||
        DIFFICULTY_ORDER[a.meta.difficulty] - DIFFICULTY_ORDER[b.meta.difficulty],
    );
}

/** Never rated. PROBLEMS is already in source order, which puts the foundation first. */
export function newList(file: ProgressFile): QueueEntry[] {
  return entriesFor(file).filter((entry) => entry.progress.rating === undefined);
}

/** Rated 1 or 2 last time but not yet due again — worth a look once the top is clear. */
export function shakyList(file: ProgressFile): QueueEntry[] {
  const today = todayISO();
  return entriesFor(file)
    .filter(
      (entry) =>
        (entry.progress.rating === 1 || entry.progress.rating === 2) &&
        !isDue(entry.progress.dueOn, today),
    )
    .sort((a, b) => (a.progress.rating ?? 0) - (b.progress.rating ?? 0) || b.overdue - a.overdue);
}
