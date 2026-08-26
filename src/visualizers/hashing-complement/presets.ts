import type { Preset } from "../registry";
import { buildSteps } from "./steps";

/** One named input per problem that uses this pattern — the sketch per problem. */
export const presets: Record<string, Preset> = {
  "two-sum": {
    label: "Two Sum",
    // Example 2 from the write-up rather than the first: the map actually fills up
    // before the answer appears, which is the whole mechanism.
    build: () => buildSteps({ values: [3, 2, 4], target: 6 }),
  },
};
