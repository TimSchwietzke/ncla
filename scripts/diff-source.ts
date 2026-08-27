/**
 * Holds `NeetCode_150_Lerngrundlage.md` against the verified roster in
 * `reference/neetcode150.json` and prints every disagreement: wrong LeetCode number,
 * wrong difficulty, wrong premium flag, wrong category, wrong position, and problems
 * that only one of the two knows about.
 *
 * The source was written as a starting point, not as truth. This is what decides which
 * of the two is right — and after the corrections it must come back clean.
 *
 * Run with `npm run reference:diff`. Exits 1 while differences remain.
 */
import { readFile } from "node:fs/promises";

interface ReferenceProblem {
  id: string;
  pattern: string;
  categoryNumber: number;
  position: number;
  title: string;
  leetcodeTitle: string;
  leetcode: number;
  difficulty: string;
  leetcodeDifficulty: string;
  premium: boolean;
  leetcodeSlug: string;
  constraints: string[];
  examples: unknown[];
  referenceSolution: string | null;
}

interface SourceProblem {
  id: string;
  categoryNumber: number;
  position: number;
  categoryTitle: string;
  title: string;
  leetcode: number;
  difficulty: string;
  premium: boolean;
  line: number;
}

const CATEGORY_RE = /^## (\d{1,2})\. (.+?) \((\d+)\)\s*$/;
const PROBLEM_RE = /^### (\d{1,2}\.\d{1,2}) (.+?) — LC (\d+) · (Easy|Medium|Hard)(.*)$/;

export function parseSource(markdown: string): {
  problems: SourceProblem[];
  categories: { number: number; title: string; count: number }[];
} {
  const problems: SourceProblem[] = [];
  const categories: { number: number; title: string; count: number }[] = [];
  let current: { number: number; title: string } | null = null;
  let position = 0;

  markdown.split(/\r?\n/).forEach((text, index) => {
    const category = CATEGORY_RE.exec(text);
    if (category) {
      current = { number: Number(category[1]), title: category[2]! };
      categories.push({ ...current, count: Number(category[3]) });
      position = 0;
      return;
    }
    const problem = PROBLEM_RE.exec(text);
    if (!problem || !current) return;
    position += 1;
    problems.push({
      id: problem[1]!,
      categoryNumber: current.number,
      position,
      categoryTitle: current.title,
      title: problem[2]!.trim(),
      leetcode: Number(problem[3]),
      difficulty: problem[4]!,
      premium: /premium/i.test(problem[5] ?? ""),
      line: index + 1,
    });
  });

  return { problems, categories };
}

/** Titles differ in punctuation and spelling across the two sources; compare the shape. */
function normalise(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(|\)|,|'|’|\./g, "")
    .replace(/\band\b/g, "&")
    .replace(/[^a-z0-9&]+/g, " ")
    .trim();
}

