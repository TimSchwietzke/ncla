import type { Preset } from "../registry";
import { buildAnswerSearch, buildSteps } from "./steps";

/** One named input per problem that uses this pattern — the sketch per problem. */
export const presets: Record<string, Preset> = {
  "find-17": {
    label: "Sorted array — locate 17",
    build: () => buildSteps({ values: [2, 3, 5, 8, 11, 15, 17, 20, 24, 29], target: 17 }),
  },
  "search-sorted-array": {
    label: "Binary Search — locate 9",
    build: () => buildSteps({ values: [-1, 0, 3, 5, 9, 12], target: 9 }),
  },
  "koko-bananas": {
    label: "Koko Eating Bananas — piles [3, 6, 7, 11], h = 8",
    // No input array is being searched here: the row is the range of possible speeds,
    // and the yes/no strip over it is what makes bisecting legal.
    build: () => {
      const piles = [3, 6, 7, 11];
      const hours = (speed: number) =>
        piles.reduce((total, pile) => total + Math.ceil(pile / speed), 0);
      return buildAnswerSearch({
        low: 1,
        high: Math.max(...piles),
        feasible: (speed) => hours(speed) <= 8,
        noun: "speed",
        detail: (speed) => `${hours(speed)} hours`,
      });
    },
  },
};
