import { describe, expect, it } from "vitest";
import { buildAnswerSearch, buildSteps } from "./steps";

const SORTED = [2, 3, 5, 8, 11, 15, 17, 20, 24, 29];

describe("binary-search buildSteps", () => {
  it("starts by looking at the middle of the whole array", () => {
    const steps = buildSteps({ values: SORTED, target: 17 });
    expect(steps[0]?.span).toEqual({ start: 0, end: 9, label: "10 left" });
    expect(steps[0]?.markers).toContainEqual({ index: 4, label: "mid" });
  });

  it("finds the target and reports its index", () => {
    const steps = buildSteps({ values: SORTED, target: 17 });
    const last = steps.at(-1);
    expect(last?.readout).toBe("answer index 6");
    expect(last?.tones.filter((tone) => tone === "found")).toHaveLength(1);
  });

  it("halves the range every step", () => {
    const steps = buildSteps({ values: SORTED, target: 17 });
    const spans = steps.map((step) => step.span).filter((span) => span !== undefined);
    for (let i = 1; i < spans.length; i += 1) {
      const previous = spans[i - 1];
      const current = spans[i];
      if (!previous || !current) continue;
      const previousSize = previous.end - previous.start + 1;
      const currentSize = current.end - current.start + 1;
      expect(currentSize).toBeLessThan(previousSize);
    }
    // log2(10) rounded up is 4 probes, plus the answer frame.
    expect(steps.length).toBeLessThanOrEqual(5);
  });

  it("reports honestly when the target is absent", () => {
    const steps = buildSteps({ values: SORTED, target: 12 });
    expect(steps.at(-1)?.readout).toBe("not found");
  });

  it("handles an empty array", () => {
    const steps = buildSteps({ values: [], target: 1 });
    expect(steps).toHaveLength(1);
    expect(steps[0]?.readout).toBe("not found");
  });
});

describe("buildAnswerSearch", () => {
  // Koko Eating Bananas, example 1: piles [3, 6, 7, 11] in 8 hours needs speed 4.
  const piles = [3, 6, 7, 11];
  const hours = (speed: number) =>
    piles.reduce((total, pile) => total + Math.ceil(pile / speed), 0);
  const koko = () =>
    buildAnswerSearch({ low: 1, high: 11, feasible: (speed) => hours(speed) <= 8, noun: "speed" });

  it("lands on the smallest feasible candidate", () => {
    expect(koko().at(-1)?.readout).toBe("answer 4");
  });

  it("never tests a candidate outside the range still in play", () => {
    for (const step of koko()) {
      const mid = step.markers.find((marker) => marker.label === "mid");
      const span = step.span;
      if (!mid || !span) continue;
      expect(mid.index).toBeGreaterThanOrEqual(span.start);
      expect(mid.index).toBeLessThanOrEqual(span.end);
    }
  });

  it("halves the range every frame, so it is logarithmic and not a scan", () => {
    const widths = koko()
      .map((step) => step.span?.end !== undefined && step.span?.start !== undefined
        ? step.span.end - step.span.start + 1
        : null)
      .filter((width): width is number => width !== null);
    expect(widths.length).toBeLessThan(11);
    for (let i = 1; i < widths.length; i += 1) {
      expect(widths[i]!).toBeLessThan(widths[i - 1]!);
    }
  });

  it("says so when nothing in the range works", () => {
    const steps = buildAnswerSearch({ low: 1, high: 4, feasible: () => false });
    expect(steps.at(-1)?.readout).toBe("no answer");
  });

  it("has nothing to show for an empty range", () => {
    expect(buildAnswerSearch({ low: 5, high: 1, feasible: () => true })).toEqual([]);
  });
});
