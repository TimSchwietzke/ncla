import type { ArrayStep, CellTone } from "../core/types";

export interface MonotonicStackInput {
  /** Daily temperatures, or any sequence asking for the next greater element. */
  values: number[];
}

/**
 * Next greater element with a monotonic stack: indices wait on the stack until a larger
 * value arrives and settles several of them at once. The stack is in the side panel,
 * because "what is still waiting" is the thing being taught.
 *
 * Pure and deterministic — every frame is precomputed (CLAUDE.md §9).
 */
export function buildSteps({ values }: MonotonicStackInput): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const answer = new Array<number>(values.length).fill(0);
  const stack: number[] = [];

  const panel = () => ({
    label: "stack",
    emptyHint: "empty",
    entries: stack
      .map((index) => ({
        key: `${index}`,
        value: String(values[index] ?? 0),
        tone: "active" as CellTone,
      }))
      .reverse(),
  });

  const tones = (current: number) =>
    values.map((_, i) => {
      if (i === current) return "active" as CellTone;
      if (stack.includes(i)) return "default" as CellTone;
      if (i < current) return "found" as CellTone;
      return "dim" as CellTone;
    });

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index] ?? 0;
    const settled: number[] = [];

    while (stack.length > 0 && value > (values[stack.at(-1) ?? 0] ?? 0)) {
      const waiting = stack.pop() as number;
      answer[waiting] = index - waiting;
      settled.push(waiting);
    }

    // Push first, then emit: a frame shows the state you end the step in, so the day
    // that just started waiting is visible on the stack rather than one frame late.
    stack.push(index);

    steps.push({
      caption:
        settled.length === 0
          ? `${value} is not warmer than what is waiting, so index ${index} joins the queue.`
          : `${value} settles ${settled.length === 1 ? "the day" : "the days"} at ${settled.join(", ")} — all at once.`,
      values,
      tones: tones(index),
      markers: [{ index, label: "i" }],
      readout: `answer so far [${answer.join(", ")}]`,
      panel: panel(),
    });
  }

  steps.push({
    caption:
      stack.length === 0
        ? "Every day found a warmer one."
        : `Indices ${stack.join(", ")} never got a warmer day, so they keep their 0.`,
    values,
    tones: values.map((_, i) => (stack.includes(i) ? "dim" : ("found" as CellTone))),
    markers: [],
    readout: `answer [${answer.join(", ")}]`,
    panel: panel(),
  });

  return steps;
}
