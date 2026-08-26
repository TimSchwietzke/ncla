/**
 * The six steps for attacking a problem you have never seen, from the source
 * document's "Wie du diese Datei benutzt" and its closing appendix.
 *
 * This is the only place the steps exist. The method page renders them in full,
 * and from M2 the problem page renders the same data compactly in the rail — two
 * copies would drift apart.
 */

export interface MethodStep {
  /** Two-digit label used in the UI, also the stable key. */
  id: string;
  title: string;
  /** The question you actually ask yourself. The usable part of the step. */
  prompt: string;
  /** Why this step comes before the next one. */
  why: string;
  /** The same step answered for Two Sum, for the worked example. */
  example: string;
}

export const METHOD_STEPS: readonly MethodStep[] = [
  {
    id: "01",
    title: "Read the examples",
    prompt: "What do these examples tell me that the prose does not?",
    why: "Examples carry the edge cases the statement glosses over — duplicates, ties, empty input. Reading them first is what stops you solving a slightly different problem.",
    example:
      "[3, 3] is in there on purpose: duplicate values are allowed, so any map from value to index has to survive a repeat. And the answer is indices, not values.",
  },
  {
    id: "02",
    title: "Read the constraints",
    prompt: "How large does n get, and what is quietly promised?",
    why: "Constraints are the only hard statement about what your solution may cost. They are also where words like sorted, distinct and non-negative hide.",
    example:
      "n up to 10^4, values up to ±10^9, and the array is not sorted. That last word rules out two pointers unless you sort first — and sorting destroys the indices you have to return.",
  },
  {
    id: "03",
    title: "Name the target complexity",
    prompt: "What am I allowed to spend?",
    why: "Derive it from n before writing anything. It turns a vague search for cleverness into a concrete goal you can check an idea against.",
    example:
      "n² at n = 10^4 is 10^8 operations — too slow. The cheat sheet puts 10^4 in O(n log n) territory, so aim for O(n) and settle for O(n log n).",
  },
  {
    id: "04",
    title: "Say the brute force out loud",
    prompt: "What is the obvious answer, and what does it cost?",
    why: "An explained brute force beats a silently written optimum. It also gives you a correct baseline to test the fast version against.",
    example:
      "Two nested loops testing every pair: O(n²) time, O(1) space. Correct, and worth saying before you improve it.",
  },
  {
    id: "05",
    title: "Find its bottleneck",
    prompt: "Which line is doing too much work?",
    why: "The optimisation always lives here. Nearly every pattern is a way of replacing one expensive inner operation — a scan becomes a lookup, a re-sort becomes a heap.",
    example:
      "The inner loop answers exactly one question: is target − nums[i] anywhere in the array? It answers it by scanning. That is a membership question, and scanning is the wrong tool for it.",
  },
  {
    id: "06",
    title: "Only now pick a pattern and write code",
    prompt: "Which pattern removes that bottleneck?",
    why: "With the bottleneck named, the pattern usually names itself. Writing code before this point is guessing with a keyboard.",
    example:
      "Membership in O(1) means a hash map. Walk once and ask for the complement before inserting the current value — checking before inserting is what stops an element pairing with itself.",
  },
] as const;

/** The practice loop around the six steps, from the source document. */
export interface LoopStage {
  value: string;
  label: string;
  detail: string;
}

export const PRACTICE_LOOP: readonly LoopStage[] = [
  {
    value: "20",
    label: "minutes alone",
    detail: "Set a timer and stay with it. Being stuck is where the pattern gets learned.",
  },
  {
    value: "1",
    label: "hint at a time",
    detail: "When stuck, unlock one step. Not the solution — the next nudge.",
  },
  {
    value: "0",
    label: "lines copied",
    detail: "Read the solution, close it, then write it yourself. Typing it over teaches nothing.",
  },
  {
    value: "3 + 14",
    label: "days later",
    detail: "Reconstruct the one-sentence insight from memory. If that works, the pattern stuck.",
  },
] as const;
