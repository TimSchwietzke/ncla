import type { Preset } from "../registry";
import { buildSteps } from "./steps";

export const presets: Record<string, Preset> = {
  "daily-temperatures": {
    label: "Daily Temperatures",
    build: () => buildSteps({ values: [73, 74, 75, 71, 69, 72, 76, 73] }),
  },
};
