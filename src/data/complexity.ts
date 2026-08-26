/**
 * The reference tables from the source document's "Komplexitäts-Spickzettel" and its
 * closing appendix, as data rather than markup — the cheat sheet renders them, and
 * from M2 the constraint thresholds also drive the target-complexity hint.
 */

export interface StructureRow {
  name: string;
  access: string;
  search: string;
  insert: string;
  remove: string;
}

export const STRUCTURES: readonly StructureRow[] = [
  { name: "Array", access: "O(1)", search: "O(n)", insert: "O(n)", remove: "O(n)" },
  {
    name: "Dynamic array (push)",
    access: "O(1)",
    search: "O(n)",
    insert: "O(1) amortised",
    remove: "O(n)",
  },
  { name: "Hash map / set", access: "—", search: "O(1) avg", insert: "O(1) avg", remove: "O(1) avg" },
  {
    name: "Linked list",
    access: "O(n)",
    search: "O(n)",
    insert: "O(1) at a reference",
    remove: "O(1) at a reference",
  },
  {
    name: "Balanced BST",
    access: "O(log n)",
    search: "O(log n)",
    insert: "O(log n)",
    remove: "O(log n)",
  },
  { name: "Heap", access: "O(1) min/max", search: "O(n)", insert: "O(log n)", remove: "O(log n)" },
  { name: "Trie", access: "—", search: "O(L)", insert: "O(L)", remove: "O(L)" },
  {
    name: "Union-Find (compressed)",
    access: "—",
    search: "~O(α(n)) ≈ O(1)",
    insert: "—",
    remove: "—",
  },
];

export interface Threshold {
  /** Upper bound on n. Used to pick a row for a concrete input size. */
  maxN: number;
  label: string;
  complexity: string;
}

/** Rule of thumb: read n from the constraints, read the affordable complexity off here. */
export const THRESHOLDS: readonly Threshold[] = [
  { maxN: 10, label: "n ≤ 10", complexity: "O(n!) · O(2ⁿ)" },
  { maxN: 20, label: "n ≤ 20", complexity: "O(2ⁿ)" },
  { maxN: 500, label: "n ≤ 500", complexity: "O(n³)" },
  { maxN: 5_000, label: "n ≤ 5·10³", complexity: "O(n²)" },
  { maxN: 1_000_000, label: "n ≤ 10⁶", complexity: "O(n log n)" },
  { maxN: 100_000_000, label: "n ≤ 10⁸", complexity: "O(n)" },
];

/** The most expensive complexity that still fits, or undefined when n is beyond the table. */
export function affordableComplexity(n: number): Threshold | undefined {
  return THRESHOLDS.find((threshold) => n <= threshold.maxN);
}

export interface PythonTrap {
  code: string;
  what: string;
}

/**
 * Only the traps that actually bite in an interview. The broader language tutoring
 * section is deliberately post-MVP (CLAUDE.md §13).
 */
export const PYTHON_TRAPS: readonly PythonTrap[] = [
  {
    code: "int(a / b)  vs  a // b",
    what: "// floors, so -7 // 2 is -4. Problems that want truncation toward zero need int(a / b).",
  },
  {
    code: "tuple(counts)",
    what: "Lists are unhashable. A composite dictionary key has to be a tuple.",
  },
  {
    code: "heapq",
    what: "Min-heap only. Push -value, or a (-priority, item) tuple, to get a max-heap.",
  },
  {
    code: "\"\".join(parts)",
    what: "Strings are immutable — building one with += in a loop is O(n²). Collect, then join.",
  },
  {
    code: "sys.setrecursionlimit",
    what: "The default is 1000. A degenerate tree or a 10^4 chain overflows before your logic fails.",
  },
];

/** The three questions from the appendix, for the last ten minutes before an interview. */
export const LAST_TEN_MINUTES: readonly string[] = [
  "Pattern triggers — run down the list below and match the wording of the problem.",
  "Read the constraints and derive the target complexity before writing a single line.",
  "Communicate: brute force → its complexity → the bottleneck → the optimisation. An explained O(n²) beats a silent O(n).",
];
