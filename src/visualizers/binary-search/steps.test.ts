import { describe, expect, it } from "vitest";
import { buildSteps } from "./steps";

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
