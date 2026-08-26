import type { Preset } from "../registry";
import { buildSteps } from "./steps";

export const presets: Record<string, Preset> = {
  "find-17": {
    label: "Sorted array — locate 17",
    build: () => buildSteps({ values: [2, 3, 5, 8, 11, 15, 17, 20, 24, 29], target: 17 }),
  },
};
