import { createContext, useContext, type ReactNode } from "react";

/**
 * The ladder. Sections unlock in file order, one click at a time — which keeps itself
 * honest, because CLAUDE.md §6 fixes that order and the validator enforces it.
 *
 * <Statement> and the target complexity are not on the ladder: they are what the
 * interview hands you anyway (CLAUDE.md §7).
 */
export const STAGES = [
  "signals",
  "bruteForce",
  "insight",
  "approach",
  "solution",
  "wrapUp",
] as const;

export type Stage = (typeof STAGES)[number];

/** Shown on the reveal button, so the choice is made knowingly rather than blindly. */
export const STAGE_LABELS: Record<Stage, string> = {
  signals: "the signals",
  bruteForce: "the brute force",
  insight: "the insight",
  approach: "the approach",
  solution: "the solution",
  wrapUp: "pitfalls and follow-ups",
};

export const STAGE_SHORT: Record<Stage, string> = {
  signals: "signals",
  bruteForce: "brute force",
  insight: "insight",
  approach: "approach",
  solution: "solution",
  wrapUp: "wrap-up",
};

interface RevealValue {
  /** How many stages are open. STAGES.length means everything. */
  revealed: number;
  gated: boolean;
}

const RevealContext = createContext<RevealValue>({ revealed: STAGES.length, gated: false });

export function RevealProvider({
  revealed,
  gated,
  children,
}: {
  revealed: number;
  gated: boolean;
  children: ReactNode;
}) {
  return <RevealContext.Provider value={{ revealed, gated }}>{children}</RevealContext.Provider>;
}

export function useReveal(): RevealValue {
  return useContext(RevealContext);
}

export function stageIndex(stage: Stage): number {
  return STAGES.indexOf(stage);
}

export function isUnlocked(stage: Stage, revealed: number, gated: boolean): boolean {
  return !gated || stageIndex(stage) < revealed;
}

/**
 * Renders nothing at all while its stage is locked — the content never reaches the DOM,
 * so it cannot be read out of the page source (CLAUDE.md §7).
 */
export function Gate({ stage, children }: { stage: Stage; children: ReactNode }) {
  const { revealed, gated } = useReveal();
  if (!isUnlocked(stage, revealed, gated)) return null;
  return <>{children}</>;
}
