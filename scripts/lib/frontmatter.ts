import { CATEGORY_SLUGS } from "../../src/data/categories.ts";
import { PATTERN_SLUGS } from "../../src/data/patterns.ts";
import type { ContentStatus, Difficulty, ProblemMeta } from "../../src/data/types.ts";

/** Sections every problem page must contain, in this order. See CLAUDE.md §6. */
export const REQUIRED_SECTIONS = [
  "Statement",
  "Signals",
  "BruteForce",
  "Insight",
  "Approach",
  "Solution",
  "Pitfalls",
  "FollowUps",
] as const;

/**
 * Blocks a finished problem must use inside <Statement>. Examples and constraints are
 * what you read first and under time pressure — they have to be structured data, not a
 * paragraph. Enforced here so 150 files cannot drift apart one at a time.
 */
export const REQUIRED_BLOCKS = ["<Example", "<Constraints"] as const;

const DIFFICULTIES: readonly string[] = ["Easy", "Medium", "Hard"];
const STATUSES: readonly string[] = ["draft", "complete"];

const FILENAME_RE = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx$/;
const ID_RE = /^\d{1,2}\.\d{1,2}$/;

export interface ProblemSource {
  /** Path relative to `src/content/`, always with forward slashes. */
  file: string;
  data: Record<string, unknown>;
  body: string;
}

export interface ParseResult {
  /** Null when the frontmatter is unusable. Warnings alone still produce a meta. */
  meta: ProblemMeta | null;
  errors: string[];
  warnings: string[];
}

export function parseProblem(source: ProblemSource): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { data, file, body } = source;

  const parts = file.split("/");
  const filename = parts.at(-1) ?? "";
  const dir = parts.at(-2) ?? "";
  const nameMatch = FILENAME_RE.exec(filename);
  if (!nameMatch) {
    errors.push(`filename must look like "07-some-problem.mdx", got "${filename}"`);
  }

  const id = requireString(data, "id", errors);
  if (id !== null && !ID_RE.test(id)) {
    errors.push(`id must be "<category>.<index>" like "1.3", got "${id}"`);
  }

  const slug = requireString(data, "slug", errors);
  if (slug !== null && nameMatch && nameMatch[2] !== slug) {
    errors.push(`slug "${slug}" does not match filename slug "${nameMatch[2]}"`);
  }

  const title = requireString(data, "title", errors);
  const leetcode = requireNumber(data, "leetcode", errors);
  if (leetcode !== null && (!Number.isInteger(leetcode) || leetcode <= 0)) {
    errors.push(`leetcode must be a positive integer, got ${leetcode}`);
  }

  const url = requireString(data, "url", errors);
  if (url !== null && !url.startsWith("https://leetcode.com/problems/")) {
    errors.push(`url must point at leetcode.com/problems/…, got "${url}"`);
  }

  const difficulty = requireEnum(data, "difficulty", DIFFICULTIES, errors) as Difficulty | null;
  const premium = requireBoolean(data, "premium", errors);
  const status = (requireEnum(data, "status", STATUSES, errors) ?? "draft") as ContentStatus;

  const category = requireEnum(data, "category", CATEGORY_SLUGS, errors);
  if (category !== null && dir !== category) {
    errors.push(`category "${category}" does not match directory "${dir}"`);
  }

  const patterns = requireStringArray(data, "patterns", errors);
  if (patterns !== null) {
    if (patterns.length === 0) {
      errors.push("patterns must list at least one pattern");
    }
    for (const p of patterns) {
      if (!PATTERN_SLUGS.includes(p)) {
        errors.push(`unknown pattern "${p}" (see src/data/patterns.ts)`);
      }
    }
  }

  const prerequisites = requireStringArray(data, "prerequisites", errors) ?? [];

  const complexity = data["targetComplexity"];
  let targetComplexity: ProblemMeta["targetComplexity"] | null = null;
  if (!isRecord(complexity)) {
    errors.push('targetComplexity must be an object like { time: "O(n)", space: "O(n)" }');
  } else {
    const time = requireString(complexity, "time", errors, "targetComplexity.");
    const space = requireString(complexity, "space", errors, "targetComplexity.");
    if (time !== null && space !== null) targetComplexity = { time, space };
  }

  let visualizer: ProblemMeta["visualizer"];
  const viz = data["visualizer"];
  if (viz !== undefined) {
    if (!isRecord(viz)) {
      errors.push('visualizer must be an object like { name: two-pointer, preset: three-sum }');
    } else {
      const name = requireString(viz, "name", errors, "visualizer.");
      if (name !== null) {
        if (!PATTERN_SLUGS.includes(name)) {
          errors.push(`unknown visualizer "${name}" (see src/data/patterns.ts)`);
        }
        const preset = viz["preset"];
        visualizer =
          typeof preset === "string" ? { name, preset } : { name };
      }
    }
  }

  const sectionIssues = validateSections(body, status);
  errors.push(...sectionIssues.errors);
  warnings.push(...sectionIssues.warnings);

  if (status === "complete" && /\bTODO\b/.test(body)) {
    errors.push('body contains "TODO" but status is "complete"');
  }

  if (status === "complete") {
    for (const block of REQUIRED_BLOCKS) {
      if (!body.includes(block)) {
        errors.push(`missing ${block}> block — examples and constraints must be structured`);
      }
    }
  }

  if (
    id === null ||
    slug === null ||
    title === null ||
    leetcode === null ||
    url === null ||
    difficulty === null ||
    premium === null ||
    category === null ||
    patterns === null ||
    targetComplexity === null
  ) {
    return { meta: null, errors, warnings };
  }

  return {
    meta: {
      id,
      slug,
      title,
      leetcode,
      url,
      difficulty,
      premium,
      category: category as ProblemMeta["category"],
      patterns,
      prerequisites,
      targetComplexity,
      ...(visualizer ? { visualizer } : {}),
      status,
      file,
    },
    errors,
    warnings,
  };
}

