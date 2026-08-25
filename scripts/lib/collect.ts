import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import matter from "gray-matter";
import type { ProblemSource } from "./frontmatter.ts";

export const REPO_ROOT = path.resolve(fileURLToPath(import.meta.url), "../../..");
export const CONTENT_ROOT = path.join(REPO_ROOT, "src", "content");
export const GENERATED_DIR = path.join(REPO_ROOT, "src", "data", "generated");

/** Reads every problem MDX file and splits it into frontmatter and body. */
export async function collectProblems(): Promise<ProblemSource[]> {
  const files = await fg("problems/**/*.mdx", { cwd: CONTENT_ROOT, onlyFiles: true });
  files.sort();

  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(CONTENT_ROOT, file), "utf8");
      const parsed = matter(raw);
      return {
        file: file.split(path.sep).join("/"),
        data: parsed.data as Record<string, unknown>,
        body: parsed.content,
      };
    }),
  );
}
