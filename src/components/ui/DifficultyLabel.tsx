import type { Difficulty } from "../../data/types";

/**
 * Difficulty is encoded by emphasis rather than by a green/amber/red trio: an amber
 * "medium" would be indistinguishable from the ochre accent in both themes. Easy
 * recedes, medium reads as normal text, only hard takes a colour.
 */
const STYLES: Record<Difficulty, string> = {
  Easy: "text-ink-faint",
  Medium: "text-ink",
  Hard: "text-danger",
};

const SHORT: Record<Difficulty, string> = {
  Easy: "E",
  Medium: "M",
  Hard: "H",
};

export function DifficultyLabel({
  difficulty,
  short = false,
}: {
  difficulty: Difficulty;
  short?: boolean;
}) {
  return (
    <span
      title={short ? difficulty : undefined}
      className={`shrink-0 font-mono text-2xs uppercase ${STYLES[difficulty]}`}
    >
      {short ? SHORT[difficulty] : difficulty}
      {short ? <span className="sr-only"> {difficulty}</span> : null}
    </span>
  );
}