/** Checks that all sections are present and in the canonical order. */
export function validateSections(
  body: string,
  status: ContentStatus,
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const positions: number[] = [];

  for (const section of REQUIRED_SECTIONS) {
    const at = body.search(new RegExp(`<${section}[\\s/>]`));
    if (at === -1) {
      const message = `missing section <${section}>`;
      if (status === "complete") errors.push(message);
      else warnings.push(message);
      continue;
    }
    positions.push(at);
  }

  const ordered = positions.every((p, i) => i === 0 || p > (positions[i - 1] ?? -1));
  if (!ordered) {
    errors.push(`sections must appear in this order: ${REQUIRED_SECTIONS.join(" → ")}`);
  }

  return { errors, warnings };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(
  data: Record<string, unknown>,
  key: string,
  errors: string[],
  prefix = "",
): string | null {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${prefix}${key} is required and must be a non-empty string`);
    return null;
  }
  return value;
}

function requireNumber(
  data: Record<string, unknown>,
  key: string,
  errors: string[],
): number | null {
  const value = data[key];
  if (typeof value !== "number" || Number.isNaN(value)) {
    errors.push(`${key} is required and must be a number`);
    return null;
  }
  return value;
}

function requireBoolean(
  data: Record<string, unknown>,
  key: string,
  errors: string[],
): boolean | null {
  const value = data[key];
  if (typeof value !== "boolean") {
    errors.push(`${key} is required and must be true or false`);
    return null;
  }
  return value;
}

function requireEnum(
  data: Record<string, unknown>,
  key: string,
  allowed: readonly string[],
  errors: string[],
): string | null {
  const value = data[key];
  if (typeof value !== "string" || !allowed.includes(value)) {
    errors.push(`${key} must be one of: ${allowed.join(", ")}`);
    return null;
  }
  return value;
}

function requireStringArray(
  data: Record<string, unknown>,
  key: string,
  errors: string[],
): string[] | null {
  const value = data[key];
  if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
    errors.push(`${key} must be a list of strings`);
    return null;
  }
  return value as string[];
}
