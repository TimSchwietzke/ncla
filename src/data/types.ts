/** Shared content types. Used by the app *and* by the scripts in `scripts/`. */

export type Difficulty = "Easy" | "Medium" | "Hard";

export type ContentStatus = "draft" | "complete";

export interface Complexity {
  time: string;
  space: string;
}

export interface VisualizerRef {
  /** Slug of a pattern visualizer, see `data/patterns.ts`. */
  name: string;
  /** Named input from that visualizer's `presets.ts` — the per-problem sketch. */
  preset?: string;
}

/** Frontmatter of a problem MDX file, plus where the file lives. */
export interface ProblemMeta {
  /** Number from the German source document, e.g. "1.3". */
  id: string;
  slug: string;
  title: string;
  leetcode: number;
  url: string;
  difficulty: Difficulty;
  premium: boolean;
  category: CategorySlug;
  patterns: string[];
  prerequisites: string[];
  targetComplexity: Complexity;
  visualizer?: VisualizerRef;
  status: ContentStatus;
  /** Path relative to `src/content/`, e.g. "problems/arrays-hashing/03-two-sum.mdx". */
  file: string;
}

export interface Category {
  slug: CategorySlug;
  /** Position in the source document, 1-18. */
  number: number;
  title: string;
  /** How many problems this category has in the NeetCode 150. */
  count: number;
  /** The five foundational categories are meant to be worked through first. */
  foundational: boolean;
  blurb: string;
}

export interface Pattern {
  slug: string;
  title: string;
  /** What in the problem statement gives this pattern away. */
  signal: string;
  categories: CategorySlug[];
  /** True once a step-by-step visualizer exists for this pattern. */
  hasVisualizer: boolean;
}

export type CategorySlug =
  | "arrays-hashing"
  | "two-pointers"
  | "sliding-window"
  | "stack"
  | "binary-search"
  | "linked-list"
  | "trees"
  | "tries"
  | "heap-priority-queue"
  | "backtracking"
  | "graphs"
  | "advanced-graphs"
  | "dynamic-programming-1d"
  | "dynamic-programming-2d"
  | "greedy"
  | "intervals"
  | "math-geometry"
  | "bit-manipulation";
