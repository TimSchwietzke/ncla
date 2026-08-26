import type { ArrayStep, CellTone } from "../core/types";

export interface BinarySearchInput {
  /** Must be sorted ascending. */
  values: number[];
  target: number;
}

/**
 * Classic binary search: halve the remaining range until the target is found.
 * Pure and deterministic — every frame is precomputed (CLAUDE.md §9).
 */
export function buildSteps({ values, target }: BinarySearchInput): ArrayStep[] {
  const steps: ArrayStep[] = [];
  let low = 0;
  let high = values.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = values[mid] ?? 0;

    const inRange = (index: number) => index >= low && index <= high;
    const tones = values.map((_, index) =>
      !inRange(index) ? "dim" : index === mid ? "active" : "default",
    ) as CellTone[];

    if (value === target) {
      steps.push({
        caption: `The middle value is ${value} — the target, at index ${mid}.`,
        values,
        tones: values.map((_, index) => (index === mid ? "found" : ("dim" as CellTone))),
        markers: [{ index: mid, label: "mid" }],
        readout: `answer index ${mid}`,
      });
      return steps;
    }

    steps.push({
      caption:
        value < target
          ? `The middle value ${value} is below ${target}, so the whole left half can go.`
          : `The middle value ${value} is above ${target}, so the whole right half can go.`,
      values,
      tones,
      markers: [
        { index: low, label: "lo" },
        { index: mid, label: "mid" },
        { index: high, label: "hi" },
      ],
      span: { start: low, end: high, label: `${high - low + 1} left` },
      readout: `looking for ${target}`,
    });

    if (value < target) low = mid + 1;
    else high = mid - 1;
  }

  steps.push({
    caption: `The range is empty — ${target} is not in the array.`,
    values,
    tones: values.map(() => "dim" as CellTone),
    markers: [],
    readout: "not found",
  });

  return steps;
}
