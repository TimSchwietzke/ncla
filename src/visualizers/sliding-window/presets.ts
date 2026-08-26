import type { Preset } from "../registry";
import { buildFixedWindow, buildLongestDistinct } from "./steps";

export const presets: Record<string, Preset> = {
  "longest-substring": {
    label: "Longest Substring Without Repeating Characters",
    build: () => buildLongestDistinct({ text: "abcabcbb" }),
  },
  "max-sum-window": {
    label: "Fixed window — largest sum of k",
    build: () => buildFixedWindow({ values: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3], k: 4 }),
  },
};
