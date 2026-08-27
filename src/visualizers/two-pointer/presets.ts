import type { Preset } from "../registry";
import { buildSteps } from "./steps";

/** One named input per problem that uses this pattern — the sketch per problem. */
export const presets: Record<string, Preset> = {
  "sorted-pair": {
    label: "Sorted array — find a pair summing to 23",
    // The pattern page's default: this input moves both pointers, so the full rule
    // ("too small -> left, too big -> right") is visible in one run.
    build: () => buildSteps({ values: [2, 3, 5, 8, 11, 15, 17, 20, 24, 29], target: 23 }),
  },
  "two-sum-ii": {
    label: "Two Sum II — numbers = [2, 7, 11, 15], target 9",
    // Example 1 from the problem, and 1-indexed like its answer: returning [0, 1] here
    // would teach exactly the mistake the pitfalls warn about.
    build: () => buildSteps({ values: [2, 7, 11, 15], target: 9, indexBase: 1 }),
  },
};
