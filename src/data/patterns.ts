import type { Pattern } from "./types.ts";

/**
 * The 20 patterns. Eighteen of them are the 17 rows of the source document's pattern
 * index, with "DP bottom-up" split into 1-D and 2-D because the table fill looks too
 * different for one shared visualizer.
 *
 * The last two go beyond that index on purpose. The source names them as patterns in the
 * problem write-ups but forgot to list them, and no existing row is an honest home:
 * Product of Array Except Self is prefix/suffix accumulation (LeetCode tags it "Prefix
 * Sum" itself), and Encode and Decode Strings has no hash map, no pointer and no search.
 *
 * `hasVisualizer` flips to true as the visualizers land (milestone M3).
 * The slug is also the visualizer directory name under `src/visualizers/`.
 */
export const PATTERNS: readonly Pattern[] = [
  {
    slug: "hashing-complement",
    title: "Hashing / Complement",
    signal: "\"Does X exist?\", counting, grouping — anything that asks about membership.",
    categories: ["arrays-hashing"],
    hasVisualizer: true,
  },
  {
    slug: "two-pointer",
    title: "Two Pointers",
    signal: "A sorted array, pairs that must sum to a target, or a palindrome check.",
    categories: ["two-pointers", "arrays-hashing"],
    hasVisualizer: true,
  },
  {
    slug: "sliding-window",
    title: "Sliding Window",
    signal: "\"Longest / shortest substring or subarray such that <condition>\".",
    categories: ["sliding-window"],
    hasVisualizer: true,
  },
  {
    slug: "monotonic-stack",
    title: "Monotonic Stack / Deque",
    signal: "\"Next greater / smaller element\", or a maximum over a moving window.",
    categories: ["stack", "sliding-window"],
    hasVisualizer: true,
  },
  {
    slug: "binary-search",
    title: "Binary Search (also on the answer)",
    signal: "A monotone yes/no question over a numeric range, or a sorted input.",
    categories: ["binary-search"],
    hasVisualizer: true,
  },
  {
    slug: "fast-slow-pointer",
    title: "Fast / Slow Pointer",
    signal: "Cycle detection, or the middle of a list without knowing its length.",
    categories: ["linked-list"],
    hasVisualizer: false,
  },
  {
    slug: "tree-dfs",
    title: "DFS Recursion with a Return Value",
    signal: "A tree plus \"compute something for every node\" — decide what a node reports upwards.",
    categories: ["trees", "tries"],
    hasVisualizer: false,
  },
  {
    slug: "bfs-level-order",
    title: "BFS / Level Order",
    signal: "Shortest path on unweighted edges, or \"everything spreads at the same time\".",
    categories: ["trees", "graphs"],
    hasVisualizer: false,
  },
  {
    slug: "backtracking",
    title: "Backtracking",
    signal: "\"All combinations / permutations / subsets\", or building a valid configuration.",
    categories: ["backtracking", "stack"],
    hasVisualizer: false,
  },
  {
    slug: "union-find",
    title: "Union-Find",
    signal: "Connected components, or detecting a cycle in an undirected graph.",
    categories: ["graphs", "advanced-graphs"],
    hasVisualizer: false,
  },
  {
    slug: "topological-sort",
    title: "Topological Sort",
    signal: "Dependencies, prerequisites, or a cycle check on a directed graph.",
    categories: ["graphs", "advanced-graphs"],
    hasVisualizer: false,
  },
  {
    slug: "dijkstra-prim",
    title: "Dijkstra / Prim (Heap)",
    signal: "Weighted edges and a minimum cost or minimum spanning structure.",
    categories: ["advanced-graphs"],
    hasVisualizer: false,
  },
  {
    slug: "heap-topk",
    title: "Top-K / Running Median (Heap)",
    signal: "\"k largest / k closest\", or a median that has to stay current as data streams in.",
    categories: ["heap-priority-queue"],
    hasVisualizer: false,
  },
  {
    slug: "dp-1d",
    title: "1-D Dynamic Programming",
    signal: "Overlapping subproblems along one axis: \"number of ways\", \"min / max up to i\".",
    categories: ["dynamic-programming-1d"],
    hasVisualizer: false,
  },
  {
    slug: "dp-2d",
    title: "2-D Dynamic Programming",
    signal: "Two interacting sequences, or a grid where each cell depends on its neighbours.",
    categories: ["dynamic-programming-2d"],
    hasVisualizer: false,
  },
  {
    slug: "greedy-scan",
    title: "Greedy + Proof",
    signal: "A local choice that looks obviously right — and \"would a single pass be enough?\".",
    categories: ["greedy"],
    hasVisualizer: false,
  },
  {
    slug: "interval-sweep",
    title: "Interval Sweep",
    signal: "Intervals of any kind. The first line of the solution sorts them by start time.",
    categories: ["intervals"],
    hasVisualizer: false,
  },
  {
    slug: "bit-tricks",
    title: "XOR / Bit Tricks",
    signal: "Numbers, duplicates, or an explicit ban on extra memory.",
    categories: ["bit-manipulation", "math-geometry"],
    hasVisualizer: false,
  },
  {
    slug: "prefix-suffix",
    title: "Prefix / Suffix Accumulation",
    signal: "The answer at i needs everything left of i and everything right of it — two passes, no nesting.",
    categories: ["arrays-hashing"],
    hasVisualizer: false,
  },
  {
    slug: "length-prefix",
    title: "Self-Delimiting Encoding",
    signal: "Any separator can also appear inside the data, so the format must say how much to read.",
    categories: ["arrays-hashing"],
    hasVisualizer: false,
  },
] as const;

export const PATTERN_SLUGS: readonly string[] = PATTERNS.map((p) => p.slug);

export function getPattern(slug: string): Pattern | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}
