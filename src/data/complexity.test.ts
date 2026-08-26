import { describe, expect, it } from "vitest";
import { PATTERNS } from "./patterns";
import { METHOD_STEPS } from "./method";
import { STRUCTURES, THRESHOLDS, affordableComplexity } from "./complexity";

describe("constraint thresholds", () => {
  it("are ordered so the scale reads left to right", () => {
    for (let i = 1; i < THRESHOLDS.length; i += 1) {
      expect(THRESHOLDS[i]!.maxN).toBeGreaterThan(THRESHOLDS[i - 1]!.maxN);
    }
  });

  it("picks the most expensive complexity that still fits", () => {
    expect(affordableComplexity(8)?.complexity).toBe("O(n!) · O(2ⁿ)");
    expect(affordableComplexity(500)?.complexity).toBe("O(n³)");
    // The Two Sum case from the worked example: 10^4 rules out O(n²).
    expect(affordableComplexity(10_000)?.complexity).toBe("O(n log n)");
    expect(affordableComplexity(10 ** 9)).toBeUndefined();
  });
});

describe("cheat sheet tables", () => {
  it("gives every structure a value in every column", () => {
    for (const row of STRUCTURES) {
      for (const cell of [row.access, row.search, row.insert, row.remove]) {
        expect(cell.trim()).not.toBe("");
      }
    }
  });

  it("has a trigger for every pattern, so the generated table has no gaps", () => {
    expect(PATTERNS).toHaveLength(18);
    for (const pattern of PATTERNS) {
      expect(pattern.signal.trim().length).toBeGreaterThan(10);
    }
  });
});

describe("method steps", () => {
  it("are six, numbered in order", () => {
    expect(METHOD_STEPS.map((step) => step.id)).toEqual(["01", "02", "03", "04", "05", "06"]);
  });

  it("carry a question and a worked answer for each step", () => {
    for (const step of METHOD_STEPS) {
      expect(step.prompt).toMatch(/\?$/);
      expect(step.why.length).toBeGreaterThan(40);
      expect(step.example.length).toBeGreaterThan(40);
    }
  });
});
