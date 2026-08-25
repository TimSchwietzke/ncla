import type { ComponentType } from "react";
import { PROBLEMS } from "../data/generated/index";
import type { ProblemMeta } from "../data/types";

type MdxModule = { default: ComponentType<Record<string, unknown>> };

/** Every problem page, loaded on demand — the bundle must not carry 150 MDX modules. */
const problemModules = import.meta.glob<MdxModule>("../content/problems/**/*.mdx");

export { PROBLEMS };

export function findProblem(category: string, slug: string): ProblemMeta | undefined {
  return PROBLEMS.find((p) => p.category === category && p.slug === slug);
}

export function problemsByCategory(category: string): ProblemMeta[] {
  return PROBLEMS.filter((p) => p.category === category);
}

export function problemsByPattern(pattern: string): ProblemMeta[] {
  return PROBLEMS.filter((p) => p.patterns.includes(pattern));
}

/** Resolves the MDX component for a problem, or null if the file is missing. */
export function loadProblemContent(meta: ProblemMeta): (() => Promise<MdxModule>) | null {
  return problemModules[`../content/${meta.file}`] ?? null;
}
