import type { ArrayStep } from "./core/types";
import { presets as hashingComplement } from "./hashing-complement/presets";
import { presets as slidingWindow } from "./sliding-window/presets";
import { presets as monotonicStack } from "./monotonic-stack/presets";
import { presets as twoPointer } from "./two-pointer/presets";
import { presets as binarySearch } from "./binary-search/presets";

/** A named input. `build` runs lazily, so opening a page costs nothing until it renders. */
export interface Preset {
  label: string;
  build: () => ArrayStep[];
}

export interface VisualizerEntry {
  presets: Record<string, Preset>;
  defaultPreset: string;
}

/**
 * Every pattern that has a working visualizer. A pattern missing from here still shows
 * the honest "not built yet" note — thirteen of the eighteen are still to come.
 */
export const VISUALIZERS: Record<string, VisualizerEntry> = {
  "hashing-complement": { presets: hashingComplement, defaultPreset: "two-sum" },
  "sliding-window": { presets: slidingWindow, defaultPreset: "longest-substring" },
  "monotonic-stack": { presets: monotonicStack, defaultPreset: "daily-temperatures" },
  "two-pointer": { presets: twoPointer, defaultPreset: "sorted-pair" },
  "binary-search": { presets: binarySearch, defaultPreset: "find-17" },
};

export function getVisualizer(slug: string): VisualizerEntry | undefined {
  return VISUALIZERS[slug];
}
