import { describe, expect, it } from "vitest";
import { buildSteps } from "./steps";

const SORTED = [2, 3, 5, 8, 11, 15, 17, 20];

describe("two-pointer buildSteps", () => {
  it("starts with the pointers at both ends", () => {
    const steps = buildSteps({ values: SORTED, target: 23 });
    expect(steps[0]?.markers).toEqual([
      { index: 0, label: "l" },
      { index: 7, label: "r" },
    ]);
  });

  it("ends on the pair that hits the target", () => {
    const steps = buildSteps({ values: SORTED, target: 23 });
    const last = steps.at(-1);
    // 3 + 20 = 23
    expect(last?.readout).toBe("answer [1, 7]");
    expect(last?.tones.filter((tone) => tone === "found")).toHaveLength(2);
  });

  it("moves exactly one pointer per frame", () => {
    const steps = buildSteps({ values: SORTED, target: 23 });
    for (let i = 1; i < steps.length - 1; i += 1) {
      const previous = steps[i - 1]?.markers ?? [];
      const current = steps[i]?.markers ?? [];
      const moved = current.filter(
        (marker, index) => marker.index !== previous[index]?.index,
      );
      expect(moved).toHaveLength(1);
    }
  });

  it("reports honestly when no pair exists", () => {
    // 2 + 3 = 5 is the smallest reachable sum, so 4 is out of range.
    const steps = buildSteps({ values: SORTED, target: 4 });
    expect(steps.at(-1)?.readout).toBe("no pair found");
    expect(steps.at(-1)?.caption).toContain("No such pair");
  });

  it("needs at least two values", () => {
    expect(buildSteps({ values: [1], target: 2 })).toEqual([]);
  });
});
