import { describe, expect, it } from "vitest";
import { buildSteps } from "./steps";

const NUMS = [2, 7, 11, 15];

describe("hashing-complement buildSteps", () => {
  it("starts with an empty map and the first value under the pointer", () => {
    const steps = buildSteps({ values: NUMS, target: 9 });
    expect(steps[0]?.panel?.entries).toEqual([]);
    expect(steps[0]?.markers).toEqual([{ index: 0, label: "i" }]);
    expect(steps[0]?.values).toEqual(NUMS);
  });

  it("ends on the pair and names both indices", () => {
    const steps = buildSteps({ values: NUMS, target: 9 });
    const last = steps.at(-1);
    expect(last?.readout).toBe("answer [0, 1]");
    expect(last?.tones.filter((tone) => tone === "found")).toHaveLength(2);
  });

  it("grows the map by one entry per frame until the answer", () => {
    const steps = buildSteps({ values: [3, 2, 4], target: 6 });
    expect(steps.map((step) => step.panel?.entries.length)).toEqual([0, 1, 2]);
    expect(steps.at(-1)?.readout).toBe("answer [1, 2]");
  });

  it("lets duplicates pair with each other", () => {
    const steps = buildSteps({ values: [3, 3], target: 6 });
    expect(steps.at(-1)?.readout).toBe("answer [0, 1]");
  });

  it("reports honestly when no pair exists", () => {
    const steps = buildSteps({ values: [1, 2, 3], target: 99 });
    expect(steps.at(-1)?.readout).toBe("no pair found");
    expect(steps).toHaveLength(4);
  });

  it("carries a caption and a full array in every frame", () => {
    for (const step of buildSteps({ values: NUMS, target: 9 })) {
      expect(step.caption.length).toBeGreaterThan(0);
      expect(step.values).toHaveLength(NUMS.length);
      expect(step.tones).toHaveLength(NUMS.length);
    }
  });
});
