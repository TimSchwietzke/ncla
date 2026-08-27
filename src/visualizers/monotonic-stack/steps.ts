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

export interface WindowMaximumInput {
  values: number[];
  /** Window width. Every frame reports the maximum of the last k values. */
  k: number;
}

/**
 * Maximum of a sliding window with a monotonic deque — the same discipline as above,
 * with a second reason to discard: values also fall out of the back of the window.
 *
 * The deque holds indices in decreasing value order, so its front is always the answer
 * for the current window. It rides in the side panel because the whole difficulty of the
 * problem is what is being kept and why (CLAUDE.md §9).
 */
export function buildWindowMaximum({ values, k }: WindowMaximumInput): ArrayStep[] {
  const steps: ArrayStep[] = [];
  if (k < 1 || values.length < k) return steps;

  const deque: number[] = []; // indices, values decreasing from front to back
  const output: number[] = [];

  const panel = () => ({
    label: "deque",
    emptyHint: "empty",
    entries: deque.map((index, position) => ({
      key: `${index}`,
      value: String(values[index] ?? 0),
      tone: (position === 0 ? "found" : "active") as CellTone,
    })),
  });

  for (let right = 0; right < values.length; right += 1) {
    const value = values[right] ?? 0;
    const dropped: number[] = [];

    while (deque.length > 0 && (values[deque.at(-1) ?? 0] ?? 0) < value) {
      dropped.push(deque.pop() as number);
    }
    deque.push(right);

    const left = right - k + 1;
    let expired: number | null = null;
    if (deque[0] !== undefined && deque[0] < left) {
      expired = deque.shift() as number;
    }

    const complete = right >= k - 1;
    if (complete) output.push(values[deque[0] ?? 0] ?? 0);

    const reasons: string[] = [];
    if (dropped.length > 0) {
      reasons.push(
        `${value} is larger, so ${dropped.length === 1 ? "index" : "indices"} ${dropped.join(", ")} can never win again`,
      );
    }
    if (expired !== null) reasons.push(`index ${expired} has fallen out of the window`);

    steps.push({
      caption: complete
        ? `${reasons.length > 0 ? reasons.join(", and ") + ". " : ""}The window ${left}..${right} has maximum ${values[deque[0] ?? 0]}.`
        : `${reasons.length > 0 ? reasons.join(", and ") + ". " : ""}The window is not full yet — ${k - right - 1} more to go.`,
      values,
      tones: values.map((_, i) => {
        if (i > right) return "dim" as CellTone;
        if (i < Math.max(0, left)) return "dim" as CellTone;
        if (i === deque[0]) return "found" as CellTone;
        return "active" as CellTone;
      }),
      markers: [{ index: right, label: "r" }],
      ...(complete ? { span: { start: left, end: right, label: `window ${k}` } } : {}),
      readout: `maxima [${output.join(", ")}]`,
      panel: panel(),
    });
  }

  return steps;
}

export interface HistogramInput {
  /** Bar heights, all of width 1. */
  heights: number[];
}

/**
 * Largest rectangle in a histogram. The same monotonic stack again, with a third thing to
 * teach: when a bar is popped, the rectangle it anchors reaches back to where the popped
 * entry *started*, not to where it sat. That `start` is what the panel carries.
 */
export function buildLargestRectangle({ heights }: HistogramInput): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const stack: { start: number; height: number }[] = [];
  let best = 0;
  let bestSpan: { start: number; end: number } | null = null;

  const panel = () => ({
    label: "stack",
    emptyHint: "empty",
    entries: stack
      .map((entry) => ({
        key: `from ${entry.start}`,
        value: String(entry.height),
        tone: "active" as CellTone,
      }))
      .reverse(),
  });

  const tones = (current: number) =>
    heights.map((_, i) => {
      if (bestSpan && i >= bestSpan.start && i <= bestSpan.end) return "found" as CellTone;
      if (i > current) return "dim" as CellTone;
      return "active" as CellTone;
    });

  for (let i = 0; i < heights.length; i += 1) {
    const height = heights[i] ?? 0;
    let start = i;
    const measured: { width: number; height: number; start: number; area: number }[] = [];

    while (stack.length > 0 && (stack.at(-1)?.height ?? 0) > height) {
      const popped = stack.pop() as { start: number; height: number };
      const area = popped.height * (i - popped.start);
      if (area > best) {
        best = area;
        bestSpan = { start: popped.start, end: i - 1 };
      }
      measured.push({ width: i - popped.start, height: popped.height, start: popped.start, area });
      start = popped.start;
    }

    stack.push({ start, height });

    // A single bar can close several taller ones at once. Report all of them — naming only
    // the last would hide the rectangles the frame actually measured.
    const closed = measured
      .map((m) => `${m.height} x ${m.width} = ${m.area} from ${m.start}`)
      .join(", then ");
    const widest = measured.reduce<typeof measured[number] | null>(
      (biggest, m) => (biggest === null || m.area > biggest.area ? m : biggest),
      null,
    );

    steps.push({
      caption:
        measured.length === 0
          ? `${height} does not undercut the stack, so it joins it — reaching back to index ${start}.`
          : `${height} is lower, so ${measured.length === 1 ? "one bar closes" : `${measured.length} bars close`} here: ${closed}.`,
      values: heights,
      tones: tones(i),
      markers: [{ index: i, label: "i" }],
      ...(widest ? { span: { start: widest.start, end: i - 1, label: `${widest.area}` } } : {}),
      readout: `best ${best}`,
      panel: panel(),
    });
  }

  // Whatever survives to the end reaches all the way to the right edge.
  for (const entry of stack) {
    const area = entry.height * (heights.length - entry.start);
    if (area > best) {
      best = area;
      bestSpan = { start: entry.start, end: heights.length - 1 };
    }
  }

  steps.push({
    caption:
      bestSpan === null
        ? "No bar has any height, so the largest rectangle is empty."
        : `Everything still on the stack runs to the right edge. The largest rectangle is ${best}, spanning ${bestSpan.start}..${bestSpan.end}.`,
    values: heights,
    tones: heights.map((_, i) =>
      bestSpan && i >= bestSpan.start && i <= bestSpan.end ? "found" : ("dim" as CellTone),
    ),
    markers: [],
    ...(bestSpan ? { span: { start: bestSpan.start, end: bestSpan.end, label: `${best}` } } : {}),
    readout: `largest ${best}`,
    panel: { label: "stack", emptyHint: "drained", entries: [] },
  });

  return steps;
}
