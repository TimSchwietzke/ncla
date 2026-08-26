import type { ArrayStep, CellTone } from "../core/types";

export interface SlidingWindowInput {
  values: number[];
  /** Window width. */
  k: number;
}

/**
 * Fixed-size sliding window: the largest sum of any k consecutive values.
 * Pure and deterministic — every frame is precomputed (CLAUDE.md §9).
 */
export function buildSteps({ values, k }: SlidingWindowInput): ArrayStep[] {
  if (k <= 0 || k > values.length) return [];

  const steps: ArrayStep[] = [];
  let best = -Infinity;
  let bestStart = 0;

  for (let start = 0; start + k <= values.length; start += 1) {
    const sum = values.slice(start, start + k).reduce((total, value) => total + value, 0);
    const isNewBest = sum > best;
    if (isNewBest) {
      best = sum;
      bestStart = start;
    }

    steps.push({
      caption: isNewBest
        ? `The window over indices ${start} to ${start + k - 1} sums to ${sum} — a new best.`
        : sum === best
          ? `The window over indices ${start} to ${start + k - 1} also sums to ${sum}, matching the best.`
          : `The window over indices ${start} to ${start + k - 1} sums to ${sum}, short of ${best}.`,
      values,
      tones: values.map((_, index) =>
        index >= start && index < start + k ? "active" : ("default" as CellTone),
      ),
      markers: [],
      span: { start, end: start + k - 1, label: `sum ${sum}` },
      readout: `best ${best} starting at index ${bestStart}`,
    });
  }

  steps.push({
    caption: `The best window of ${k} starts at index ${bestStart} and sums to ${best}.`,
    values,
    tones: values.map((_, index) =>
      index >= bestStart && index < bestStart + k ? "found" : ("dim" as CellTone),
    ),
    markers: [],
    span: { start: bestStart, end: bestStart + k - 1, label: `sum ${best}` },
    readout: `answer ${best}`,
  });

  return steps;
}
