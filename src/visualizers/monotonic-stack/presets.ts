import type { Preset } from "../registry";
import { buildLargestRectangle, buildSteps, buildWindowMaximum } from "./steps";

/** One named input per problem that uses this pattern — the sketch per problem. */
export const presets: Record<string, Preset> = {
  "daily-temperatures": {
    label: "Daily Temperatures",
    build: () => buildSteps({ values: [73, 74, 75, 71, 69, 72, 76, 73] }),
  },
  "largest-rectangle": {
    label: "Largest Rectangle in Histogram",
    // The problem's own example. The 5 and the 6 pop against the 2, which is the frame
    // that shows a rectangle reaching back past where its bar actually stands.
    build: () => buildLargestRectangle({ heights: [2, 1, 5, 6, 2, 3] }),
  },
  "sliding-window-maximum": {
    label: "Sliding Window Maximum — k = 3",
    // The problem's own first example: it drops values off the back and expires one off
    // the front, so both reasons for discarding show up in a single run.
    build: () => buildWindowMaximum({ values: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }),
  },
};
