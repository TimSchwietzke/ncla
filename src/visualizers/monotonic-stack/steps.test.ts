import { describe, expect, it } from "vitest";
import { buildSteps } from "./steps";

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