async function main(): Promise<void> {
  const reference = JSON.parse(await readFile("reference/neetcode150.json", "utf8")) as {
    categories: string[];
    problems: ReferenceProblem[];
  };
  const { problems: source, categories: sourceCategories } = parseSource(
    await readFile("NeetCode_150_Lerngrundlage.md", "utf8"),
  );

  const issues: string[] = [];
  const note = (message: string) => issues.push(message);

  console.log(`source: ${source.length} problems · reference: ${reference.problems.length}\n`);

  // 1. Category order and counts.
  console.log("Categories");
  reference.categories.forEach((title, i) => {
    const number = i + 1;
    const count = reference.problems.filter((p) => p.categoryNumber === number).length;
    const inSource = sourceCategories.find((c) => c.number === number);
    const same = inSource && normalise(inSource.title) === normalise(title) && inSource.count === count;
    console.log(
      `  ${String(number).padStart(2)} ${title.padEnd(26)} ${String(count).padStart(2)}` +
        (same ? "" : `   <- source: ${inSource ? `${inSource.title} (${inSource.count})` : "missing"}`),
    );
    if (!same) {
      note(
        `category ${number}: reference "${title}" (${count}), source ` +
          (inSource ? `"${inSource.title}" (${inSource.count})` : "missing"),
      );
    }
  });

  // 2. Roster membership, by LeetCode number — the only stable identifier across both.
  const byNumber = new Map(reference.problems.map((p) => [p.leetcode, p]));
  const sourceByNumber = new Map(source.map((p) => [p.leetcode, p]));

  for (const problem of reference.problems) {
    if (!sourceByNumber.has(problem.leetcode)) {
      note(`missing from source: ${problem.id} ${problem.title} (LC ${problem.leetcode})`);
    }
  }
  for (const problem of source) {
    if (!byNumber.has(problem.leetcode)) {
      note(`not in the NeetCode 150: source ${problem.id} ${problem.title} (LC ${problem.leetcode}), line ${problem.line}`);
    }
  }

  // 3. Per-problem fields.
  console.log("\nPer-problem differences");
  let clean = 0;
  for (const problem of reference.problems) {
    const mine = sourceByNumber.get(problem.leetcode);
    if (!mine) continue;
    const diffs: string[] = [];
    if (mine.id !== problem.id) diffs.push(`id ${mine.id} -> ${problem.id}`);
    if (mine.title !== problem.leetcodeTitle) {
      diffs.push(`title "${mine.title}" -> "${problem.leetcodeTitle}"`);
    }
    if (mine.difficulty !== problem.leetcodeDifficulty) {
      diffs.push(`difficulty ${mine.difficulty} -> ${problem.leetcodeDifficulty}`);
    }
    if (mine.premium !== problem.premium) {
      diffs.push(`premium ${mine.premium} -> ${problem.premium}`);
    }
    if (diffs.length === 0) {
      clean += 1;
      continue;
    }
    console.log(`  line ${String(mine.line).padStart(4)}  ${problem.title}`);
    for (const diff of diffs) console.log(`        ${diff}`);
    note(`${problem.id} ${problem.title}: ${diffs.join("; ")}`);
  }
  console.log(`  ${clean}/${reference.problems.length} problems agree on id, title, difficulty and premium`);

  // 4. Cross-check: does NeetCode's own difficulty label match LeetCode's?
  const mismatched = reference.problems.filter((p) => p.difficulty !== p.leetcodeDifficulty);
  if (mismatched.length > 0) {
    console.log("\nNeetCode vs LeetCode difficulty");
    for (const p of mismatched) {
      console.log(`  ${p.id.padEnd(6)} ${p.title.padEnd(46)} neetcode ${p.difficulty} · leetcode ${p.leetcodeDifficulty}`);
    }
  }

  // 5. Completeness of the fetched data — a gap here breaks content authoring later.
  const noConstraints = reference.problems.filter((p) => p.constraints.length === 0);
  const noExamples = reference.problems.filter((p) => p.examples.length === 0);
  const noSolution = reference.problems.filter((p) => !p.referenceSolution);
  console.log("\nReference data coverage");
  console.log(`  constraints  ${reference.problems.length - noConstraints.length}/${reference.problems.length}`);
  console.log(`  examples     ${reference.problems.length - noExamples.length}/${reference.problems.length}`);
  console.log(`  solutions    ${reference.problems.length - noSolution.length}/${reference.problems.length}`);
  for (const [label, list] of [
    ["no constraints", noConstraints],
    ["no examples", noExamples],
    ["no solution", noSolution],
  ] as const) {
    for (const p of list) console.log(`    ${label}: ${p.id} ${p.title} (${p.leetcodeSlug})`);
  }

  console.log(
    issues.length === 0
      ? "\nThe source agrees with the verified roster."
      : `\n${issues.length} difference(s) between the source and the verified roster.`,
  );
  if (issues.length > 0) process.exit(1);
}

await main();
