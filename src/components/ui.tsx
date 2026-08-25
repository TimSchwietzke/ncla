import type { ReactNode } from "react";
import type { Difficulty } from "../data/types";

export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {lead ? <p className="mt-2 max-w-2xl text-muted">{lead}</p> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-line bg-surface p-5 ${className}`}>{children}</div>
  );
}

const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  Easy: "text-easy",
  Medium: "text-medium",
  Hard: "text-hard",
};

/**
 * Difficulty is always spelled out, never colour alone — the colours have to stay
 * readable for colour-blind eyes and in both themes.
 */
export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`text-xs font-semibold uppercase tracking-wide ${DIFFICULTY_CLASS[difficulty]}`}>
      {difficulty}
    </span>
  );
}

/** Marks a page that is deliberately still a placeholder, and says which slice fills it. */
export function MilestoneNote({ milestone, children }: { milestone: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface-2 p-5 text-sm">
      <p className="mb-1 font-semibold">Not built yet — {milestone}</p>
      <p className="text-muted">{children}</p>
    </div>
  );
}
