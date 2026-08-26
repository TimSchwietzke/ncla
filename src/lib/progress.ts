import { useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "./storage";

/**
 * Per-problem progress, persisted locally (CLAUDE.md §9).
 *
 * The schema is declared in full even though M2 only fills the first half — writing the
 * spaced-repetition fields now costs nothing, and it avoids migrating data that will be
 * real by the time M4 lands.
 */

export const PROGRESS_KEY = "ncla.progress.v1";
export const SCHEMA_VERSION = 1;

export interface ProblemProgress {
  /** How many ladder stages have been unlocked. */
  revealed: number;
  /** Ids of the ticked method steps. */
  checklist: string[];
  /** Seconds spent on the last timed attempt. */
  lastAttemptSeconds?: number;

  // Filled from M4 onwards.
  note?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  streak?: number;
  intervalDays?: number;
  /** ISO date, YYYY-MM-DD. */
  dueOn?: string;
}

export interface ProgressFile {
  version: number;
  problems: Record<string, ProblemProgress>;
}

export const EMPTY_PROBLEM: ProblemProgress = { revealed: 0, checklist: [] };

const EMPTY_FILE: ProgressFile = { version: SCHEMA_VERSION, problems: {} };

/**
 * Turns whatever is in storage into a usable file. Anything unrecognisable — a future
 * version, a hand-edited mess — falls back to empty rather than throwing, because
 * losing progress must never mean losing the app.
 */
export function parseProgressFile(raw: unknown): ProgressFile {
  if (typeof raw !== "object" || raw === null) return EMPTY_FILE;
  const candidate = raw as Partial<ProgressFile>;
  if (candidate.version !== SCHEMA_VERSION) return EMPTY_FILE;
  if (typeof candidate.problems !== "object" || candidate.problems === null) return EMPTY_FILE;

  const problems: Record<string, ProblemProgress> = {};
  for (const [id, value] of Object.entries(candidate.problems)) {
    if (typeof value !== "object" || value === null) continue;
    const entry = value as Partial<ProblemProgress>;
    problems[id] = {
      ...entry,
      revealed: typeof entry.revealed === "number" ? entry.revealed : 0,
      checklist: Array.isArray(entry.checklist)
        ? entry.checklist.filter((step): step is string => typeof step === "string")
        : [],
    };
  }
  return { version: SCHEMA_VERSION, problems };
}

/** Unlocks one more stage, never past the last one. */
export function nextRevealed(current: number, total: number): number {
  return Math.min(current + 1, total);
}

const listeners = new Set<() => void>();
let state: ProgressFile = parseProgressFile(readJSON<unknown>(PROGRESS_KEY, null));

function commit(next: ProgressFile): void {
  state = next;
  writeJSON(PROGRESS_KEY, next);
  for (const listener of listeners) listener();
}

function update(id: string, patch: Partial<ProblemProgress>): void {
  const current = state.problems[id] ?? EMPTY_PROBLEM;
  commit({
    version: SCHEMA_VERSION,
    problems: { ...state.problems, [id]: { ...current, ...patch } },
  });
}

export function revealNext(id: string, total: number): void {
  const current = state.problems[id] ?? EMPTY_PROBLEM;
  update(id, { revealed: nextRevealed(current.revealed, total) });
}

export function setChecklist(id: string, checklist: string[]): void {
  update(id, { checklist });
}

export function setLastAttemptSeconds(id: string, seconds: number): void {
  update(id, { lastAttemptSeconds: seconds });
}

export function resetProblem(id: string): void {
  const { [id]: _removed, ...rest } = state.problems;
  commit({ version: SCHEMA_VERSION, problems: rest });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ProgressFile {
  return state;
}

export function useProgress(): ProgressFile {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_FILE);
}

export function useProblemProgress(id: string): ProblemProgress {
  return useProgress().problems[id] ?? EMPTY_PROBLEM;
}
