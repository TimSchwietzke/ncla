import { describe, expect, it } from "vitest";
import { buildSteps } from "./steps";

const VALUES = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8];

describe("sliding-window buildSteps", () => {
  it("starts with the window at the left edge", () => {
    const steps = buildSteps({ values: VALUES, k: 4 });
    expect(steps[0]?.span).toEqual({ start: 0, end: 3, label: "sum 9" });
    expect(steps[0]?.values).toEqual(VALUES);
  });

  it("ends on the best window", () => {
    const steps = buildSteps({ values: VALUES, k: 4 });
    const last = steps.at(-1);
    // [5, 9, 2, 6] at index 4 is the first window summing to 22.
    expect(last?.span).toEqual({ start: 4, end: 7, label: "sum 22" });
    expect(last?.readout).toBe("answer 22");
    expect(last?.tones.filter((tone) => tone === "found")).toHaveLength(4);
  });

  it("produces one frame per window plus the answer", () => {
    const steps = buildSteps({ values: VALUES, k: 4 });
    expect(steps).toHaveLength(VALUES.length - 4 + 1 + 1);
  });

  it("every frame carries a caption and a full array", () => {
    for (const step of buildSteps({ values: VALUES, k: 4 })) {
      expect(step.caption.length).toBeGreaterThan(0);
      expect(step.values).toHaveLength(VALUES.length);
      expect(step.tones).toHaveLength(VALUES.length);
    }
  });

  it("does not claim a tying window falls short", () => {
    // [5,9,2,6] and [9,2,6,5] both sum to 22; the second must not read "short of 22".
    const captions = buildSteps({ values: VALUES, k: 4 }).map((step) => step.caption);
    expect(captions.some((caption) => caption.includes("matching the best"))).toBe(true);
    for (const caption of captions) {
      const match = /sums to (\d+), short of (\d+)/.exec(caption);
      if (match) expect(Number(match[1])).toBeLessThan(Number(match[2]));
    }
  });

  it("returns nothing for an impossible window", () => {
    expect(buildSteps({ values: [1, 2], k: 5 })).toEqual([]);
    expect(buildSteps({ values: [1, 2], k: 0 })).toEqual([]);
  });
});
