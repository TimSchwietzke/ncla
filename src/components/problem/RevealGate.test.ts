import { describe, expect, it } from "vitest";
import { STAGES, isUnlocked } from "./RevealGate";

/**
 * `isUnlocked` decides what the learner is allowed to see, so both callers depend on it:
 * the meta rail on a problem page and the pattern chips on a category listing. A pattern
 * name leaking early is the one spoiler CLAUDE.md §7 calls out by name.
 */
describe("isUnlocked", () => {
  it("opens everything in reference mode, whatever the progress says", () => {
    for (const stage of STAGES) {
      expect(isUnlocked(stage, 0, false)).toBe(true);
    }
  });

  it("keeps every stage shut in learn mode before anything is revealed", () => {
    for (const stage of STAGES) {
      expect(isUnlocked(stage, 0, true)).toBe(false);
    }
  });

  it("opens exactly the stages that have been revealed, in order", () => {
    STAGES.forEach((_, revealed) => {
      STAGES.forEach((stage, index) => {
        expect(isUnlocked(stage, revealed, true)).toBe(index < revealed);
      });
    });
  });

  it("ties the pattern chips to the signals, which is the first rung", () => {
    expect(isUnlocked("signals", 0, true)).toBe(false);
    expect(isUnlocked("signals", 1, true)).toBe(true);
  });
});
