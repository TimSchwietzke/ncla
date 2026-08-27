import type { Category, CategorySlug } from "./types.ts";

/**
 * The 18 NeetCode 150 categories, in the order and with the counts of the live list —
 * verified against neetcode.io by `scripts/diff-source.ts`, not copied from the German
 * source document, which had Generate Parentheses under Stack and Tries before Heap.
 * Counts add up to 150 — `scripts/validate-content.ts` enforces that.
 */
export const CATEGORIES: readonly Category[] = [
  {
    slug: "arrays-hashing",
    number: 1,
    title: "Arrays & Hashing",
    count: 9,
    foundational: true,
    blurb: "Trade memory for time: a hash map turns a search into a lookup.",
  },
  {
    slug: "two-pointers",
    number: 2,
    title: "Two Pointers",
    count: 5,
    foundational: true,
    blurb: "Sorted order makes the sum move predictably, so one pass replaces two loops.",
  },
  {
    slug: "sliding-window",
    number: 3,
    title: "Sliding Window",
    count: 6,
    foundational: true,
    blurb: "Expand right while you can, shrink left while you must.",
  },
  {
    slug: "stack",
    number: 4,
    title: "Stack",
    count: 6,
    foundational: true,
    blurb: "Last in, first out — and the monotonic variant answers 'next greater element'.",
  },
  {
    slug: "binary-search",
    number: 5,
    title: "Binary Search",
    count: 7,
    foundational: true,
    blurb: "Any monotone yes/no question over a range can be halved.",
  },
  {
    slug: "linked-list",
    number: 6,
    title: "Linked List",
    count: 11,
    foundational: false,
    blurb: "Pointer surgery: dummy heads, fast/slow pointers, in-place reversal.",
  },
  {
    slug: "trees",
    number: 7,
    title: "Trees",
    count: 15,
    foundational: false,
    blurb: "Recursion with a return value — decide what each node reports upwards.",
  },
  {
    slug: "heap-priority-queue",
    number: 8,
    title: "Heap / Priority Queue",
    count: 7,
    foundational: false,
    blurb: "You rarely need full order — only the next smallest or largest element.",
  },
  {
    slug: "backtracking",
    number: 9,
    title: "Backtracking",
    count: 10,
    foundational: false,
    blurb: "Build a candidate, prune it early, undo the last choice, repeat.",
  },
  {
    slug: "tries",
    number: 10,
    title: "Tries",
    count: 3,
    foundational: false,
    blurb: "Prefix trees turn 'does any word start with…' into a walk down characters.",
  },
  {
    slug: "graphs",
    number: 11,
    title: "Graphs",
    count: 13,
    foundational: false,
    blurb: "Grids are graphs. BFS for shortest unweighted paths, DFS for reachability.",
  },
  {
    slug: "advanced-graphs",
    number: 12,
    title: "Advanced Graphs",
    count: 6,
    foundational: false,
    blurb: "Weighted edges: Dijkstra, Prim, and topological order under constraints.",
  },
  {
    slug: "dynamic-programming-1d",
    number: 13,
    title: "1-D Dynamic Programming",
    count: 12,
    foundational: false,
    blurb: "Define the state so that the answer for i only needs a few earlier answers.",
  },
  {
    slug: "dynamic-programming-2d",
    number: 14,
    title: "2-D Dynamic Programming",
    count: 11,
    foundational: false,
    blurb: "Two interacting sequences or a grid — fill the table, then read the corner.",
  },
  {
    slug: "greedy",
    number: 15,
    title: "Greedy",
    count: 8,
    foundational: false,
    blurb: "A local choice is only allowed if you can argue why it never loses.",
  },
  {
    slug: "intervals",
    number: 16,
    title: "Intervals",
    count: 6,
    foundational: false,
    blurb: "Sort by start time first; almost every interval problem opens with that line.",
  },
  {
    slug: "math-geometry",
    number: 17,
    title: "Math & Geometry",
    count: 8,
    foundational: false,
    blurb: "Matrix index arithmetic and number tricks — mostly about being careful.",
  },
  {
    slug: "bit-manipulation",
    number: 18,
    title: "Bit Manipulation",
    count: 7,
    foundational: false,
    blurb: "XOR cancels duplicates, and n & (n-1) clears the lowest set bit.",
  },
] as const;

export const CATEGORY_SLUGS: readonly CategorySlug[] = CATEGORIES.map((c) => c.slug);

export const TOTAL_PROBLEMS = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
