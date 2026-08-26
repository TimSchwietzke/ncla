import type { ArrayStep, CellTone } from "../core/types";

export interface TwoPointerInput {
  /** Must be sorted ascending — that is the precondition the pattern trades on. */
  values: number[];
  target: number;
}

/**
 * Converging two pointers on a sorted array: find the pair that sums to target.
 * Pure and deterministic — every frame is precomputed (CLAUDE.md §9).
 */
export function buildSteps({ values, target }: TwoPointerInput): ArrayStep[] {
  const steps: ArrayStep[] = [];
  if (values.length < 2) return steps;

  let left = 0;
  let right = values.length - 1;

  while (left < right) {
    const sum = (values[left] ?? 0) + (values[right] ?? 0);
    const tones = values.map((_, index) =>
      index < left || index > right ? "dim" : index === left || index === right ? "active" : "default",
    ) as CellTone[];

    if (sum === target) {
      steps.push({
        caption: `${values[left]} + ${values[right]} = ${target}. That is the pair.`,
        values,
        tones: values.map((_, index) =>
          index === left || index === right ? "found" : ("dim" as CellTone),
        ),
        markers: [
          { index: left, label: "l" },
          { index: right, label: "r" },
        ],
        readout: `answer [${left}, ${right}]`,
      });
      return steps;
    }

    steps.push({
      caption:
        sum < target
          ? `${values[left]} + ${values[right]} = ${sum}, below ${target} — only the left pointer can grow the sum.`
          : `${values[left]} + ${values[right]} = ${sum}, above ${target} — pull the right pointer in.`,
      values,
      tones,
      markers: [
        { index: left, label: "l" },
        { index: right, label: "r" },
      ],
      span: { start: left, end: right, label: `sum ${sum}` },
      readout: `target ${target}`,
    });

    if (sum < target) left += 1;
    else right -= 1;
  }

  steps.push({
    caption: `The pointers met without reaching ${target}. No such pair exists.`,
    values,
    tones: values.map(() => "dim" as CellTone),
    markers: [],
    readout: "no pair found",
  });

  return steps;
}
