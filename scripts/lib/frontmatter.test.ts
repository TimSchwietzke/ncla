import { describe, expect, it } from "vitest";
import { REQUIRED_SECTIONS, parseProblem, validateSections } from "./frontmatter.ts";

const VALID_FRONTMATTER = {
  id: "1.3",
  slug: "two-sum",
  title: "Two Sum",
  leetcode: 1,
  url: "https://leetcode.com/problems/two-sum/",
  difficulty: "Easy",
  premium: false,
  category: "arrays-hashing",
  patterns: ["hashing-complement"],
  prerequisites: ["Hash map from value to index"],
  targetComplexity: { time: "O(n)", space: "O(n)" },
  status: "complete",
};

const VALID_BODY = REQUIRED_SECTIONS.map((s) => `<${s}>\ntext\n</${s}>`).join("\n\n");

function parse(overrides: Record<string, unknown> = {}, body = VALID_BODY, file?: string) {
  return parseProblem({
    file: file ?? "problems/arrays-hashing/03-two-sum.mdx",
    data: { ...VALID_FRONTMATTER, ...overrides },
    body,
  });
}

describe("parseProblem", () => {
  it("accepts a well-formed problem", () => {
    const result = parse();
    expect(result.errors).toEqual([]);
    expect(result.meta?.slug).toBe("two-sum");
    expect(result.meta?.file).toBe("problems/arrays-hashing/03-two-sum.mdx");
  });

  it("rejects a slug that does not match the filename", () => {
    const result = parse({ slug: "three-sum" });
    expect(result.errors.join(" ")).toContain("does not match filename slug");
  });

  it("rejects a category that does not match the directory", () => {
    const result = parse({ category: "two-pointers" });
    expect(result.errors.join(" ")).toContain("does not match directory");
  });

  it("rejects an unknown pattern", () => {
    const result = parse({ patterns: ["sliding-windows"] });
    expect(result.errors.join(" ")).toContain('unknown pattern "sliding-windows"');
  });

  it("rejects a non-LeetCode url", () => {
    const result = parse({ url: "https://example.com/two-sum" });
    expect(result.errors.join(" ")).toContain("leetcode.com/problems");
  });

  it("returns no meta when a required field is missing", () => {
    const result = parse({ title: undefined });
    expect(result.meta).toBeNull();
    expect(result.errors.join(" ")).toContain("title is required");
  });

  it("keeps an optional visualizer with its preset", () => {
    const result = parse({ visualizer: { name: "hashing-complement", preset: "two-sum" } });
    expect(result.errors).toEqual([]);
    expect(result.meta?.visualizer).toEqual({ name: "hashing-complement", preset: "two-sum" });
  });

  it("flags a TODO left in a completed file", () => {
    const result = parse({}, `${VALID_BODY}\n\nTODO: explain the trick`);
    expect(result.errors.join(" ")).toContain("TODO");
  });
});

describe("validateSections", () => {
  it("errors on a missing section when the file claims to be complete", () => {
    const body = VALID_BODY.replace("<Insight>\ntext\n</Insight>", "");
    expect(validateSections(body, "complete").errors).toContain("missing section <Insight>");
  });

  it("only warns about a missing section while the file is a draft", () => {
    const body = VALID_BODY.replace("<Insight>\ntext\n</Insight>", "");
    const result = validateSections(body, "draft");
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain("missing section <Insight>");
  });

  it("errors when sections are out of order", () => {
    const body = ["<Insight>\ntext\n</Insight>", "<Statement>\ntext\n</Statement>"]
      .concat(REQUIRED_SECTIONS.filter((s) => s !== "Insight" && s !== "Statement").map(
        (s) => `<${s}>\ntext\n</${s}>`,
      ))
      .join("\n\n");
    expect(validateSections(body, "complete").errors.join(" ")).toContain("must appear in this order");
  });
});
