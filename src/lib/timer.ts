import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * The twenty-minute attempt timer.
 *
 * It lives in a module store rather than component state so that it survives
 * navigation: step 3 of the method sends you to the cheat sheet, and a timer that dies
 * when you follow your own method is broken. It does not survive a reload — an attempt
 * interrupted that hard is over anyway.
 */

export const TARGET_SECONDS = 20 * 60;

interface TimerState {
  problemId: string | null;
  /** Epoch millis of the current run, null while paused. */
  startedAt: number | null;
  /** Milliseconds banked from earlier runs on this problem. */
  bankedMs: number;
}

const IDLE: TimerState = { problemId: null, startedAt: null, bankedMs: 0 };

const listeners = new Set<() => void>();
let state: TimerState = IDLE;

function commit(next: TimerState): void {
  state = next;
  for (const listener of listeners) listener();
}

export function elapsedSeconds(now = Date.now()): number {
  const running = state.startedAt === null ? 0 : now - state.startedAt;
  return Math.floor((state.bankedMs + running) / 1000);
}

export function isRunning(): boolean {
  return state.startedAt !== null;
}

export function startTimer(problemId: string): void {
  // Opening a different problem starts a fresh attempt.
  const banked = state.problemId === problemId ? state.bankedMs : 0;
  commit({ problemId, startedAt: Date.now(), bankedMs: banked });
}

export function pauseTimer(): void {
  if (state.startedAt === null) return;
  commit({
    ...state,
    startedAt: null,
    bankedMs: state.bankedMs + (Date.now() - state.startedAt),
  });
}

export function resetTimer(problemId: string): void {
  commit({ problemId, startedAt: null, bankedMs: 0 });
}

/** Test seam: lets the 20-minute threshold be checked without waiting 20 minutes. */
export function seedTimer(problemId: string, seconds: number, running = false): void {
  commit({
    problemId,
    startedAt: running ? Date.now() : null,
    bankedMs: seconds * 1000,
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): TimerState {
  return state;
}

/** Re-renders once a second while running, so the display ticks without a global interval. */
export function useTimer(problemId: string): {
  seconds: number;
  running: boolean;
  active: boolean;
} {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => IDLE);
  const [, tick] = useState(0);

  useEffect(() => {
    if (snapshot.startedAt === null) return;
    const id = window.setInterval(() => {
      tick((value) => value + 1);
    }, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, [snapshot.startedAt]);

  const active = snapshot.problemId === problemId;
  return {
    seconds: active ? elapsedSeconds() : 0,
    running: active && snapshot.startedAt !== null,
    active,
  };
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
