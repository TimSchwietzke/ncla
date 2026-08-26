import { describe, expect, it } from "vitest";
import { SCHEMA_VERSION, nextRevealed, parseProgressFile } from "./progress";

describe("nextRevealed", () => {
  it("unlocks one stage at a time", () => {
    expect(nextRevealed(0, 6)).toBe(1);
    expect(nextRevealed(3, 6)).toBe(4);
  });

  it("stops at the last stage instead of running past it", () => {
    expect(nextRevealed(6, 6)).toBe(6);
    expect(nextRevealed(99, 6)).toBe(6);
  });
});

describe("parseProgressFile", () => {
  it("reads a well-formed file", () => {
    const file = parseProgressFile({
      version: SCHEMA_VERSION,
      problems: { "two-sum": { revealed: 2, checklist: ["01"] } },
    });
    expect(file.problems["two-sum"]).toEqual({ revealed: 2, checklist: ["01"] });
  });

  it("keeps fields it does not own yet, so M4 data survives a round trip", () => {
    const file = parseProgressFile({
      version: SCHEMA_VERSION,
      problems: { "two-sum": { revealed: 1, checklist: [], rating: 4, dueOn: "2026-09-02" } },
    });
    expect(file.problems["two-sum"]?.rating).toBe(4);
    expect(file.problems["two-sum"]?.dueOn).toBe("2026-09-02");
  });

  it("falls back to empty on an unknown version rather than throwing", () => {
    expect(parseProgressFile({ version: 99, problems: { x: { revealed: 3 } } }).problems).toEqual({});
  });

  it("survives junk", () => {
    for (const junk of [null, undefined, 42, "nope", [], {}, { version: 1 }]) {
      expect(() => parseProgressFile(junk)).not.toThrow();
      expect(parseProgressFile(junk).problems).toEqual({});
    }
  });

  it("repairs entries with missing or wrong-typed fields", () => {
    const file = parseProgressFile({
      version: SCHEMA_VERSION,
      problems: {
        a: { checklist: ["01", 7, null] },
        b: { revealed: "lots" },
        c: "not an object",
      },
    });
    expect(file.problems["a"]).toEqual({ revealed: 0, checklist: ["01"] });
    expect(file.problems["b"]).toEqual({ revealed: 0, checklist: [] });
    expect(file.problems["c"]).toBeUndefined();
  });
});
