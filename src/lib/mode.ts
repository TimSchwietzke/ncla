import { useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "./storage";

/**
 * Learn mode hides everything you are supposed to work out yourself; reference mode
 * opens the page for revisiting. Global and remembered, because it describes how you
 * are working right now, not which problem you are on (CLAUDE.md §7).
 */
export type StudyMode = "learn" | "reference";

const MODE_KEY = "ncla.mode";

const listeners = new Set<() => void>();
let mode: StudyMode = readJSON<StudyMode>(MODE_KEY, "learn") === "reference" ? "reference" : "learn";

export function setMode(next: StudyMode): void {
  mode = next;
  writeJSON(MODE_KEY, next);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StudyMode {
  return mode;
}

export function useMode(): StudyMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => "learn" as const);
}
