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
export function buildFixedWindow({ values, k }: SlidingWindowInput): ArrayStep[] {
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

export interface LongestDistinctInput {
  /** The string is split into characters — a cell holds a character just as well as a number. */
  text: string;
}

/**
 * Variable-size sliding window: the longest run without a repeated character.
 *
 * The same pattern, a different algorithm — the window grows on the right and the left
 * edge jumps past a repeat rather than sliding a fixed distance. A pattern module may
 * export several variants; the presets bind inputs to them.
 */
export function buildLongestDistinct({ text }: LongestDistinctInput): ArrayStep[] {
  const values = [...text];
  const steps: ArrayStep[] = [];
  const lastSeen = new Map<string, number>();

  let left = 0;
  let best = 0;
  let bestStart = 0;

  const panel = (highlight?: string) => ({
    label: "last index",
    emptyHint: "empty",
    entries: [...lastSeen.entries()].map(([character, index]) => ({
      key: character,
      value: String(index),
      tone: (character === highlight ? "found" : "default") as CellTone,
    })),
  });

  for (let right = 0; right < values.length; right += 1) {
    const character = values[right] ?? "";
    const previous = lastSeen.get(character);
    const jumped = previous !== undefined && previous >= left;

    if (jumped) left = (previous ?? 0) + 1;
    lastSeen.set(character, right);

    const length = right - left + 1;
    const isNewBest = length > best;
    if (isNewBest) {
      best = length;
      bestStart = left;
    }

    steps.push({
      caption: jumped
        ? `"${character}" is already in the window, so the left edge jumps past its earlier copy.`
        : `"${character}" is new to the window, which now spans ${length}.`,
      values,
      tones: values.map((_, index) =>
        index >= left && index <= right ? "active" : ("dim" as CellTone),
      ),
      markers: [
        { index: left, label: "l" },
        { index: right, label: "r" },
      ],
      span: { start: left, end: right, label: `${length}` },
      readout: `best ${best} from index ${bestStart}`,
      panel: panel(jumped ? character : undefined),
    });
  }

  steps.push({
    caption: `The longest run without a repeat is ${best}, starting at index ${bestStart}.`,
    values,
    tones: values.map((_, index) =>
      index >= bestStart && index < bestStart + best ? "found" : ("dim" as CellTone),
    ),
    markers: [],
    span: best > 0 ? { start: bestStart, end: bestStart + best - 1, label: `${best}` } : undefined,
    readout: `answer ${best}`,
    panel: panel(),
  });

  return steps;
}
