/**
 * Validates every problem MDX file: frontmatter shape, section order, and cross-file
 * consistency (no duplicate ids, no category over its NeetCode 150 quota).
 *
 * Exits with code 1 if anything is wrong. Run via `npm run content:validate`.
 */
import { CATEGORIES, TOTAL_PROBLEMS } from "../src/data/categories.ts";
import { getPattern } from "../src/data/patterns.ts";
import type { ProblemMeta } from "../src/data/types.ts";
import { collectProblems } from "./lib/collect.ts";
import { parseProblem } from "./lib/frontmatter.ts";

const errors: string[] = [];
const warnings: string[] = [];

function report(bucket: string[], file: string, messages: string[]): void {
  for (const message of messages) bucket.push(`${file}: ${message}`);
}

if (TOTAL_PROBLEMS !== 150) {
  errors.push(`src/data/categories.ts: counts add up to ${TOTAL_PROBLEMS}, expected 150`);
}

const sources = await collectProblems();
const metas: ProblemMeta[] = [];

for (const source of sources) {
  const result = parseProblem(source);
  report(errors, source.file, result.errors);
  report(warnings, source.file, result.warnings);
  if (result.meta) metas.push(result.meta);
}

const seenIds = new Map<string, string>();
const seenSlugs = new Map<string, string>();
const seenLeetcode = new Map<number, string>();

for (const meta of metas) {
  const duplicateId = seenIds.get(meta.id);
  if (duplicateId) errors.push(`${meta.file}: id "${meta.id}" already used by ${duplicateId}`);
  else seenIds.set(meta.id, meta.file);

  const duplicateSlug = seenSlugs.get(meta.slug);
  if (duplicateSlug) errors.push(`${meta.file}: slug "${meta.slug}" already used by ${duplicateSlug}`);
  else seenSlugs.set(meta.slug, meta.file);

  const duplicateLc = seenLeetcode.get(meta.leetcode);
  if (duplicateLc) errors.push(`${meta.file}: LC ${meta.leetcode} already used by ${duplicateLc}`);
  else seenLeetcode.set(meta.leetcode, meta.file);

  if (meta.visualizer && getPattern(meta.visualizer.name)?.hasVisualizer === false) {
    warnings.push(
      `${meta.file}: visualizer "${meta.visualizer.name}" is not implemented yet (milestone M3)`,
    );
  }
}

console.log("Category coverage");
for (const category of CATEGORIES) {
  const inCategory = metas.filter((m) => m.category === category.slug);
  const complete = inCategory.filter((m) => m.status === "complete").length;
  if (inCategory.length > category.count) {
    errors.push(
      `category "${category.slug}" has ${inCategory.length} problems, quota is ${category.count}`,
    );
  }
  const bar = progressBar(complete, category.count);
  console.log(
    `  ${category.number.toString().padStart(2)} ${category.title.padEnd(26)} ${bar} ` +
      `${complete}/${category.count}` +
      (inCategory.length > complete ? ` (+${inCategory.length - complete} draft)` : ""),
  );
}

const totalComplete = metas.filter((m) => m.status === "complete").length;
console.log(`\n  total: ${totalComplete}/${TOTAL_PROBLEMS} complete, ${metas.length} file(s) present\n`);

for (const warning of warnings) console.warn(`warning  ${warning}`);
for (const error of errors) console.error(`error    ${error}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s). Content is not valid.`);
  process.exit(1);
}
console.log(warnings.length > 0 ? `${warnings.length} warning(s), no errors.` : "No problems found.");

function progressBar(done: number, total: number, width = 12): string {
  const filled = total === 0 ? 0 : Math.round((done / total) * width);
  return `[${"#".repeat(filled)}${".".repeat(width - filled)}]`;
}
