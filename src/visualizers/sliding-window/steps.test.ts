import { describe, expect, it } from "vitest";
import { buildFixedWindow, buildLongestDistinct } from "./steps";

const VALUES = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8];

describe("sliding-window buildFixedWindow", () => {
  it("starts with the window at the left edge", () => {
    const steps = buildFixedWindow({ values: VALUES, k: 4 });
    expect(steps[0]?.span).toEqual({ start: 0, end: 3, label: "sum 9" });
    expect(steps[0]?.values).toEqual(VALUES);
  });

  it("ends on the best window", () => {
    const steps = buildFixedWindow({ values: VALUES, k: 4 });
    const last = steps.at(-1);
    // [5, 9, 2, 6] at index 4 is the first window summing to 22.
    expect(last?.span).toEqual({ start: 4, end: 7, label: "sum 22" });
    expect(last?.readout).toBe("answer 22");
    expect(last?.tones.filter((tone) => tone === "found")).toHaveLength(4);
  });

  it("produces one frame per window plus the answer", () => {
    const steps = buildFixedWindow({ values: VALUES, k: 4 });
    expect(steps).toHaveLength(VALUES.length - 4 + 1 + 1);
  });

  it("every frame carries a caption and a full array", () => {
    for (const step of buildFixedWindow({ values: VALUES, k: 4 })) {
      expect(step.caption.length).toBeGreaterThan(0);
      expect(step.values).toHaveLength(VALUES.length);
      expect(step.tones).toHaveLength(VALUES.length);
    }
  });

  it("does not claim a tying window falls short", () => {
    // [5,9,2,6] and [9,2,6,5] both sum to 22; the second must not read "short of 22".
    const captions = buildFixedWindow({ values: VALUES, k: 4 }).map((step) => step.caption);
    expect(captions.some((caption) => caption.includes("matching the best"))).toBe(true);
    for (const caption of captions) {
      const match = /sums to (\d+), short of (\d+)/.exec(caption);
      if (match) expect(Number(match[1])).toBeLessThan(Number(match[2]));
    }
  });

  it("returns nothing for an impossible window", () => {
    expect(buildFixedWindow({ values: [1, 2], k: 5 })).toEqual([]);
    expect(buildFixedWindow({ values: [1, 2], k: 0 })).toEqual([]);
  });
});

describe("sliding-window buildLongestDistinct", () => {
  it("shows one frame per character plus the answer", () => {
    const steps = buildLongestDistinct({ text: "abcabcbb" });
    expect(steps).toHaveLength("abcabcbb".length + 1);
  });

  it("finds the longest run without a repeat", () => {
    expect(buildLongestDistinct({ text: "abcabcbb" }).at(-1)?.readout).toBe("answer 3");
    expect(buildLongestDistinct({ text: "bbbbb" }).at(-1)?.readout).toBe("answer 1");
    expect(buildLongestDistinct({ text: "pwwkew" }).at(-1)?.readout).toBe("answer 3");
  });

  it("never lets the left edge move backwards — the max() pitfall", () => {
    // "abba" is the case that breaks a naive jump: the second a reports index 0.
    const steps = buildLongestDistinct({ text: "abba" });
    const lefts = steps
      .map((step) => step.markers.find((marker) => marker.label === "l")?.index)
      .filter((index): index is number => index !== undefined);
    for (let i = 1; i < lefts.length; i += 1) {
      expect(lefts[i]!).toBeGreaterThanOrEqual(lefts[i - 1]!);
    }
    expect(steps.at(-1)?.readout).toBe("answer 2");
  });

  it("puts characters in the cells", () => {
    expect(buildLongestDistinct({ text: "abc" })[0]?.values).toEqual(["a", "b", "c"]);
  });

  it("handles an empty string", () => {
    const steps = buildLongestDistinct({ text: "" });
    expect(steps).toHaveLength(1);
    expect(steps[0]?.readout).toBe("answer 0");
  });
});
