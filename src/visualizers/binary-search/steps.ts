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

export interface AnswerSearchInput {
  /** Smallest and largest candidate answer, inclusive. */
  low: number;
  high: number;
  /**
   * Must be monotone: false for every candidate below the answer, true from it onwards.
   * That monotonicity is the entire licence to bisect, and it is what the strip shows.
   */
  feasible: (candidate: number) => boolean;
  /** What a candidate is called, e.g. "speed". */
  noun?: string;
  /** Optional detail per candidate, e.g. "9 hours". */
  detail?: (candidate: number) => string;
}

/**
 * Binary search on the *answer* rather than on an array: the row is the range of possible
 * answers, and each frame tests one of them. The half that cannot contain the smallest
 * feasible candidate is discarded exactly as in the classic search.
 *
 * The conceptual jump this makes visible is that there is no input array at all — the
 * thing being halved is a space of candidate answers (CLAUDE.md §9).
 */
export function buildAnswerSearch({
  low,
  high,
  feasible,
  noun = "candidate",
  detail,
}: AnswerSearchInput): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const candidates: number[] = [];
  for (let value = low; value <= high; value += 1) candidates.push(value);
  if (candidates.length === 0) return steps;

  const indexOf = (candidate: number) => candidate - low;
  let lo = low;
  let hi = high;
  let best: number | null = null;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const works = feasible(mid);
    if (works) best = mid;

    const extra = detail ? ` (${detail(mid)})` : "";
    steps.push({
      caption: works
        ? `A ${noun} of ${mid} works${extra}, so it is a candidate — and nothing above it can be smaller.`
        : `A ${noun} of ${mid} is not enough${extra}, so it and everything below it are out.`,
      values: candidates,
      tones: candidates.map((candidate) => {
        if (candidate === mid) return "active" as CellTone;
        if (candidate < lo || candidate > hi) return "dim" as CellTone;
        return "default" as CellTone;
      }),
      markers: [
        { index: indexOf(lo), label: "lo" },
        { index: indexOf(mid), label: "mid" },
        { index: indexOf(hi), label: "hi" },
      ],
      span: { start: indexOf(lo), end: indexOf(hi), label: `${hi - lo + 1} left` },
      readout: best === null ? "no answer yet" : `smallest so far ${best}`,
    });

    if (works) hi = mid - 1;
    else lo = mid + 1;
  }

  steps.push({
    caption:
      best === null
        ? `No ${noun} in the range works.`
        : `The range is empty, so ${best} is the smallest ${noun} that works.`,
    values: candidates,
    tones: candidates.map((candidate) =>
      best !== null && candidate === best ? "found" : ("dim" as CellTone),
    ),
    markers: best === null ? [] : [{ index: indexOf(best), label: "ans" }],
    readout: best === null ? "no answer" : `answer ${best}`,
  });

  return steps;
}
