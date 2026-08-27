import { describe, expect, it } from "vitest";
import { buildLargestRectangle, buildSteps, buildWindowMaximum } from "./steps";

const TEMPERATURES = [73, 74, 75, 71, 69, 72, 76, 73];

describe("monotonic-stack buildSteps", () => {
  it("shows the first day already waiting on the stack", () => {
    const steps = buildSteps({ values: TEMPERATURES });
    expect(steps[0]?.panel?.entries.map((e) => e.key)).toEqual(["0"]);
    expect(steps[0]?.markers).toEqual([{ index: 0, label: "i" }]);
  });

  it("lets several days pile up while temperatures fall", () => {
    // 75, then 71 and 69 have nobody warmer yet, so three indices wait together.
    const steps = buildSteps({ values: TEMPERATURES });
    expect(steps[4]?.panel?.entries.map((e) => e.key)).toEqual(["4", "3", "2"]);
  });

  it("ends on the answer from the problem write-up", () => {
    const steps = buildSteps({ values: TEMPERATURES });
    expect(steps.at(-1)?.readout).toBe("answer [1, 1, 4, 2, 1, 1, 0, 0]");
  });

  it("produces one frame per day plus the closing frame", () => {
    expect(buildSteps({ values: TEMPERATURES })).toHaveLength(TEMPERATURES.length + 1);
  });

  /**
   * This is the O(n) claim the write-up makes out loud, so it is worth asserting rather
   * than trusting: an index may enter the stack once and leave once.
   */
  it("pushes every index exactly once and pops it at most once", () => {
    const steps = buildSteps({ values: TEMPERATURES });
    const seenOnStack = steps.map((step) => new Set(step.panel?.entries.map((e) => e.key) ?? []));

    for (const [index] of TEMPERATURES.entries()) {
      const key = String(index);
      const presence = seenOnStack.map((set) => set.has(key));
      // A single contiguous run of "on the stack" — never on, off, then on again.
      const runs = presence.reduce(
        (count, on, i) => count + (on && !presence[i - 1] ? 1 : 0),
        0,
      );
      expect(runs).toBeLessThanOrEqual(1);
    }
  });

  it("leaves the never-answered days on the stack at the end", () => {
    const steps = buildSteps({ values: [90, 80, 70] });
    expect(steps.at(-1)?.readout).toBe("answer [0, 0, 0]");
    expect(steps.at(-1)?.panel?.entries.map((e) => e.key)).toEqual(["2", "1", "0"]);
  });

  it("settles several waiting days with one warm day", () => {
    const steps = buildSteps({ values: [70, 69, 68, 99] });
    expect(steps.at(-2)?.caption).toContain("settles the days");
    expect(steps.at(-1)?.readout).toBe("answer [3, 2, 1, 0]");
  });
});

describe("buildWindowMaximum", () => {
  // LeetCode 239, example 1. The expected maxima are [3, 3, 5, 5, 6, 7].
  const NUMS = [1, 3, -1, -3, 5, 3, 6, 7];

  it("emits one frame per value", () => {
    expect(buildWindowMaximum({ values: NUMS, k: 3 })).toHaveLength(NUMS.length);
  });

  it("reports the window maxima the problem asks for", () => {
    const steps = buildWindowMaximum({ values: NUMS, k: 3 });
    expect(steps.at(-1)?.readout).toBe("maxima [3, 3, 5, 5, 6, 7]");
  });

  it("keeps the deque non-increasing and never longer than k", () => {
    // Non-increasing, not strictly decreasing: the builder pops on `<`, so equal values
    // stay side by side. That is correct — the later one simply outlives the earlier —
    // and asserting strict decrease here would only pass by accident on this input.
    for (const step of buildWindowMaximum({ values: NUMS, k: 3 })) {
      const held = step.panel?.entries.map((entry) => Number(entry.value)) ?? [];
      expect(held.length).toBeLessThanOrEqual(3);
      for (let i = 1; i < held.length; i += 1) {
        expect(held[i]!).toBeLessThanOrEqual(held[i - 1]!);
      }
    }
  });

  it("keeps equal values side by side and still reports the right maxima", () => {
    const steps = buildWindowMaximum({ values: [4, 4, 4, 1, 4], k: 2 });
    expect(steps.at(-1)?.readout).toBe("maxima [4, 4, 4, 4]");
  });

  it("marks the deque front as the answer for the current window", () => {
    const steps = buildWindowMaximum({ values: NUMS, k: 3 });
    for (const step of steps) {
      expect(step.panel?.entries[0]?.tone).toBe("found");
    }
  });

  it("has nothing to show when the window is wider than the input", () => {
    expect(buildWindowMaximum({ values: [1, 2], k: 5 })).toEqual([]);
  });
});

describe("buildLargestRectangle", () => {
  // LeetCode 84, example 1. The answer is 10: the 5 and the 6 at width 2.
  const HEIGHTS = [2, 1, 5, 6, 2, 3];

  it("emits one frame per bar plus a closing frame", () => {
    expect(buildLargestRectangle({ heights: HEIGHTS })).toHaveLength(HEIGHTS.length + 1);
  });

  it("finds the largest rectangle the problem asks for", () => {
    const steps = buildLargestRectangle({ heights: HEIGHTS });
    expect(steps.at(-1)?.readout).toBe("largest 10");
  });

  it("ends with the winning bars marked and nothing left on the stack", () => {
    const last = buildLargestRectangle({ heights: HEIGHTS }).at(-1);
    expect(last?.span).toEqual({ start: 2, end: 3, label: "10" });
    expect(last?.panel?.entries).toEqual([]);
  });

  it("keeps the stack heights increasing from bottom to top", () => {
    for (const step of buildLargestRectangle({ heights: HEIGHTS })) {
      // The panel is rendered top-first, so read it back to front.
      const held = (step.panel?.entries ?? []).map((entry) => Number(entry.value)).reverse();
      for (let i = 1; i < held.length; i += 1) {
        expect(held[i]!).toBeGreaterThan(held[i - 1]!);
      }
    }
  });

  it("handles a rising histogram, where nothing pops until the end", () => {
    expect(buildLargestRectangle({ heights: [2, 4] }).at(-1)?.readout).toBe("largest 4");
  });

  it("handles a flat histogram, where one rectangle spans everything", () => {
    expect(buildLargestRectangle({ heights: [3, 3, 3] }).at(-1)?.readout).toBe("largest 9");
  });
});
